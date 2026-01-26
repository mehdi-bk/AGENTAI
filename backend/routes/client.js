/**
 * ROUTES CLIENT - Dashboard stats et données client
 */
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/client/dashboard/stats
 * Récupérer les statistiques du dashboard client
 */
router.get('/dashboard/stats', async (req, res) => {
  try {
    // L'email peut venir soit du query string soit du header X-Client-Email
    const email = req.query.email || req.headers['x-client-email'];

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email requis'
      });
    }

    // Récupérer le client
    const client = await prisma.client.findUnique({
      where: { email: String(email) },
      select: {
        id: true,
        email: true,
        subscriptionType: true,
        status: true,
        deepseekMonthlyQuota: true,
        deepseekUsedQuota: true,
        deepseekResetDate: true,
        instantlyAccountId: true,
        instantlyPlan: true
      }
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client non trouvé'
      });
    }

    // Calculer les stats
    const quotaUsed = client.deepseekUsedQuota || 0;
    const quotaTotal = client.deepseekMonthlyQuota || 0;
    const quotaRemaining = Math.max(0, quotaTotal - quotaUsed);
    const quotaPercentage = quotaTotal > 0 ? (quotaUsed / quotaTotal) * 100 : 0;

    res.json({
      success: true,
      stats: {
        subscription: {
          type: client.subscriptionType || 'FREE',
          status: client.status || 'ACTIVE'
        },
        deepseek: {
          quotaUsed,
          quotaTotal,
          quotaRemaining,
          quotaPercentage: Math.round(quotaPercentage),
          resetDate: client.deepseekResetDate
        },
        instantly: {
          accountId: client.instantlyAccountId,
          plan: client.instantlyPlan,
          connected: !!client.instantlyAccountId
        },
        campaigns: {
          total: 0,
          active: 0,
          paused: 0
        },
        emails: {
          sent: 0,
          delivered: 0,
          opened: 0,
          clicked: 0
        }
      }
    });

  } catch (error) {
    console.error('Erreur récupération stats:', error);
    
    // Si erreur de base de données, retourner des stats par défaut
    if (error.code === 'P1001' || error.message?.includes('database')) {
      return res.json({
        success: true,
        stats: {
          subscription: { type: 'FREE', status: 'ACTIVE' },
          deepseek: { quotaUsed: 0, quotaTotal: 5000, quotaRemaining: 5000, quotaPercentage: 0 },
          instantly: { connected: false },
          campaigns: { total: 0, active: 0, paused: 0 },
          emails: { sent: 0, delivered: 0, opened: 0, clicked: 0 }
        },
        warning: 'Base de données temporairement indisponible - Données par défaut'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

/**
 * POST /api/clients/sync
 * Synchroniser les données client
 */
router.post('/sync', async (req, res) => {
  try {
    const { email, userData } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email requis'
      });
    }

    // Essayer de synchroniser, mais ne pas échouer si BDD indisponible
    try {
      const client = await prisma.client.findUnique({
        where: { email }
      });

      if (!client) {
        // Créer le client si nécessaire
        const newClient = await prisma.client.create({
          data: {
            email,
            fullName: userData?.fullName || email.split('@')[0],
            status: 'ACTIVE',
            subscriptionType: 'FREE'
          }
        });

        return res.json({
          success: true,
          client: newClient
        });
      }

      res.json({
        success: true,
        client
      });

    } catch (dbError) {
      // Si BDD indisponible, retourner succès quand même
      console.warn('BDD indisponible, mode dégradé activé');
      res.json({
        success: true,
        client: {
          email,
          status: 'ACTIVE',
          subscriptionType: 'FREE'
        },
        warning: 'Mode dégradé - BDD indisponible'
      });
    }

  } catch (error) {
    console.error('Erreur sync client:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

export default router;
