/**
 * PROXY API ROUTES
 * 
 * Routes proxy pour DeepSeek et Instantly
 * Valide la clé API client, vérifie les quotas, track l'usage
 * 
 * MBK: Proxy API system for controlled access to third-party services
 */

import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const prisma = new PrismaClient();

/**
 * Middleware: Valide la clé API du client et vérifie les quotas
 */
const validateApiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers['authorization']?.replace('Bearer ', '');
    
    if (!apiKey) {
      return res.status(401).json({
        success: false,
        error: 'API key missing. Include "Authorization: Bearer YOUR_API_KEY" header',
      });
    }

    // Récupérer le client par sa clé API
    const client = await prisma.client.findUnique({
      where: { apiKey },
    });

    if (!client) {
      return res.status(401).json({
        success: false,
        error: 'Invalid API key',
      });
    }

    // Vérifier si le client est actif
    if (client.status !== 'ACTIVE') {
      return res.status(403).json({
        success: false,
        error: `Account ${client.status.toLowerCase()}. Contact support.`,
      });
    }

    // Vérifier si l'abonnement est expiré
    if (client.subscriptionEndDate && new Date() > client.subscriptionEndDate) {
      return res.status(403).json({
        success: false,
        error: 'Subscription expired. Please renew your plan.',
      });
    }

    // Reset quota si nécessaire
    if (client.quotaResetDate && new Date() > client.quotaResetDate) {
      const nextReset = new Date(client.quotaResetDate);
      nextReset.setMonth(nextReset.getMonth() + 1);
      
      await prisma.client.update({
        where: { id: client.id },
        data: {
          deepseekTokensUsed: 0,
          instantlyEmailsUsed: 0,
          quotaResetDate: nextReset,
        },
      });

      client.deepseekTokensUsed = 0;
      client.instantlyEmailsUsed = 0;
      client.quotaResetDate = nextReset;

      console.log(`♻️ Quota reset for ${client.email}`);
    }

    // Attacher le client à la requête
    req.client = client;
    next();
  } catch (error) {
    console.error('Error validating API key:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

/**
 * POST /api/proxy/deepseek/chat
 * Proxy pour DeepSeek Chat Completions
 */
router.post('/deepseek/chat', validateApiKey, async (req, res) => {
  const startTime = Date.now();
  const client = req.client;

  try {
    const { model, messages, temperature, max_tokens, stream } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request: "messages" array required',
      });
    }

    // Vérifier le quota
    if (client.deepseekTokensUsed >= client.deepseekTokensQuota) {
      return res.status(429).json({
        success: false,
        error: 'DeepSeek quota exceeded. Upgrade your plan or wait for next reset.',
        quota: {
          used: client.deepseekTokensUsed,
          limit: client.deepseekTokensQuota,
          resetDate: client.quotaResetDate,
        },
      });
    }

    // Appeler DeepSeek avec notre clé API
    const deepseekApiKey = process.env.DEEPSEEK_API_KEY;
    if (!deepseekApiKey) {
      throw new Error('DEEPSEEK_API_KEY not configured');
    }

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${deepseekApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'deepseek-chat',
        messages,
        temperature: temperature || 1.0,
        max_tokens: max_tokens || 4096,
        stream: stream || false,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`DeepSeek API error: ${response.status} - ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    const tokensUsed = data.usage?.total_tokens || 0;

    // Mettre à jour la consommation
    await prisma.client.update({
      where: { id: client.id },
      data: {
        deepseekTokensUsed: client.deepseekTokensUsed + tokensUsed,
      },
    });

    // Logger l'usage
    await prisma.apiUsage.create({
      data: {
        clientId: client.id,
        service: 'deepseek',
        endpoint: '/chat/completions',
        tokensUsed,
        requestBody: { model, messageCount: messages.length },
        responseTime: Date.now() - startTime,
        statusCode: 200,
      },
    });

    console.log(`✅ DeepSeek request for ${client.email}: ${tokensUsed} tokens`);

    // Retourner la réponse DeepSeek + infos quota
    res.json({
      ...data,
      quota: {
        used: client.deepseekTokensUsed + tokensUsed,
        limit: client.deepseekTokensQuota,
        remaining: client.deepseekTokensQuota - (client.deepseekTokensUsed + tokensUsed),
        resetDate: client.quotaResetDate,
      },
    });
  } catch (error) {
    console.error('DeepSeek proxy error:', error);

    // Logger l'erreur
    await prisma.apiUsage.create({
      data: {
        clientId: client.id,
        service: 'deepseek',
        endpoint: '/chat/completions',
        tokensUsed: 0,
        responseTime: Date.now() - startTime,
        statusCode: 500,
        error: error.message,
      },
    });

    res.status(500).json({
      success: false,
      error: error.message || 'DeepSeek request failed',
    });
  }
});

/**
 * POST /api/proxy/instantly/send
 * Proxy pour Instantly Email Sending (OPTIONNEL - nécessite INSTANTLY_API_KEY)
 */
router.post('/instantly/send', validateApiKey, async (req, res) => {
  const startTime = Date.now();
  const client = req.client;

  try {
    // Vérifier si Instantly est configuré
    const instantlyApiKey = process.env.INSTANTLY_API_KEY;
    
    if (!instantlyApiKey) {
      return res.status(503).json({
        success: false,
        error: 'Instantly service not yet configured. Contact support to enable email campaigns.',
      });
    }

    const { to, subject, body, from } = req.body;

    if (!to || !subject || !body) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request: "to", "subject", "body" required',
      });
    }

    // Vérifier le quota
    if (client.instantlyEmailsUsed >= client.instantlyEmailsQuota) {
      return res.status(429).json({
        success: false,
        error: 'Instantly quota exceeded. Upgrade your plan or wait for next reset.',
        quota: {
          used: client.instantlyEmailsUsed,
          limit: client.instantlyEmailsQuota,
          resetDate: client.quotaResetDate,
        },
      });
    }

    // Appeler Instantly avec notre clé API
    const instantlyApiUrl = process.env.INSTANTLY_API_URL || 'https://api.instantly.ai/v1';

    const response = await fetch(`${instantlyApiUrl}/send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${instantlyApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        subject,
        body,
        from: from || 'noreply@agentai.com',
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`Instantly API error: ${response.status} - ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    const emailsSent = 1; // Une requête = 1 email

    // Mettre à jour la consommation
    await prisma.client.update({
      where: { id: client.id },
      data: {
        instantlyEmailsUsed: client.instantlyEmailsUsed + emailsSent,
      },
    });

    // Logger l'usage
    await prisma.apiUsage.create({
      data: {
        clientId: client.id,
        service: 'instantly',
        endpoint: '/send',
        emailsSent,
        requestBody: { to, subject },
        responseTime: Date.now() - startTime,
        statusCode: 200,
      },
    });

    console.log(`✅ Instantly email sent for ${client.email}`);

    // Retourner la réponse Instantly + infos quota
    res.json({
      ...data,
      quota: {
        used: client.instantlyEmailsUsed + emailsSent,
        limit: client.instantlyEmailsQuota,
        remaining: client.instantlyEmailsQuota - (client.instantlyEmailsUsed + emailsSent),
        resetDate: client.quotaResetDate,
      },
    });
  } catch (error) {
    console.error('Instantly proxy error:', error);

    // Logger l'erreur
    await prisma.apiUsage.create({
      data: {
        clientId: client.id,
        service: 'instantly',
        endpoint: '/send',
        emailsSent: 0,
        responseTime: Date.now() - startTime,
        statusCode: 500,
        error: error.message,
      },
    });

    res.status(500).json({
      success: false,
      error: error.message || 'Instantly request failed',
    });
  }
});

/**
 * GET /api/proxy/usage
 * Récupérer les stats d'usage du client
 */
router.get('/usage', validateApiKey, async (req, res) => {
  try {
    const client = req.client;

    const usage = await prisma.apiUsage.findMany({
      where: { clientId: client.id },
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        service: true,
        endpoint: true,
        tokensUsed: true,
        emailsSent: true,
        statusCode: true,
        error: true,
        createdAt: true,
      },
    });

    res.json({
      success: true,
      quota: {
        deepseek: {
          used: client.deepseekTokensUsed,
          limit: client.deepseekTokensQuota,
          remaining: client.deepseekTokensQuota - client.deepseekTokensUsed,
        },
        instantly: {
          used: client.instantlyEmailsUsed,
          limit: client.instantlyEmailsQuota,
          remaining: client.instantlyEmailsQuota - client.instantlyEmailsUsed,
        },
        resetDate: client.quotaResetDate,
      },
      recentUsage: usage,
    });
  } catch (error) {
    console.error('Usage fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch usage data',
    });
  }
});

export default router;
