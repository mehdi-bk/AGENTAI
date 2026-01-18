/**
 * SERVICE ADMIN - Communication avec l'API backend sécurisée
 * 
 * Gère toutes les requêtes vers l'API admin avec gestion des tokens,
 * CSRF, et erreurs.
 * 
 * MBK: Service layer implementation with token management and error handling
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Debug: Log API base URL in development
if (import.meta.env.DEV) {
    console.log('🔗 Admin API Base URL:', API_BASE_URL);
}

// Stockage des tokens
let authToken: string | null = null;
let csrfToken: string | null = null;

/**
 * Définit le token d'authentification
 */
export const setAuthToken = (token: string) => {
    authToken = token;
    localStorage.setItem('adminToken', token);
};

/**
 * Définit le token CSRF
 */
export const setCSRFToken = (token: string) => {
    csrfToken = token;
    localStorage.setItem('csrfToken', token);
};

/**
 * Récupère le token d'authentification
 */
export const getAuthToken = (): string | null => {
    if (!authToken) {
        authToken = localStorage.getItem('adminToken');
    }
    return authToken;
};

/**
 * Récupère le token CSRF
 */
export const getCSRFToken = (): string | null => {
    if (!csrfToken) {
        csrfToken = localStorage.getItem('csrfToken');
    }
    return csrfToken;
};

/**
 * Effectue une requête avec gestion automatique des tokens
 */
const request = async (
    endpoint: string,
    options: RequestInit = {},
    skipCSRF: boolean = false
): Promise<any> => {
    const token = getAuthToken();
    const csrf = getCSRFToken();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        // Ne pas inclure le CSRF token pour les routes publiques (login, verify-2fa)
        ...(csrf && !skipCSRF && { 'X-CSRF-Token': csrf }),
        ...options.headers
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
            credentials: 'include'
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Erreur inconnue' }));

            // Si token expiré, rediriger vers la connexion
            if (response.status === 401) {
                localStorage.removeItem('adminToken');
                localStorage.removeItem('csrfToken');
                window.location.href = '/admin/login';
                throw new Error('Session expirée');
            }

            throw new Error(error.message || 'Erreur lors de la requête');
        }

        return response.json();
    } catch (error: any) {
        // Handle network errors (CORS, connection refused, etc.)
        if (error.name === 'TypeError' || error.message.includes('fetch')) {
            console.error('Network error:', error);
            throw new Error(
                `Impossible de se connecter au serveur. Vérifiez que le backend est démarré sur ${API_BASE_URL}`
            );
        }
        throw error;
    }
};

// ============================================
// AUTHENTIFICATION
// ============================================

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface TwoFactorVerification {
    tempToken: string;
    code: string;
}

export const adminAuth = {
    login: async (credentials: LoginCredentials) => {
        // Les routes de login sont exclues de la protection CSRF
        const response = await request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        }, true); // skipCSRF = true pour les routes publiques

        if (response.success) {
            setAuthToken(response.token);
            setCSRFToken(response.csrfToken);
        }

        return response;
    },

    verify2FA: async (data: TwoFactorVerification) => {
        // Les routes de vérification 2FA sont exclues de la protection CSRF
        const response = await request('/auth/verify-2fa', {
            method: 'POST',
            body: JSON.stringify(data)
        }, true); // skipCSRF = true pour les routes publiques

        if (response.success) {
            setAuthToken(response.token);
            setCSRFToken(response.csrfToken);
        }

        return response;
    },

    logout: async () => {
        await request('/auth/logout', { method: 'POST' });
        authToken = null;
        csrfToken = null;
        localStorage.removeItem('adminToken');
        localStorage.removeItem('csrfToken');
    },

    refreshToken: async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const response = await request('/auth/refresh', {
            method: 'POST',
            body: JSON.stringify({ refreshToken })
        });

        if (response.success) {
            setAuthToken(response.token);
            setCSRFToken(response.csrfToken);
        }

        return response;
    }
};

// ============================================
// DASHBOARD
// ============================================

export const dashboard = {
    getStats: () => request('/admin/dashboard/stats'),
    getCharts: (period: string = '30') => request(`/admin/dashboard/charts?period=${period}`)
};

// ============================================
// CLIENTS
// ============================================

export interface ClientFilters {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    subscriptionType?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export const clients = {
    list: (filters: ClientFilters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined) params.append(key, String(value));
        });
        return request(`/admin/clients?${params.toString()}`);
    },

    get: (id: string) => request(`/admin/clients/${id}`),

    adjustCredits: (id: string, amount: number, description?: string) =>
        request(`/admin/clients/${id}/credits`, {
            method: 'POST',
            body: JSON.stringify({ amount, description })
        }),

    updateStatus: (id: string, status: string) =>
        request(`/admin/clients/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status })
        }),

    updateSubscription: (id: string, subscriptionType: string) =>
        request(`/admin/clients/${id}/subscription`, {
            method: 'PATCH',
            body: JSON.stringify({ subscriptionType })
        }),

    resetPassword: (id: string) =>
        request(`/admin/clients/${id}/reset-password`, {
            method: 'POST'
        }),

    getCampaigns: (id: string) => request(`/admin/clients/${id}/campaigns`),

    export: () => request('/admin/clients/export')
};

// ============================================
// FACTURES
// ============================================

export interface InvoiceFilters {
    page?: number;
    limit?: number;
    clientId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
}

export const invoices = {
    list: (filters: InvoiceFilters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined) params.append(key, String(value));
        });
        return request(`/admin/invoices?${params.toString()}`);
    },

    get: (id: string) => request(`/admin/invoices/${id}`),

    create: (data: any) =>
        request('/admin/invoices', {
            method: 'POST',
            body: JSON.stringify(data)
        }),

    updateStatus: (id: string, status: string) =>
        request(`/admin/invoices/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status })
        }),

    resend: (id: string) =>
        request(`/admin/invoices/${id}/resend`, {
            method: 'POST'
        }),

    cancel: (id: string) =>
        request(`/admin/invoices/${id}`, {
            method: 'DELETE'
        }),

    preview: (id: string) => request(`/admin/invoices/${id}/preview`)
};

// ============================================
// REMBOURSEMENTS
// ============================================

export interface RefundFilters {
    page?: number;
    limit?: number;
    clientId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
}

export const refunds = {
    list: (filters: RefundFilters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined) params.append(key, String(value));
        });
        return request(`/admin/refunds?${params.toString()}`);
    },

    get: (id: string) => request(`/admin/refunds/${id}`),

    create: (data: any) =>
        request('/admin/refunds', {
            method: 'POST',
            body: JSON.stringify(data)
        }),

    updateStatus: (id: string, status: string, adminNotes?: string) =>
        request(`/admin/refunds/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status, adminNotes })
        }),

    updateNotes: (id: string, adminNotes: string) =>
        request(`/admin/refunds/${id}/notes`, {
            method: 'PATCH',
            body: JSON.stringify({ adminNotes })
        })
};

// ============================================
// CODES PROMOTIONNELS
// ============================================

export interface PromoCodeFilters {
    page?: number;
    limit?: number;
    isActive?: boolean;
}

export const promoCodes = {
    list: (filters: PromoCodeFilters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined) params.append(key, String(value));
        });
        return request(`/admin/promo-codes?${params.toString()}`);
    },

    get: (id: string) => request(`/admin/promo-codes/${id}`),

    create: (data: any) =>
        request('/admin/promo-codes', {
            method: 'POST',
            body: JSON.stringify(data)
        }),

    update: (id: string, data: any) =>
        request(`/admin/promo-codes/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        }),

    deactivate: (id: string) =>
        request(`/admin/promo-codes/${id}`, {
            method: 'DELETE'
        }),

    getStats: (id: string) => request(`/admin/promo-codes/${id}/stats`)
};

// ============================================
// ADMIN
// ============================================

export const admin = {
    getProfile: () => request('/admin/profile'),
    getAuditLogs: (filters: any = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined) params.append(key, String(value));
        });
        return request(`/admin/audit-logs?${params.toString()}`);
    },
    getAdmins: () => request('/admin/admins'),
    createAdmin: (data: any) =>
        request('/admin/create-admin', {
            method: 'POST',
            body: JSON.stringify(data)
        })
};
