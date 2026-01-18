/**
 * ROUTES DE GESTION DES REMBOURSEMENTS
 * 
 * Gère toutes les opérations sur les remboursements
 */

import express from 'express';
import { PrismaClient } from '@prisma/client';
import { body, query, validationResult } from 'express-validator';
import { logAdminAction } from '../middleware/auditLog.js';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/admin/refunds
 * Liste tous les remboursements avec filtres
 */
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      clientId,
      status,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const where = {};
    
    if (clientId) {
      where.clientId = clientId;
    }
    
    if (status) {
      where.status = status;
    }
    
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }
    
    const [refunds, total] = await Promise.all([
      prisma.refund.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: {
          [sortBy]: sortOrder
        },
        include: {
          client: {
            select: {
              id: true,
              email: true,
              fullName: true,
              company: true
            }
          }
        }
      }),
      prisma.refund.count({ where })
    ]);
    
    res.json({
      success: true,
      data: refunds,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des remboursements:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des remboursements'
    });
  }
});

/**
 * GET /api/admin/refunds/:id
 * Récupère les détails d'un remboursement
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const refund = await prisma.refund.findUnique({
      where: { id },
      include: {
        client: true
      }
    });
    
    if (!refund) {
      return res.status(404).json({
        success: false,
        message: 'Remboursement introuvable'
      });
    }
    
    res.json({
      success: true,
      data: refund
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du remboursement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du remboursement'
    });
  }
});

/**
 * POST /api/admin/refunds
 * Crée une nouvelle demande de remboursement
 */
router.post('/',
  [
    body('clientId').notEmpty(),
    body('amount').isFloat({ min: 0 }),
    body('reason').notEmpty().isString()
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
      
      const { clientId, invoiceId, amount, reason, currency = 'EUR' } = req.body;
      
      const refund = await prisma.refund.create({
        data: {
          clientId,
          invoiceId,
          amount: parseFloat(amount),
          currency,
          reason,
          status: 'PENDING'
        },
        include: {
          client: true
        }
      });
      
      await logAdminAction(
        req.admin.id,
        'CREATE',
        'REFUND',
        refund.id,
        { amount, reason }
      );
      
      res.status(201).json({
        success: true,
        data: refund
      });
    } catch (error) {
      console.error('Erreur lors de la création du remboursement:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création du remboursement'
      });
    }
  }
);

/**
 * PATCH /api/admin/refunds/:id/status
 * Change le statut d'un remboursement
 */
router.patch('/:id/status',
  [
    body('status').isIn(['PENDING', 'APPROVED', 'REJECTED', 'PROCESSED']),
    body('adminNotes').optional().isString()
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
      const { status, adminNotes } = req.body;
      
      const refund = await prisma.refund.findUnique({
        where: { id }
      });
      
      if (!refund) {
        return res.status(404).json({
          success: false,
          message: 'Remboursement introuvable'
        });
      }
      
      const updateData = {
        status,
        adminNotes,
        ...(status === 'PROCESSED' && {
          processedBy: req.admin.id,
          processedAt: new Date()
        })
      };
      
      const updatedRefund = await prisma.refund.update({
        where: { id },
        data: updateData
      });
      
      await logAdminAction(
        req.admin.id,
        'STATUS_CHANGE',
        'REFUND',
        id,
        { oldStatus: refund.status, newStatus: status, adminNotes }
      );
      
      res.json({
        success: true,
        data: updatedRefund
      });
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors du changement de statut'
      });
    }
  }
);

/**
 * PATCH /api/admin/refunds/:id/notes
 * Ajoute ou modifie les notes administratives
 */
router.patch('/:id/notes',
  [body('adminNotes').notEmpty().isString()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Notes invalides'
        });
      }
      
      const { id } = req.params;
      const { adminNotes } = req.body;
      
      const refund = await prisma.refund.update({
        where: { id },
        data: { adminNotes }
      });
      
      await logAdminAction(
        req.admin.id,
        'UPDATE_NOTES',
        'REFUND',
        id,
        { adminNotes }
      );
      
      res.json({
        success: true,
        data: refund
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour des notes:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour des notes'
      });
    }
  }
);

export default router;
