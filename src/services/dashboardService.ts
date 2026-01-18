/**
 * DASHBOARD SERVICE - Client dashboard API calls
 * 
 * MBK: Service layer for client dashboard data
 */

import { supabase } from '@/lib/supabase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

/**
 * Get client email from Supabase session
 */
const getClientEmail = async (): Promise<string | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.email || null;
  } catch (error) {
    console.error('Error getting client email:', error);
    return null;
  }
};

/**
 * Make authenticated request to client API
 */
const clientRequest = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  try {
    const email = await getClientEmail();
    
    if (!email) {
      throw new Error('Non authentifié');
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Email': email,
        ...options.headers
      },
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erreur inconnue' }));
      throw new Error(error.message || 'Erreur lors de la requête');
    }

    return response.json();
  } catch (error: any) {
    console.error('Error in client request:', error);
    throw error;
  }
};

/**
 * Dashboard statistics
 */
export const dashboard = {
  getStats: async () => {
    return clientRequest('/client/dashboard/stats');
  },
  
  getActivities: async () => {
    return clientRequest('/client/activities');
  }
};

/**
 * Campaigns
 */
export const campaigns = {
  list: async (status?: string) => {
    const params = status ? `?status=${status}` : '';
    return clientRequest(`/client/campaigns${params}`);
  },
  
  get: async (id: string) => {
    return clientRequest(`/client/campaigns/${id}`);
  },
  
  create: async (data: {
    name: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    goal?: string;
    targetIndustry?: string;
  }) => {
    return clientRequest('/client/campaigns', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  update: async (id: string, data: any) => {
    return clientRequest(`/client/campaigns/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }
};

/**
 * Prospects
 */
export const prospects = {
  list: async () => {
    return clientRequest('/client/prospects');
  }
};

/**
 * Meetings
 */
export const meetings = {
  list: async () => {
    return clientRequest('/client/meetings');
  }
};
