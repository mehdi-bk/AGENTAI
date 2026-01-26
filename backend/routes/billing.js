import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-10-28.acacia',
});

const priceMap = {
  discovery: process.env.STRIPE_PRICE_DISCOVERY,
  business: process.env.STRIPE_PRICE_BUSINESS,
  scale: process.env.STRIPE_PRICE_SCALE,
};

// Simple guard to ensure we have an email header (client dashboard auth)
const requireClientEmail = (req, res, next) => {
  const email = req.headers['x-client-email'];
  if (!email) {
    return res.status(401).json({ success: false, message: 'Client email required' });
  }
  req.clientEmail = email;
  next();
};

const getOrCreateCustomer = async (email) => {
  const existing = await stripe.customers.list({ email, limit: 1 });
  if (existing.data.length > 0) return existing.data[0];
  return stripe.customers.create({ email });
};

// Create a checkout session for a subscription
router.post('/checkout', requireClientEmail, async (req, res) => {
  try {
    const { planId, successUrl, cancelUrl } = req.body || {};
    const priceId = priceMap[planId];

    if (!priceId) {
      return res.status(400).json({ success: false, message: 'Invalid planId' });
    }

    const customer = await getOrCreateCustomer(req.clientEmail);

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer: customer.id,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      subscription_data: {
        metadata: {
          planId,
          email: req.clientEmail,
          source: 'agentai-platform',
        },
      },
    });

    return res.json({ success: true, url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Stripe error' });
  }
});

// Create a billing portal session
router.post('/portal', requireClientEmail, async (req, res) => {
  try {
    const { returnUrl } = req.body || {};
    if (!returnUrl) {
      return res.status(400).json({ success: false, message: 'returnUrl is required' });
    }

    const customer = await getOrCreateCustomer(req.clientEmail);

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: returnUrl,
    });

    return res.json({ success: true, url: portalSession.url });
  } catch (error) {
    console.error('Stripe portal error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Stripe error' });
  }
});

export default router;