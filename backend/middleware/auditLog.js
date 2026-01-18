/**
 * MIDDLEWARE DE LOGS D'AUDIT
 * 
 * Enregistre toutes les actions admin dans la base de données
 * pour un audit complet et traçable.
 * 
 * Enregistre :
 * - L'admin qui a effectué l'action
 * - Le type d'action (CREATE, UPDATE, DELETE, etc.)
 * - La ressource concernée
 * - Les détails de l'action
 * - L'IP et le User-Agent
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Middleware pour logger les actions admin
 */
export const auditLog = async (req, res, next) => {
  // Sauvegarder la fonction res.json originale
  const originalJson = res.json.bind(res);
  
  // Override res.json pour capturer la réponse
  res.json = function(data) {
    // Logger l'action après la réponse
    logAction(req, res, data).catch(err => {
      console.error('Erreur lors du log d\'audit:', err);
    });
    
    // Appeler la fonction originale
    return originalJson(data);
  };
  
  next();
};

/**
 * Enregistre une action dans les logs d'audit
 */
const logAction = async (req, res, data) => {
  try {
    // Ne logger que si l'admin est authentifié
    if (!req.admin) return;
    
    // Déterminer le type d'action depuis la méthode HTTP
    let action = 'READ';
    if (req.method === 'POST') action = 'CREATE';
    else if (req.method === 'PUT' || req.method === 'PATCH') action = 'UPDATE';
    else if (req.method === 'DELETE') action = 'DELETE';
    
    // Déterminer la ressource depuis l'URL
    const resource = determineResource(req.path);
    
    // Extraire l'ID de la ressource si disponible
    const resourceId = extractResourceId(req);
    
    // Préparer les détails
    const details = {
      method: req.method,
      path: req.path,
      query: req.query,
      body: sanitizeBody(req.body), // Sanitizer pour éviter de logger des données sensibles
      response: {
        success: data.success,
        statusCode: res.statusCode
      }
    };
    
    // Récupérer l'IP et le User-Agent
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    
    // Enregistrer dans la base de données
    await prisma.auditLog.create({
      data: {
        adminId: req.admin.id,
        action,
        resource,
        resourceId,
        details,
        ipAddress,
        userAgent
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du log d\'audit:', error);
  }
};

/**
 * Détermine le type de ressource depuis l'URL
 */
const determineResource = (path) => {
  if (path.includes('/clients')) return 'CLIENT';
  if (path.includes('/invoices')) return 'INVOICE';
  if (path.includes('/refunds')) return 'REFUND';
  if (path.includes('/promo-codes')) return 'PROMO_CODE';
  if (path.includes('/admin')) return 'ADMIN';
  if (path.includes('/dashboard')) return 'DASHBOARD';
  return 'UNKNOWN';
};

/**
 * Extrait l'ID de la ressource depuis la requête
 */
const extractResourceId = (req) => {
  // Essayer depuis les paramètres de route
  if (req.params.id) return req.params.id;
  if (req.params.clientId) return req.params.clientId;
  if (req.params.invoiceId) return req.params.invoiceId;
  
  // Essayer depuis le body
  if (req.body.id) return req.body.id;
  if (req.body.clientId) return req.body.clientId;
  if (req.body.invoiceId) return req.body.invoiceId;
  
  return null;
};

/**
 * Sanitise le body pour éviter de logger des données sensibles
 */
const sanitizeBody = (body) => {
  if (!body || typeof body !== 'object') return body;
  
  const sensitiveFields = ['password', 'passwordHash', 'token', 'secret', 'apiKey'];
  const sanitized = { ...body };
  
  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  }
  
  return sanitized;
};

/**
 * Fonction utilitaire pour logger manuellement une action
 */
export const logAdminAction = async (adminId, actionType, targetType, targetId, metadata = {}) => {
  try {
    await prisma.adminAction.create({
      data: {
        adminId,
        actionType,
        targetType,
        targetId,
        metadata
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'action admin:', error);
  }
};
