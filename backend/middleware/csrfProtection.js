/**
 * MIDDLEWARE DE PROTECTION CSRF
 * 
 * Génère et valide des tokens CSRF uniques pour chaque requête
 * modifiant l'état (POST, PUT, DELETE, PATCH).
 * 
 * Le token CSRF est généré lors de la connexion et doit être
 * inclus dans les headers de toutes les requêtes modifiantes.
 * 
 * MBK: CSRF protection middleware implementation
 */

import { randomBytes } from 'crypto';

// Stockage en mémoire des tokens CSRF (en production, utiliser Redis)
const csrfTokens = new Map();

/**
 * Génère un token CSRF unique
 */
export const generateCSRFToken = () => {
    const token = randomBytes(32).toString('hex');
    const expiresAt = Date.now() + (60 * 60 * 1000); // 1 heure
    csrfTokens.set(token, expiresAt);

    // Nettoyer les tokens expirés toutes les heures
    setTimeout(() => {
        csrfTokens.delete(token);
    }, 60 * 60 * 1000);

    return token;
};

/**
 * Valide un token CSRF
 */
export const validateCSRFToken = (token) => {
    if (!token) return false;

    const expiresAt = csrfTokens.get(token);
    if (!expiresAt) return false;

    // Vérifier si le token n'est pas expiré
    if (Date.now() > expiresAt) {
        csrfTokens.delete(token);
        return false;
    }

    // Token valide, le supprimer pour usage unique
    csrfTokens.delete(token);
    return true;
};

/**
 * Middleware de protection CSRF
 */
export const csrfProtection = (req, res, next) => {
    // Méthodes qui nécessitent une protection CSRF
    const methodsRequiringCSRF = ['POST', 'PUT', 'DELETE', 'PATCH'];

    // Ignorer les méthodes GET, HEAD, OPTIONS
    if (!methodsRequiringCSRF.includes(req.method)) {
        return next();
    }

    // Exclure les routes d'authentification publique (login, verify-2fa)
    // car elles nécessitent un accès sans authentification préalable
    const publicAuthRoutes = ['/api/auth/login', '/api/auth/verify-2fa', '/api/auth/setup-2fa'];
    if (publicAuthRoutes.some(route => req.path === route)) {
        return next();
    }

    // Récupérer le token depuis les headers
    const csrfToken = req.headers['x-csrf-token'] || req.body._csrf;

    if (!csrfToken) {
        return res.status(403).json({
            success: false,
            message: 'Token CSRF manquant'
        });
    }

    if (!validateCSRFToken(csrfToken)) {
        return res.status(403).json({
            success: false,
            message: 'Token CSRF invalide ou expiré'
        });
    }

    next();
};

/**
 * Route pour obtenir un nouveau token CSRF
 */
export const getCSRFToken = (req, res) => {
    const token = generateCSRFToken();
    res.json({
        success: true,
        csrfToken: token
    });
};
