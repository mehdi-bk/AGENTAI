/**
 * ROUTES DU TABLEAU DE BORD ADMIN
 * 
 * Fournit les statistiques et données pour le dashboard principal
 */

import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/admin/dashboard/stats
 * Récupère les statistiques globales
 */
router.get('/stats', async (req, res) => {
  try {
    // Statistiques clients
    const totalClients = await prisma.client.count();
    const activeClients = await prisma.client.count({
      where: { status: 'ACTIVE' }
    });
    const inactiveClients = await prisma.client.count({
      where: { status: 'INACTIVE' }
    });
    const suspendedClients = await prisma.client.count({
      where: { status: 'SUSPENDED' }
    });
    
    // Revenus mensuels et annuels
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    
    const monthlyRevenue = await prisma.invoice.aggregate({
      where: {
        status: 'PAID',
        paidAt: {
          gte: startOfMonth
        }
      },
      _sum: {
        amount: true
      }
    });
    
    const yearlyRevenue = await prisma.invoice.aggregate({
      where: {
        status: 'PAID',
        paidAt: {
          gte: startOfYear
        }
      },
      _sum: {
        amount: true
      }
    });
    
    // Campagnes
    const totalCampaigns = await prisma.campaign.count();
    const activeCampaigns = await prisma.campaign.count({
      where: { status: 'ACTIVE' }
    });
    
    // Nouveaux utilisateurs (30 derniers jours)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const newUsers30Days = await prisma.client.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    });
    
    // Nouveaux utilisateurs (7 derniers jours)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const newUsers7Days = await prisma.client.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      }
    });
    
    // Taux de conversion (calcul simplifié)
    const totalCredits = await prisma.creditTransaction.aggregate({
      where: {
        type: 'PURCHASE'
      },
      _sum: {
        amount: true
      }
    });
    
    const usedCredits = await prisma.creditTransaction.aggregate({
      where: {
        type: 'USAGE'
      },
      _sum: {
        amount: true
      }
    });
    
    const conversionRate = totalCredits._sum.amount && usedCredits._sum.amount
      ? ((Math.abs(usedCredits._sum.amount) / totalCredits._sum.amount) * 100).toFixed(2)
      : 0;
    
    res.json({
      success: true,
      data: {
        clients: {
          total: totalClients,
          active: activeClients,
          inactive: inactiveClients,
          suspended: suspendedClients
        },
        revenue: {
          monthly: monthlyRevenue._sum.amount || 0,
          yearly: yearlyRevenue._sum.amount || 0
        },
        campaigns: {
          total: totalCampaigns,
          active: activeCampaigns
        },
        users: {
          newLast30Days: newUsers30Days,
          newLast7Days: newUsers7Days
        },
        credits: {
          total: totalCredits._sum.amount || 0,
          used: Math.abs(usedCredits._sum.amount || 0),
          conversionRate: parseFloat(conversionRate)
        }
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

/**
 * GET /api/admin/dashboard/charts
 * Récupère les données pour les graphiques
 */
router.get('/charts', async (req, res) => {
  try {
    const { period = '30' } = req.query; // 7, 30, 90, 365 jours
    const days = parseInt(period);
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    // Revenus par jour
    const revenueByDay = await prisma.invoice.groupBy({
      by: ['createdAt'],
      where: {
        status: 'PAID',
        paidAt: {
          gte: startDate
        }
      },
      _sum: {
        amount: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
    
    // Nouveaux utilisateurs par jour
    const usersByDay = await prisma.client.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: startDate
        }
      },
      _count: {
        id: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
    
    // Campagnes par jour
    const campaignsByDay = await prisma.campaign.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: startDate
        }
      },
      _count: {
        id: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
    
    res.json({
      success: true,
      data: {
        revenue: revenueByDay.map(item => ({
          date: item.createdAt,
          amount: item._sum.amount || 0
        })),
        users: usersByDay.map(item => ({
          date: item.createdAt,
          count: item._count.id
        })),
        campaigns: campaignsByDay.map(item => ({
          date: item.createdAt,
          count: item._count.id
        }))
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des graphiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des données'
    });
  }
});

export default router;
