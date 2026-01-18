/**
 * MIDDLEWARE DE WHITELIST IP
 * 
 * Permet de restreindre l'accès admin à certaines adresses IP uniquement.
 * Utile pour une sécurité supplémentaire en production.
 */

/**
 * Middleware pour vérifier la whitelist IP
 */
export const ipWhitelist = (req, res, next) => {
  // Récupérer l'IP du client
  const clientIp = req.ip || 
                   req.headers['x-forwarded-for']?.split(',')[0] || 
                   req.connection.remoteAddress;
  
  // Récupérer la liste des IP autorisées depuis les variables d'environnement
  const allowedIPs = process.env.IP_WHITELIST?.split(',') || [];
  
  // Si la whitelist est vide, autoriser toutes les IP
  if (allowedIPs.length === 0) {
    return next();
  }
  
  // Vérifier si l'IP est dans la whitelist
  if (!allowedIPs.includes(clientIp.trim())) {
    return res.status(403).json({
      success: false,
      message: 'Accès refusé depuis cette adresse IP'
    });
  }
  
  next();
};
