/**
 * MIDDLEWARE DE GESTION DES ERREURS
 * 
 * Capture et gère toutes les erreurs de manière centralisée.
 * Ne révèle pas d'informations sensibles en production.
 */

/**
 * Middleware de gestion des erreurs
 */
export const errorHandler = (err, req, res, next) => {
    // Log l'erreur
    console.error('Erreur:', {
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        path: req.path,
        method: req.method,
        ip: req.ip
    });

    // Erreur de validation
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Erreur de validation',
            errors: err.errors
        });
    }

    // Erreur JWT
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Token invalide'
        });
    }

    // Erreur JWT expiré
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Token expiré'
        });
    }

    // Erreur Prisma
    if (err.code === 'P2002') {
        return res.status(409).json({
            success: false,
            message: 'Un enregistrement avec cette valeur existe déjà'
        });
    }

    // Erreur par défaut
    const statusCode = err.statusCode || err.status || 500;
    const message = process.env.NODE_ENV === 'production'
        ? 'Une erreur est survenue'
        : err.message;

    // MBK: Production error handling - never expose stack traces
    const response = {
        success: false,
        message
    };

    // Only include stack trace in development
    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
        response.error = err.message;
    }

    res.status(statusCode).json(response);
};
