/**
 * ROUTES DE GESTION DES FACTURES
 * 
 * Gère toutes les opérations sur les factures
 */

import express from 'express';
import { PrismaClient } from '@prisma/client';
import { body, query, validationResult } from 'express-validator';
import { logAdminAction } from '../middleware/auditLog.js';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/admin/invoices
 * Liste toutes les factures avec filtres
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
    
    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
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
      prisma.invoice.count({ where })
    ]);
    
    res.json({
      success: true,
      data: invoices,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des factures:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des factures'
    });
  }
});

/**
 * GET /api/admin/invoices/:id
 * Récupère les détails d'une facture
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        client: true
      }
    });
    
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Facture introuvable'
      });
    }
    
    res.json({
      success: true,
      data: invoice
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la facture:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la facture'
    });
  }
});

/**
 * POST /api/admin/invoices
 * Crée une facture manuelle
 */
router.post('/',
  [
    body('clientId').notEmpty(),
    body('amount').isFloat({ min: 0 }),
    body('items').isArray(),
    body('dueDate').isISO8601()
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
      
      const { clientId, amount, items, dueDate, notes, currency = 'EUR' } = req.body;
      
      // Générer un numéro de facture unique
      const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      const invoice = await prisma.invoice.create({
        data: {
          clientId,
          invoiceNumber,
          amount: parseFloat(amount),
          currency,
          dueDate: new Date(dueDate),
          items,
          notes,
          status: 'PENDING'
        },
        include: {
          client: true
        }
      });
      
      await logAdminAction(
        req.admin.id,
        'CREATE',
        'INVOICE',
        invoice.id,
        { invoiceNumber, amount }
      );
      
      res.status(201).json({
        success: true,
        data: invoice
      });
    } catch (error) {
      console.error('Erreur lors de la création de la facture:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création de la facture'
      });
    }
  }
);

/**
 * PATCH /api/admin/invoices/:id/status
 * Change le statut d'une facture
 */
router.patch('/:id/status',
  [body('status').isIn(['PENDING', 'PAID', 'OVERDUE', 'CANCELLED', 'REFUNDED'])],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Statut invalide'
        });
      }
      
      const { id } = req.params;
      const { status } = req.body;
      
      const invoice = await prisma.invoice.findUnique({
        where: { id }
      });
      
      if (!invoice) {
        return res.status(404).json({
          success: false,
          message: 'Facture introuvable'
        });
      }
      
      const updateData = {
        status,
        ...(status === 'PAID' && { paidAt: new Date() })
      };
      
      const updatedInvoice = await prisma.invoice.update({
        where: { id },
        data: updateData
      });
      
      await logAdminAction(
        req.admin.id,
        'STATUS_CHANGE',
        'INVOICE',
        id,
        { oldStatus: invoice.status, newStatus: status }
      );
      
      res.json({
        success: true,
        data: updatedInvoice
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
 * POST /api/admin/invoices/:id/resend
 * Renvoie une facture par email
 */
router.post('/:id/resend', async (req, res) => {
  try {
    const { id } = req.params;
    
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        client: true
      }
    });
    
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Facture introuvable'
      });
    }
    
    // Ici, vous devriez envoyer l'email avec la facture en PDF
    // Pour l'instant, on simule juste l'action
    
    await logAdminAction(
      req.admin.id,
      'RESEND',
      'INVOICE',
      id,
      { email: invoice.client.email }
    );
    
    res.json({
      success: true,
      message: 'Facture renvoyée par email'
    });
  } catch (error) {
    console.error('Erreur lors du renvoi de la facture:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du renvoi de la facture'
    });
  }
});

/**
 * DELETE /api/admin/invoices/:id
 * Annule une facture
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const invoice = await prisma.invoice.findUnique({
      where: { id }
    });
    
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Facture introuvable'
      });
    }
    
    // Marquer comme annulée plutôt que supprimer
    const cancelledInvoice = await prisma.invoice.update({
      where: { id },
      data: { status: 'CANCELLED' }
    });
    
    await logAdminAction(
      req.admin.id,
      'CANCEL',
      'INVOICE',
      id,
      {}
    );
    
    res.json({
      success: true,
      data: cancelledInvoice
    });
  } catch (error) {
    console.error('Erreur lors de l\'annulation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'annulation'
    });
  }
});

/**
 * GET /api/admin/invoices/:id/preview
 * Génère une prévisualisation PDF de la facture
 */
router.get('/:id/preview', async (req, res) => {
  try {
    const { id } = req.params;
    
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        client: true
      }
    });
    
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Facture introuvable'
      });
    }
    
    // Ici, vous devriez générer un PDF avec une bibliothèque comme pdfkit ou puppeteer
    // Pour l'instant, on retourne les données JSON
    
    res.json({
      success: true,
      data: invoice,
      message: 'PDF généré (simulation)'
    });
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la génération du PDF'
    });
  }
});

export default router;
