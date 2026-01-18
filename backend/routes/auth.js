/**
 * ROUTES D'AUTHENTIFICATION ADMIN
 * 
 * Gère :
 * - Connexion avec email/password
 * - Génération et vérification 2FA
 * - Refresh tokens
 * - Déconnexion
 * 
 * MBK: Admin authentication routes with 2FA support
 */

import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import { authRateLimiter } from '../middleware/rateLimiter.js';
import { bruteForceProtection, recordFailedAttempt, resetAttempts, isBlocked } from '../middleware/bruteForceProtection.js';
import { generateCSRFToken } from '../middleware/csrfProtection.js';

const router = express.Router();
const prisma = new PrismaClient();
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 12;

/**
 * POST /api/auth/login
 * Connexion admin avec email et mot de passe
 */
router.post('/login', 
  authRateLimiter,
  bruteForceProtection,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 })
  ],
  async (req, res) => {
    try {
      // Validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Données invalides',
          errors: errors.array()
        });
      }
      
      const { email, password } = req.body;
      
      // Vérifier si bloqué
      const blocked = await isBlocked(email, 'EMAIL');
      if (blocked) {
        return res.status(429).json({
          success: false,
          message: 'Trop de tentatives échouées. Compte temporairement bloqué.'
        });
      }
      
      // Récupérer l'admin
      const admin = await prisma.admin.findUnique({
        where: { email }
      });
      
      if (!admin) {
        await recordFailedAttempt(email, 'EMAIL');
        return res.status(401).json({
          success: false,
          message: 'Email ou mot de passe incorrect'
        });
      }
      
      // Vérifier si le compte est actif
      if (!admin.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Compte désactivé'
        });
      }
      
      // Vérifier si le compte est verrouillé
      if (admin.lockedUntil && admin.lockedUntil > new Date()) {
        return res.status(403).json({
          success: false,
          message: 'Compte temporairement verrouillé. Réessayez plus tard.'
        });
      }
      
      // Vérifier le mot de passe
      const passwordValid = await bcrypt.compare(password, admin.passwordHash);
      
      if (!passwordValid) {
        await recordFailedAttempt(email, 'EMAIL');
        
        // Incrémenter les tentatives échouées
        await prisma.admin.update({
          where: { id: admin.id },
          data: {
            failedLoginAttempts: admin.failedLoginAttempts + 1,
            lockedUntil: admin.failedLoginAttempts + 1 >= 5 
              ? new Date(Date.now() + 3600000) // 1 heure
              : admin.lockedUntil
          }
        });
        
        return res.status(401).json({
          success: false,
          message: 'Email ou mot de passe incorrect'
        });
      }
      
      // Réinitialiser les tentatives échouées
      await resetAttempts(email, 'EMAIL');
      await prisma.admin.update({
        where: { id: admin.id },
        data: {
          failedLoginAttempts: 0,
          lockedUntil: null,
          lastLogin: new Date(),
          lastLoginIp: req.ip || req.connection.remoteAddress
        }
      });
      
      // Si 2FA est activé, retourner un token temporaire et demander le code 2FA
      if (admin.twoFactorEnabled) {
        const tempToken = jwt.sign(
          { adminId: admin.id, requires2FA: true },
          process.env.JWT_SECRET,
          { expiresIn: '5m' }
        );
        
        return res.json({
          success: true,
          requires2FA: true,
          tempToken,
          message: 'Code 2FA requis'
        });
      }
      
      // Générer les tokens JWT
      const token = jwt.sign(
        { adminId: admin.id, role: admin.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
      );
      
      const refreshToken = jwt.sign(
        { adminId: admin.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
      );
      
      // Créer la session
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      const session = await prisma.adminSession.create({
        data: {
          adminId: admin.id,
          token,
          refreshToken,
          ipAddress: req.ip || req.connection.remoteAddress,
          userAgent: req.headers['user-agent'],
          expiresAt
        }
      });
      
      // Générer un token CSRF
      const csrfToken = generateCSRFToken();
      
      res.json({
        success: true,
        token,
        refreshToken,
        csrfToken,
        admin: {
          id: admin.id,
          email: admin.email,
          fullName: admin.fullName,
          role: admin.role
        }
      });
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la connexion'
      });
    }
  }
);

/**
 * POST /api/auth/verify-2fa
 * Vérifie le code 2FA et complète la connexion
 */
router.post('/verify-2fa',
  authRateLimiter,
  [
    body('tempToken').notEmpty(),
    body('code').isLength({ min: 6, max: 6 })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Données invalides'
        });
      }
      
      const { tempToken, code } = req.body;
      
      // Vérifier le token temporaire
      let decoded;
      try {
        decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
      } catch (error) {
        return res.status(401).json({
          success: false,
          message: 'Token invalide ou expiré'
        });
      }
      
      if (!decoded.requires2FA || !decoded.adminId) {
        return res.status(400).json({
          success: false,
          message: 'Token invalide'
        });
      }
      
      // Récupérer l'admin
      const admin = await prisma.admin.findUnique({
        where: { id: decoded.adminId }
      });
      
      if (!admin || !admin.twoFactorEnabled || !admin.twoFactorSecret) {
        return res.status(400).json({
          success: false,
          message: '2FA non configuré'
        });
      }
      
      // Vérifier le code TOTP
      const verified = speakeasy.totp.verify({
        secret: admin.twoFactorSecret,
        encoding: 'base32',
        token: code,
        window: 2 // Tolérance de 2 périodes (60 secondes)
      });
      
      if (!verified) {
        return res.status(401).json({
          success: false,
          message: 'Code 2FA invalide'
        });
      }
      
      // Générer les tokens finaux
      const token = jwt.sign(
        { adminId: admin.id, role: admin.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
      );
      
      const refreshToken = jwt.sign(
        { adminId: admin.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
      );
      
      // Créer la session
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
      await prisma.adminSession.create({
        data: {
          adminId: admin.id,
          token,
          refreshToken,
          ipAddress: req.ip || req.connection.remoteAddress,
          userAgent: req.headers['user-agent'],
          expiresAt
        }
      });
      
      const csrfToken = generateCSRFToken();
      
      res.json({
        success: true,
        token,
        refreshToken,
        csrfToken,
        admin: {
          id: admin.id,
          email: admin.email,
          fullName: admin.fullName,
          role: admin.role
        }
      });
    } catch (error) {
      console.error('Erreur lors de la vérification 2FA:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la vérification'
      });
    }
  }
);

/**
 * POST /api/auth/setup-2fa
 * Configure le 2FA pour un admin (nécessite authentification)
 */
router.post('/setup-2fa', async (req, res) => {
  try {
    // Cette route nécessiterait une authentification préalable
    // Pour simplifier, on suppose que l'admin est déjà authentifié
    
    const { adminId } = req.body;
    
    if (!adminId) {
      return res.status(400).json({
        success: false,
        message: 'Admin ID requis'
      });
    }
    
    // Générer un secret TOTP
    const secret = speakeasy.generateSecret({
      name: `${process.env.TOTP_ISSUER || 'Admin Panel'} (${req.body.email || 'admin'})`,
      issuer: process.env.TOTP_ISSUER || 'Admin Panel'
    });
    
    // Générer des codes de secours
    const backupCodes = Array.from({ length: 10 }, () => 
      Math.random().toString(36).substring(2, 10).toUpperCase()
    );
    
    // Générer le QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);
    
    res.json({
      success: true,
      secret: secret.base32,
      qrCode: qrCodeUrl,
      backupCodes
    });
  } catch (error) {
    console.error('Erreur lors de la configuration 2FA:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la configuration'
    });
  }
});

/**
 * POST /api/auth/refresh
 * Rafraîchit le token d'accès
 */
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token requis'
      });
    }
    
    // Vérifier le refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token invalide ou expiré'
      });
    }
    
    // Vérifier la session
    const session = await prisma.adminSession.findFirst({
      where: {
        adminId: decoded.adminId,
        refreshToken
      },
      include: { admin: true }
    });
    
    if (!session || !session.admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Session invalide'
      });
    }
    
    // Générer un nouveau token
    const newToken = jwt.sign(
      { adminId: decoded.adminId, role: session.admin.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );
    
    // Mettre à jour la session
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await prisma.adminSession.update({
      where: { id: session.id },
      data: {
        token: newToken,
        expiresAt,
        lastActivity: new Date()
      }
    });
    
    const csrfToken = generateCSRFToken();
    
    res.json({
      success: true,
      token: newToken,
      csrfToken
    });
  } catch (error) {
    console.error('Erreur lors du rafraîchissement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du rafraîchissement'
    });
  }
});

/**
 * POST /api/auth/logout
 * Déconnexion et suppression de la session
 */
router.post('/logout', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      await prisma.adminSession.deleteMany({
        where: { token }
      });
    }
    
    res.json({
      success: true,
      message: 'Déconnexion réussie'
    });
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la déconnexion'
    });
  }
});

export default router;
