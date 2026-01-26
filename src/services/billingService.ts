/**
 * Billing Service
 * Crée les sessions Stripe (checkout et portail) côté client dashboard.
 */
import { supabase } from '@/lib/supabase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const getClientEmail = async (): Promise<string | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.email || null;
  } catch (error) {
    console.error('Error getting client email:', error);
    return null;
  }
};

// CSRF tokens are single-use; fetch a fresh one before any state-changing call
const fetchCSRFToken = async (): Promise<string> => {
  const res = await fetch(`${API_BASE_URL}/csrf-token`);

  if (!res.ok) {
    throw new Error('Impossible de récupérer le token CSRF');
  }

  const data = await res.json();
  if (!data?.csrfToken) {
    throw new Error('Token CSRF manquant dans la réponse');
  }

  return data.csrfToken as string;
};

const post = async (endpoint: string, body: any) => {
  const email = await getClientEmail();
  if (!email) throw new Error('Non authentifié');

  const csrfToken = await fetchCSRFToken();

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Client-Email': email,
      'X-CSRF-Token': csrfToken,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Erreur inconnue' }));
    throw new Error(err.message || 'Erreur Stripe');
  }

  return res.json();
};

export const billingService = {
  startCheckout: async (planId: string, successUrl: string, cancelUrl: string) => {
    const data = await post('/billing/checkout', { planId, successUrl, cancelUrl });
    return data.url as string;
  },
  openPortal: async (returnUrl: string) => {
    const data = await post('/billing/portal', { returnUrl });
    return data.url as string;
  },
};
