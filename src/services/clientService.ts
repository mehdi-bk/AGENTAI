/**
 * CLIENT SERVICE - Communication avec l'API backend pour les clients
 * 
 * MBK: Service layer for client data synchronization
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

/**
 * Synchronise un utilisateur Supabase avec le backend Client table
 */
export const syncClient = async (supabaseUser: any) => {
  try {
    const metadata = supabaseUser.user_metadata || {};
    
    const response = await fetch(`${API_BASE_URL}/clients/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        supabaseUserId: supabaseUser.id,
        email: supabaseUser.email,
        fullName: metadata.full_name || metadata.fullName || supabaseUser.email?.split('@')[0],
        company: metadata.company || null,
        metadata: metadata
      }),
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erreur inconnue' }));
      throw new Error(error.message || 'Erreur lors de la synchronisation');
    }

    return response.json();
  } catch (error: any) {
    console.error('Error syncing client:', error);
    throw error;
  }
};
