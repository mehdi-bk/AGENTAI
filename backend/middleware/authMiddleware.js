/**
 * MIDDLEWARE D'AUTHENTIFICATION ADMIN
 * 
 * Valide les tokens JWT et vérifie que l'utilisateur est un admin
 * avec les permissions appropriées.
 * 
 * Vérifie également :
 * - Expiration de la session (15 minutes d'inactivité)
 * - Statut actif de l'admin
 * - 2FA activé (si requis)
 */

import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Middleware pour valider l'authentification admin
 */
export const validateAdmin = async (req, res, next) => {
  try {
    // Récupérer le token depuis les headers ou les cookies
    const token = req.headers.authorization?.replace('Bearer ', '') || 
                  req.cookies?.adminToken;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token d\'authentification manquant'
      });
    }
    
    // Vérifier et décoder le token JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token invalide ou expiré'
      });
    }
    
    // Récupérer l'admin depuis la base de données
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.adminId }
    });
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Admin introuvable'
      });
    }
    
    // Vérifier que l'admin est actif
    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Compte admin désactivé'
      });
    }
    
    // Vérifier si le compte est verrouillé (brute force)
    if (admin.lockedUntil && admin.lockedUntil > new Date()) {
      return res.status(403).json({
        success: false,
        message: 'Compte temporairement verrouillé. Réessayez plus tard.'
      });
    }
    
    // Vérifier la session dans la base de données
    const session = await prisma.adminSession.findFirst({
      where: {
        adminId: admin.id,
        token: token,
        expiresAt: { gt: new Date() }
      }
    });
    
    if (!session) {
      return res.status(401).json({
        success: false,
        message: 'Session expirée ou invalide'
      });
    }
    
    // Vérifier l'inactivité (15 minutes max)
    const inactivityLimit = 15 * 60 * 1000; // 15 minutes en millisecondes
    const timeSinceLastActivity = Date.now() - new Date(session.lastActivity).getTime();
    
    if (timeSinceLastActivity > inactivityLimit) {
      // Supprimer la session expirée
      await prisma.adminSession.delete({ where: { id: session.id } });
      
      return res.status(401).json({
        success: false,
        message: 'Session expirée par inactivité'
      });
    }
    
    // Mettre à jour la dernière activité
    await prisma.adminSession.update({
      where: { id: session.id },
      data: { lastActivity: new Date() }
    });
    
    // Vérifier la whitelist IP si activée
    if (process.env.IP_WHITELIST_ENABLED === 'true' && admin.ipWhitelist.length > 0) {
      const clientIp = req.ip || req.connection.remoteAddress;
      if (!admin.ipWhitelist.includes(clientIp)) {
        return res.status(403).json({
          success: false,
          message: 'Accès refusé depuis cette adresse IP'
        });
      }
    }
    
    // Ajouter l'admin et la session à la requête
    req.admin = admin;
    req.session = session;
    
    next();
  } catch (error) {
    console.error('Erreur dans validateAdmin:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur d\'authentification'
    });
  }
};

/**
 * Middleware pour vérifier les rôles spécifiques
 */
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Non authentifié'
      });
    }
    
    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        message: 'Permissions insuffisantes'
      });
    }
    
    next();
  };
};

/**
 * Middleware pour vérifier que le 2FA est activé
 */
export const require2FA = (req, res, next) => {
  if (!req.admin) {
    return res.status(401).json({
      success: false,
      message: 'Non authentifié'
    });
  }
  
  if (!req.admin.twoFactorEnabled) {
    return res.status(403).json({
      success: false,
      message: 'L\'authentification à deux facteurs est requise'
    });
  }
  
  next();
};
