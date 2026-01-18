/**
 * ROUTES DE GESTION DES CODES PROMOTIONNELS
 * 
 * Gère toutes les opérations sur les codes promo
 */

import express from 'express';
import { PrismaClient } from '@prisma/client';
import { body, query, validationResult } from 'express-validator';
import { logAdminAction } from '../middleware/auditLog.js';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/admin/promo-codes
 * Liste tous les codes promotionnels
 */
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const where = {};
    
    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }
    
    const [promoCodes, total] = await Promise.all([
      prisma.promoCode.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: {
          [sortBy]: sortOrder
        },
        include: {
          _count: {
            select: {
              usages: true
            }
          }
        }
      }),
      prisma.promoCode.count({ where })
    ]);
    
    // Enrichir avec les statistiques d'utilisation
    const enrichedCodes = promoCodes.map(code => ({
      ...code,
      totalUses: code._count.usages,
      remainingUses: code.maxUses ? code.maxUses - code._count.usages : null,
      isExpired: new Date(code.endDate) < new Date(),
      isActiveNow: code.isActive && new Date(code.startDate) <= new Date() && new Date(code.endDate) >= new Date()
    }));
    
    res.json({
      success: true,
      data: enrichedCodes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des codes promo:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des codes promo'
    });
  }
});

/**
 * GET /api/admin/promo-codes/:id
 * Récupère les détails d'un code promo
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const promoCode = await prisma.promoCode.findUnique({
      where: { id },
      include: {
        usages: {
          include: {
            promoCode: true
          },
          orderBy: {
            usedAt: 'desc'
          },
          take: 50
        }
      }
    });
    
    if (!promoCode) {
      return res.status(404).json({
        success: false,
        message: 'Code promotionnel introuvable'
      });
    }
    
    res.json({
      success: true,
      data: promoCode
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du code promo:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du code promo'
    });
  }
});

/**
 * POST /api/admin/promo-codes
 * Crée un nouveau code promotionnel
 */
router.post('/',
  [
    body('code').notEmpty().isString().isUppercase(),
    body('discountType').isIn(['PERCENTAGE', 'FIXED_AMOUNT']),
    body('discountValue').isFloat({ min: 0 }),
    body('startDate').isISO8601(),
    body('endDate').isISO8601(),
    body('maxUsesPerUser').optional().isInt({ min: 1 }),
    body('maxUses').optional().isInt({ min: 1 }),
    body('restrictedPlans').optional().isArray(),
    body('newCustomersOnly').optional().isBoolean()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Données invalides',
          errors: errors.array()
        });
      }
      
      const {
        code,
        discountType,
        discountValue,
        startDate,
        endDate,
        maxUses,
        maxUsesPerUser = 1,
        restrictedPlans = [],
        newCustomersOnly = false
      } = req.body;
      
      // Vérifier que le code n'existe pas déjà
      const existing = await prisma.promoCode.findUnique({
        where: { code: code.toUpperCase() }
      });
      
      if (existing) {
        return res.status(409).json({
          success: false,
          message: 'Ce code promotionnel existe déjà'
        });
      }
      
      // Valider les dates
      if (new Date(startDate) >= new Date(endDate)) {
        return res.status(400).json({
          success: false,
          message: 'La date de fin doit être après la date de début'
        });
      }
      
      // Valider le pourcentage (max 100%)
      if (discountType === 'PERCENTAGE' && discountValue > 100) {
        return res.status(400).json({
          success: false,
          message: 'Le pourcentage de réduction ne peut pas dépasser 100%'
        });
      }
      
      const promoCode = await prisma.promoCode.create({
        data: {
          code: code.toUpperCase(),
          discountType,
          discountValue: parseFloat(discountValue),
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          maxUses: maxUses ? parseInt(maxUses) : null,
          maxUsesPerUser: parseInt(maxUsesPerUser),
          restrictedPlans,
          newCustomersOnly
        }
      });
      
      await logAdminAction(
        req.admin.id,
        'CREATE',
        'PROMO_CODE',
        promoCode.id,
        { code, discountType, discountValue }
      );
      
      res.status(201).json({
        success: true,
        data: promoCode
      });
    } catch (error) {
      console.error('Erreur lors de la création du code promo:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création du code promo'
      });
    }
  }
);

/**
 * PATCH /api/admin/promo-codes/:id
 * Met à jour un code promotionnel
 */
router.patch('/:id',
  [
    body('isActive').optional().isBoolean(),
    body('endDate').optional().isISO8601(),
    body('maxUses').optional().isInt({ min: 1 })
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
      
      const { id } = req.params;
      const updateData = {};
      
      if (req.body.isActive !== undefined) {
        updateData.isActive = req.body.isActive;
      }
      
      if (req.body.endDate) {
        updateData.endDate = new Date(req.body.endDate);
      }
      
      if (req.body.maxUses !== undefined) {
        updateData.maxUses = parseInt(req.body.maxUses);
      }
      
      const promoCode = await prisma.promoCode.update({
        where: { id },
        data: updateData
      });
      
      await logAdminAction(
        req.admin.id,
        'UPDATE',
        'PROMO_CODE',
        id,
        updateData
      );
      
      res.json({
        success: true,
        data: promoCode
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour'
      });
    }
  }
);

/**
 * DELETE /api/admin/promo-codes/:id
 * Désactive un code promotionnel
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Désactiver plutôt que supprimer pour garder l'historique
    const promoCode = await prisma.promoCode.update({
      where: { id },
      data: { isActive: false }
    });
    
    await logAdminAction(
      req.admin.id,
      'DEACTIVATE',
      'PROMO_CODE',
      id,
      {}
    );
    
    res.json({
      success: true,
      data: promoCode
    });
  } catch (error) {
    console.error('Erreur lors de la désactivation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la désactivation'
    });
  }
});

/**
 * GET /api/admin/promo-codes/:id/stats
 * Récupère les statistiques d'utilisation d'un code promo
 */
router.get('/:id/stats', async (req, res) => {
  try {
    const { id } = req.params;
    
    const promoCode = await prisma.promoCode.findUnique({
      where: { id },
      include: {
        usages: {
          include: {
            promoCode: true
          }
        }
      }
    });
    
    if (!promoCode) {
      return res.status(404).json({
        success: false,
        message: 'Code promotionnel introuvable'
      });
    }
    
    // Calculer les statistiques
    const totalUses = promoCode.usages.length;
    const totalDiscount = promoCode.usages.reduce((sum, usage) => sum + usage.discountAmount, 0);
    const uniqueUsers = new Set(promoCode.usages.map(u => u.clientId)).size;
    
    // Utilisation par jour
    const usageByDay = {};
    promoCode.usages.forEach(usage => {
      const day = usage.usedAt.toISOString().split('T')[0];
      usageByDay[day] = (usageByDay[day] || 0) + 1;
    });
    
    res.json({
      success: true,
      data: {
        code: promoCode.code,
        totalUses,
        totalDiscount,
        uniqueUsers,
        usageByDay,
        remainingUses: promoCode.maxUses ? promoCode.maxUses - totalUses : null,
        isExpired: new Date(promoCode.endDate) < new Date(),
        isActive: promoCode.isActive && new Date(promoCode.startDate) <= new Date() && new Date(promoCode.endDate) >= new Date()
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des stats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
});

export default router;
