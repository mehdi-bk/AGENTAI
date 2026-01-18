/**
 * ROUTES DE GESTION DES CLIENTS
 * 
 * Gère toutes les opérations CRUD sur les clients
 */

import express from 'express';
import { PrismaClient } from '@prisma/client';
import { body, query, validationResult } from 'express-validator';
import { requireRole } from '../middleware/authMiddleware.js';
import { logAdminAction } from '../middleware/auditLog.js';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/admin/clients
 * Liste tous les clients avec filtres et pagination
 */
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      subscriptionType,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Construire les filtres
    const where = {};
    
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { fullName: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (status) {
      where.status = status;
    }
    
    if (subscriptionType) {
      where.subscriptionType = subscriptionType;
    }
    
    // Récupérer les clients
    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: {
          [sortBy]: sortOrder
        },
        include: {
          _count: {
            select: {
              campaigns: true,
              invoices: true
            }
          }
        }
      }),
      prisma.client.count({ where })
    ]);
    
    // Enrichir avec les données supplémentaires
    const enrichedClients = await Promise.all(
      clients.map(async (client) => {
        // Récupérer le solde de crédits actuel
        const latestTransaction = await prisma.creditTransaction.findFirst({
          where: { clientId: client.id },
          orderBy: { createdAt: 'desc' }
        });
        
        return {
          ...client,
          currentCredits: latestTransaction?.balance || 0
        };
      })
    );
    
    res.json({
      success: true,
      data: enrichedClients,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des clients:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des clients'
    });
  }
});

/**
 * GET /api/admin/clients/:id
 * Récupère les détails d'un client
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        campaigns: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        creditTransactions: {
          orderBy: { createdAt: 'desc' },
          take: 20
        },
        invoices: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        loginHistory: {
          orderBy: { createdAt: 'desc' },
          take: 20
        }
      }
    });
    
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client introuvable'
      });
    }
    
    res.json({
      success: true,
      data: client
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du client:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du client'
    });
  }
});

/**
 * POST /api/admin/clients/:id/credits
 * Ajoute ou retire des crédits à un client
 */
router.post('/:id/credits',
  [
    body('amount').isInt().notEmpty(),
    body('description').optional().isString()
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
      
      const { id } = req.params;
      const { amount, description } = req.body;
      
      // Vérifier que le client existe
      const client = await prisma.client.findUnique({
        where: { id }
      });
      
      if (!client) {
        return res.status(404).json({
          success: false,
          message: 'Client introuvable'
        });
      }
      
      // Récupérer le solde actuel
      const latestTransaction = await prisma.creditTransaction.findFirst({
        where: { clientId: id },
        orderBy: { createdAt: 'desc' }
      });
      
      const currentBalance = latestTransaction?.balance || 0;
      const newBalance = currentBalance + parseInt(amount);
      
      if (newBalance < 0) {
        return res.status(400).json({
          success: false,
          message: 'Solde insuffisant'
        });
      }
      
      // Créer la transaction
      const transaction = await prisma.creditTransaction.create({
        data: {
          clientId: id,
          type: parseInt(amount) > 0 ? 'ADMIN_ADD' : 'ADMIN_REMOVE',
          amount: parseInt(amount),
          balance: newBalance,
          description: description || `Ajustement manuel par admin`,
          adminId: req.admin.id
        }
      });
      
      // Mettre à jour le solde du client (si stocké directement)
      // Note: Dans ce schéma, le solde est calculé depuis les transactions
      
      // Logger l'action
      await logAdminAction(
        req.admin.id,
        'CREDIT_ADJUSTMENT',
        'CLIENT',
        id,
        { amount, newBalance }
      );
      
      res.json({
        success: true,
        data: transaction,
        newBalance
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajustement des crédits:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'ajustement des crédits'
      });
    }
  }
);

/**
 * PATCH /api/admin/clients/:id/status
 * Change le statut d'un client (suspendre/réactiver)
 */
router.patch('/:id/status',
  [body('status').isIn(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'CANCELLED'])],
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
      
      const client = await prisma.client.findUnique({
        where: { id }
      });
      
      if (!client) {
        return res.status(404).json({
          success: false,
          message: 'Client introuvable'
        });
      }
      
      const updateData = {
        status,
        ...(status === 'SUSPENDED' && { suspendedAt: new Date() }),
        ...(status === 'ACTIVE' && { suspendedAt: null })
      };
      
      const updatedClient = await prisma.client.update({
        where: { id },
        data: updateData
      });
      
      await logAdminAction(
        req.admin.id,
        'STATUS_CHANGE',
        'CLIENT',
        id,
        { oldStatus: client.status, newStatus: status }
      );
      
      res.json({
        success: true,
        data: updatedClient
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
 * PATCH /api/admin/clients/:id/subscription
 * Change le type d'abonnement d'un client
 */
router.patch('/:id/subscription',
  [body('subscriptionType').isIn(['STARTER', 'PROFESSIONAL', 'ENTERPRISE'])],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Type d\'abonnement invalide'
        });
      }
      
      const { id } = req.params;
      const { subscriptionType } = req.body;
      
      const client = await prisma.client.update({
        where: { id },
        data: { subscriptionType }
      });
      
      await logAdminAction(
        req.admin.id,
        'SUBSCRIPTION_CHANGE',
        'CLIENT',
        id,
        { subscriptionType }
      );
      
      res.json({
        success: true,
        data: client
      });
    } catch (error) {
      console.error('Erreur lors du changement d\'abonnement:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors du changement d\'abonnement'
      });
    }
  }
);

/**
 * POST /api/admin/clients/:id/reset-password
 * Réinitialise le mot de passe d'un client
 */
router.post('/:id/reset-password',
  requireRole('SUPER_ADMIN', 'ADMIN'),
  async (req, res) => {
    try {
      const { id } = req.params;
      
      // Générer un nouveau mot de passe temporaire
      const tempPassword = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12);
      
      // Ici, vous devriez envoyer un email avec le nouveau mot de passe
      // et hasher le mot de passe avant de le stocker
      
      await logAdminAction(
        req.admin.id,
        'PASSWORD_RESET',
        'CLIENT',
        id,
        {}
      );
      
      res.json({
        success: true,
        message: 'Mot de passe réinitialisé',
        tempPassword // En production, ne pas retourner le mot de passe
      });
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la réinitialisation'
      });
    }
  }
);

/**
 * GET /api/admin/clients/:id/campaigns
 * Récupère toutes les campagnes d'un client
 */
router.get('/:id/campaigns', async (req, res) => {
  try {
    const { id } = req.params;
    
    const campaigns = await prisma.campaign.findMany({
      where: { clientId: id },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({
      success: true,
      data: campaigns
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des campagnes:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des campagnes'
    });
  }
});

/**
 * POST /api/clients/sync
 * Crée ou met à jour un Client record depuis Supabase auth
 * MBK: Client sync endpoint - called when user completes onboarding
 */
router.post('/sync', async (req, res) => {
  try {
    const { supabaseUserId, email, fullName, company, metadata } = req.body;
    
    if (!supabaseUserId || !email) {
      return res.status(400).json({
        success: false,
        message: 'supabaseUserId et email sont requis'
      });
    }
    
    // Vérifier si le client existe déjà
    const existingClient = await prisma.client.findUnique({
      where: { email }
    });
    
    if (existingClient) {
      // Mettre à jour les informations
      const updated = await prisma.client.update({
        where: { email },
        data: {
          fullName: fullName || existingClient.fullName,
          company: company || existingClient.company,
          lastLogin: new Date()
        }
      });
      
      return res.json({
        success: true,
        data: updated,
        created: false
      });
    }
    
    // Créer un nouveau client
    const newClient = await prisma.client.create({
      data: {
        email,
        fullName: fullName || email.split('@')[0],
        company: company || null,
        subscriptionType: 'STARTER',
        status: 'ACTIVE',
        credits: 0
      }
    });
    
    res.status(201).json({
      success: true,
      data: newClient,
      created: true
    });
  } catch (error) {
    console.error('Erreur lors de la synchronisation du client:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la synchronisation du client'
    });
  }
});

/**
 * GET /api/admin/clients/export
 * Exporte les données clients en CSV
 */
router.get('/export', async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      include: {
        _count: {
          select: {
            campaigns: true,
            invoices: true
          }
        }
      }
    });
    
    // Convertir en CSV
    const headers = ['ID', 'Email', 'Nom', 'Entreprise', 'Statut', 'Abonnement', 'Campagnes', 'Factures', 'Date de création'];
    const rows = clients.map(client => [
      client.id,
      client.email,
      client.fullName,
      client.company || '',
      client.status,
      client.subscriptionType,
      client._count.campaigns,
      client._count.invoices,
      client.createdAt.toISOString()
    ]);
    
    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=clients.csv');
    res.send(csv);
  } catch (error) {
    console.error('Erreur lors de l\'export:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'export'
    });
  }
});

export default router;
