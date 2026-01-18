/**
 * CLIENT DASHBOARD ROUTES
 * 
 * Routes for client-facing dashboard features
 * MBK: Client dashboard API endpoints
 */

import express from 'express';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * Middleware to get client from Supabase email
 * In production, this should verify Supabase JWT token
 */
const getClientFromRequest = async (req, res, next) => {
  try {
    // For now, we'll accept email in header or body
    // In production, extract from Supabase JWT token
    const email = req.headers['x-client-email'] || req.body.email;
    
    if (!email) {
      return res.status(401).json({
        success: false,
        message: 'Email client requis'
      });
    }
    
    const client = await prisma.client.findUnique({
      where: { email }
    });
    
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client introuvable'
      });
    }
    
    if (client.status !== 'ACTIVE') {
      return res.status(403).json({
        success: false,
        message: 'Compte non actif'
      });
    }
    
    req.client = client;
    next();
  } catch (error) {
    console.error('Error getting client:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification du client'
    });
  }
};

/**
 * GET /api/client/dashboard/stats
 * Get dashboard statistics for the client
 */
router.get('/stats', getClientFromRequest, async (req, res) => {
  try {
    const client = req.client;
    
    // Get active campaigns count
    const activeCampaigns = await prisma.campaign.count({
      where: {
        clientId: client.id,
        status: 'ACTIVE'
      }
    });
    
    // Get total campaigns
    const totalCampaigns = await prisma.campaign.count({
      where: { clientId: client.id }
    });
    
    // Get credits balance
    const latestTransaction = await prisma.creditTransaction.findFirst({
      where: { clientId: client.id },
      orderBy: { createdAt: 'desc' }
    });
    const credits = latestTransaction?.balance || 0;
    
    // Get meetings count (from performance data in campaigns)
    // This is a placeholder - you'll need to add a meetings table or track in campaign performance
    const meetingsCount = 0; // TODO: Implement meetings tracking
    
    // Get response rate (placeholder)
    const responseRate = 0; // TODO: Calculate from campaign performance
    
    res.json({
      success: true,
      data: {
        activeCampaigns,
        totalCampaigns,
        credits,
        meetingsCount,
        responseRate: `${responseRate}%`
      }
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
});

/**
 * GET /api/client/campaigns
 * Get all campaigns for the client
 */
router.get('/campaigns', getClientFromRequest, async (req, res) => {
  try {
    const client = req.client;
    const { status } = req.query;
    
    const where = { clientId: client.id };
    if (status) {
      where.status = status;
    }
    
    const campaigns = await prisma.campaign.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            // Add relations if you have them
          }
        }
      }
    });
    
    // Format campaigns with performance data
    const formattedCampaigns = campaigns.map(campaign => {
      const performance = campaign.performance || {};
      return {
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
        startDate: campaign.startDate,
        endDate: campaign.endDate,
        createdAt: campaign.createdAt,
        updatedAt: campaign.updatedAt,
        progress: {
          research: performance.researchProgress || 0,
          outreach: performance.outreachProgress || 0,
          followup: performance.followupProgress || 0
        },
        stats: {
          sent: performance.emailsSent || 0,
          opens: performance.emailsOpened || 0,
          replies: performance.replies || 0,
          meetings: performance.meetings || 0
        },
        sdr: performance.sdrName || 'N/A'
      };
    });
    
    res.json({
      success: true,
      data: formattedCampaigns
    });
  } catch (error) {
    console.error('Error getting campaigns:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des campagnes'
    });
  }
});

/**
 * POST /api/client/campaigns
 * Create a new campaign
 */
router.post('/campaigns',
  [
    body('name').notEmpty().withMessage('Le nom est requis'),
    body('status').optional().isIn(['DRAFT', 'ACTIVE', 'PAUSED'])
  ],
  getClientFromRequest,
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
      
      const client = req.client;
      const { name, status = 'DRAFT', startDate, endDate, goal, targetIndustry } = req.body;
      
      const campaign = await prisma.campaign.create({
        data: {
          clientId: client.id,
          name,
          status,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null,
          performance: {
            goal,
            targetIndustry,
            researchProgress: 0,
            outreachProgress: 0,
            followupProgress: 0,
            emailsSent: 0,
            emailsOpened: 0,
            replies: 0,
            meetings: 0
          }
        }
      });
      
      res.status(201).json({
        success: true,
        data: campaign
      });
    } catch (error) {
      console.error('Error creating campaign:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création de la campagne'
      });
    }
  }
);

/**
 * GET /api/client/campaigns/:id
 * Get a specific campaign
 */
router.get('/campaigns/:id', getClientFromRequest, async (req, res) => {
  try {
    const { id } = req.params;
    const client = req.client;
    
    const campaign = await prisma.campaign.findFirst({
      where: {
        id,
        clientId: client.id
      }
    });
    
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campagne introuvable'
      });
    }
    
    res.json({
      success: true,
      data: campaign
    });
  } catch (error) {
    console.error('Error getting campaign:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la campagne'
    });
  }
});

/**
 * PATCH /api/client/campaigns/:id
 * Update a campaign
 */
router.patch('/campaigns/:id',
  [
    body('status').optional().isIn(['DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED'])
  ],
  getClientFromRequest,
  async (req, res) => {
    try {
      const { id } = req.params;
      const client = req.client;
      const updateData = req.body;
      
      // Verify campaign belongs to client
      const existing = await prisma.campaign.findFirst({
        where: {
          id,
          clientId: client.id
        }
      });
      
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Campagne introuvable'
        });
      }
      
      const campaign = await prisma.campaign.update({
        where: { id },
        data: updateData
      });
      
      res.json({
        success: true,
        data: campaign
      });
    } catch (error) {
      console.error('Error updating campaign:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour de la campagne'
      });
    }
  }
);

/**
 * GET /api/client/prospects
 * Get prospects (placeholder - you'll need to add a prospects table)
 */
router.get('/prospects', getClientFromRequest, async (req, res) => {
  try {
    // TODO: Implement prospects table and logic
    res.json({
      success: true,
      data: []
    });
  } catch (error) {
    console.error('Error getting prospects:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des prospects'
    });
  }
});

/**
 * GET /api/client/meetings
 * Get meetings (placeholder - you'll need to add a meetings table)
 */
router.get('/meetings', getClientFromRequest, async (req, res) => {
  try {
    // TODO: Implement meetings table and logic
    // For now, extract from campaign performance data
    const client = req.client;
    const campaigns = await prisma.campaign.findMany({
      where: { clientId: client.id },
      select: { performance: true }
    });
    
    const meetings = [];
    // Extract meetings from campaign performance
    // This is a placeholder - implement proper meetings tracking
    
    res.json({
      success: true,
      data: meetings
    });
  } catch (error) {
    console.error('Error getting meetings:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des rendez-vous'
    });
  }
});

/**
 * GET /api/client/activities
 * Get recent activities
 */
router.get('/activities', getClientFromRequest, async (req, res) => {
  try {
    const client = req.client;
    
    // Get recent campaigns
    const recentCampaigns = await prisma.campaign.findMany({
      where: { clientId: client.id },
      orderBy: { updatedAt: 'desc' },
      take: 10
    });
    
    // Format as activities
    const activities = recentCampaigns.map(campaign => {
      const performance = campaign.performance || {};
      return {
        time: campaign.updatedAt,
        action: `Campagne "${campaign.name}" ${campaign.status === 'ACTIVE' ? 'active' : 'mise à jour'}`,
        type: campaign.status === 'ACTIVE' ? 'success' : 'info'
      };
    });
    
    res.json({
      success: true,
      data: activities
    });
  } catch (error) {
    console.error('Error getting activities:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des activités'
    });
  }
});

export default router;
