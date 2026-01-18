/**
 * MIDDLEWARE DE RATE LIMITING STRICT
 * 
 * Limite le nombre de requêtes par IP pour prévenir les attaques DDoS
 * et les tentatives de brute force.
 * 
 * Configuration :
 * - Max 5 requêtes par minute pour les routes admin
 * - Max 10 requêtes par minute pour les routes auth
 * - Max 100 requêtes par minute pour les autres routes
 */

import rateLimit from 'express-rate-limit';

// Rate limiter pour les routes d'authentification (plus strict)
export const authRateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000, // 1 minute
  max: 5, // 5 tentatives max par minute
  message: {
    success: false,
    message: 'Trop de tentatives de connexion. Veuillez réessayer dans quelques minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
  // Identifier par IP
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress;
  }
});

// Rate limiter pour les routes admin (très strict)
export const adminRateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 5,
  message: {
    success: false,
    message: 'Trop de requêtes. Veuillez ralentir.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Ne pas compter les requêtes réussies pour éviter de bloquer les admins légitimes
  skipSuccessfulRequests: true,
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress;
  }
});

// Rate limiter général (moins strict)
export const rateLimiter = rateLimit({
  windowMs: 60000, // 1 minute
  max: 100, // 100 requêtes max par minute
  message: {
    success: false,
    message: 'Trop de requêtes. Veuillez réessayer plus tard.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress;
  }
});
