/**
 * MIDDLEWARE DE PROTECTION CONTRE LE BRUTE FORCE
 * 
 * Détecte et bloque automatiquement les tentatives de brute force
 * en comptant les échecs de connexion et en verrouillant temporairement
 * les comptes ou IP après un certain nombre de tentatives.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const MAX_ATTEMPTS = parseInt(process.env.BRUTE_FORCE_MAX_ATTEMPTS) || 5;
const BLOCK_DURATION_MS = parseInt(process.env.BRUTE_FORCE_BLOCK_DURATION_MS) || 3600000; // 1 heure par défaut

/**
 * Enregistre une tentative de connexion échouée
 */
export const recordFailedAttempt = async (identifier, type = 'EMAIL') => {
  try {
    const existing = await prisma.bruteForceAttempt.findUnique({
      where: {
        identifier_type: {
          identifier,
          type
        }
      }
    });
    
    if (existing) {
      const newAttempts = existing.attempts + 1;
      const blockedUntil = newAttempts >= MAX_ATTEMPTS 
        ? new Date(Date.now() + BLOCK_DURATION_MS)
        : null;
      
      await prisma.bruteForceAttempt.update({
        where: { id: existing.id },
        data: {
          attempts: newAttempts,
          blockedUntil,
          updatedAt: new Date()
        }
      });
      
      return {
        attempts: newAttempts,
        blocked: newAttempts >= MAX_ATTEMPTS,
        blockedUntil
      };
    } else {
      const blockedUntil = 1 >= MAX_ATTEMPTS 
        ? new Date(Date.now() + BLOCK_DURATION_MS)
        : null;
      
      await prisma.bruteForceAttempt.create({
        data: {
          identifier,
          type,
          attempts: 1,
          blockedUntil
        }
      });
      
      return {
        attempts: 1,
        blocked: false,
        blockedUntil: null
      };
    }
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de la tentative:', error);
    return null;
  }
};

/**
 * Vérifie si un identifiant est bloqué
 */
export const isBlocked = async (identifier, type = 'EMAIL') => {
  try {
    const attempt = await prisma.bruteForceAttempt.findUnique({
      where: {
        identifier_type: {
          identifier,
          type
        }
      }
    });
    
    if (!attempt) return false;
    
    // Si bloqué et la date de blocage n'est pas passée
    if (attempt.blockedUntil && attempt.blockedUntil > new Date()) {
      return true;
    }
    
    // Si la date de blocage est passée, réinitialiser
    if (attempt.blockedUntil && attempt.blockedUntil <= new Date()) {
      await prisma.bruteForceAttempt.update({
        where: { id: attempt.id },
        data: {
          attempts: 0,
          blockedUntil: null
        }
      });
    }
    
    return false;
  } catch (error) {
    console.error('Erreur lors de la vérification du blocage:', error);
    return false;
  }
};

/**
 * Réinitialise les tentatives après une connexion réussie
 */
export const resetAttempts = async (identifier, type = 'EMAIL') => {
  try {
    await prisma.bruteForceAttempt.deleteMany({
      where: {
        identifier,
        type
      }
    });
  } catch (error) {
    console.error('Erreur lors de la réinitialisation des tentatives:', error);
  }
};

/**
 * Middleware pour vérifier le blocage avant l'authentification
 */
export const bruteForceProtection = async (req, res, next) => {
  const identifier = req.body.email || req.body.identifier || req.ip;
  const type = req.body.email ? 'EMAIL' : 'IP';
  
  const blocked = await isBlocked(identifier, type);
  
  if (blocked) {
    return res.status(429).json({
      success: false,
      message: 'Trop de tentatives échouées. Compte temporairement bloqué. Réessayez plus tard.'
    });
  }
  
  next();
};
