/**
 * STRIPE WEBHOOK HANDLER (PROXY API VERSION)
 * 
 * Gère les événements Stripe (checkout.session.completed, etc.)
 * Génère une clé API proxy unique pour le client
 * Assigne des quotas selon le plan souscrit
 * 
 * MBK: Stripe webhook integration with proxy API system
 */

import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { randomBytes } from 'crypto';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-10-28.acacia',
});

const prisma = new PrismaClient();

// Configuration des quotas par plan
const PLAN_QUOTAS = {
  discovery: {
    deepseekTokens: 1000000,      // 1M tokens/mois
    instantlyEmails: 1000,         // 1000 emails/mois
  },
  business: {
    deepseekTokens: 10000000,     // 10M tokens/mois
    instantlyEmails: 10000,        // 10k emails/mois
  },
  scale: {
    deepseekTokens: 100000000,    // 100M tokens/mois
    instantlyEmails: 100000,       // 100k emails/mois
  },
};

/**
 * Génère une clé API proxy sécurisée
 */
const generateApiKey = () => {
  const prefix = 'sk_agentai';
  const random = randomBytes(32).toString('hex');
  return `${prefix}_${random}`;
};

/**
 * Calcule la date du prochain reset de quota (1er du mois prochain)
 */
const getNextQuotaResetDate = () => {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return nextMonth;
};

/**
 * Gère l'événement checkout.session.completed
 */
const handleCheckoutSessionCompleted = async (session) => {
  try {
    const email = session.customer_email;
    const customerId = session.customer;
    const planId = session.metadata?.planId || 'business';

    console.log(`\n🎉 Checkout session completed for ${email}`);

    // Vérifier que le client existe
    const client = await prisma.client.findUnique({ where: { email } });
    if (!client) {
      console.error(`❌ Client not found: ${email}`);
      return;
    }

    // Récupérer la subscription Stripe complète
    let stripeSubscription = null;
    try {
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        limit: 1,
      });
      stripeSubscription = subscriptions.data[0];
    } catch (error) {
      console.warn('⚠️ Could not fetch Stripe subscription:', error.message);
    }

    // Générer une clé API proxy unique
    const apiKey = generateApiKey();
    console.log(`🔑 Generated API key for ${email}: ${apiKey.substring(0, 20)}...`);

    // Récupérer les quotas du plan
    const quotas = PLAN_QUOTAS[planId] || PLAN_QUOTAS.business;
    const quotaResetDate = getNextQuotaResetDate();

    // Mettre à jour le client en base
    const updateData = {
      stripeCustomerId: customerId,
      currentPlan: planId,
      subscriptionStartDate: new Date(),
      apiKey,
      apiKeyCreatedAt: new Date(),
      deepseekTokensQuota: quotas.deepseekTokens,
      deepseekTokensUsed: 0,
      instantlyEmailsQuota: quotas.instantlyEmails,
      instantlyEmailsUsed: 0,
      quotaResetDate,
    };

    if (stripeSubscription) {
      updateData.stripeSubscriptionId = stripeSubscription.id;
      updateData.subscriptionEndDate = new Date(stripeSubscription.current_period_end * 1000);
    }

    const updatedClient = await prisma.client.update({
      where: { email },
      data: updateData,
    });

    console.log('✅ Client updated with API key and quotas:');
    console.log(`   - Plan: ${planId}`);
    console.log(`   - DeepSeek Tokens: ${quotas.deepseekTokens.toLocaleString()}/month`);
    console.log(`   - Instantly Emails: ${quotas.instantlyEmails.toLocaleString()}/month`);
    console.log(`   - Quota Reset: ${quotaResetDate.toLocaleDateString()}`);

    // Sauvegarder l'événement en DB pour trace
    await prisma.stripeEvent.create({
      data: {
        clientId: client.id,
        eventType: 'checkout.session.completed',
        stripeEventId: session.id,
        stripeData: session,
        processed: true,
      },
    });

    return { success: true, updatedClient };
  } catch (error) {
    console.error('❌ Error handling checkout.session.completed:', error);
    throw error;
  }
};

/**
 * Gère l'événement customer.subscription.updated ou customer.subscription.deleted
 */
const handleSubscriptionChanged = async (subscription, eventType) => {
  try {
    const customerId = subscription.customer;
    const subscriptionId = subscription.id;

    console.log(`\n📢 Subscription ${eventType}: ${subscriptionId}`);

    // Récupérer le client par stripeCustomerId
    const client = await prisma.client.findFirst({
      where: { stripeCustomerId: customerId },
    });

    if (!client) {
      console.error(`❌ Client not found for Stripe customer: ${customerId}`);
      return;
    }

    // Si l'abonnement est annulé/supprimé
    if (eventType === 'customer.subscription.deleted' || subscription.status === 'canceled') {
      console.log(`🛑 Subscription cancelled for ${client.email}`);

      await prisma.client.update({
        where: { id: client.id },
        data: {
          subscriptionType: 'STARTER', // Redescendre au plan de base
          deepseekTokensQuota: 0,
          instantlyEmailsQuota: 0,
          subscriptionEndDate: new Date(),
        },
      });
    } else if (subscription.status === 'active') {
      // Mettre à jour la date d'expiration
      await prisma.client.update({
        where: { id: client.id },
        data: {
          subscriptionEndDate: new Date(subscription.current_period_end * 1000),
        },
      });
    }

    // Sauvegarder l'événement
    await prisma.stripeEvent.create({
      data: {
        clientId: client.id,
        eventType,
        stripeEventId: subscription.id,
        stripeData: subscription,
        processed: true,
      },
    });

    return { success: true, client };
  } catch (error) {
    console.error(`❌ Error handling ${eventType}:`, error);
    throw error;
  }
};

/**
 * Webhook handler principal
 * À appeler depuis server.js avec le body raw
 */
export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (error) {
    console.error('❌ Webhook signature verification failed:', error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  console.log(`\n📩 Stripe webhook received: ${event.type}`);

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionChanged(event.data.object, 'customer.subscription.updated');
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionChanged(event.data.object, 'customer.subscription.deleted');
        break;

      default:
        console.log(`⏭️ Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    // Retourner 200 quand même à Stripe (pour ne pas déclencher de retry)
    // mais logger l'erreur pour investigation manuelle
    res.json({ received: true, error: error.message });
  }
};

export default handleStripeWebhook;
