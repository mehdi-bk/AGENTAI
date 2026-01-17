import { supabase } from '../lib/supabase';

export interface Integration {
  id: string;
  user_id: string;
  provider: string;
  access_token: string;
  refresh_token?: string;
  expires_at?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  organization_id: string;
  user_id: string;
  email: string;
  role: 'admin' | 'member';
  status: 'active' | 'pending';
  invited_by: string;
  created_at: string;
}

/**
 * Récupère toutes les intégrations de l'utilisateur
 */
export const getUserIntegrations = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, data: [], message: 'Non authentifié' };
    }

    const { data, error } = await supabase
      .from('integrations')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching integrations:', error);
      return { success: false, data: [], message: error.message };
    }

    return { success: true, data: data || [], message: 'Intégrations récupérées' };
  } catch (error: any) {
    console.error('Error in getUserIntegrations:', error);
    return { success: false, data: [], message: error.message };
  }
};

/**
 * Connecte une intégration Google Calendar
 */
export const connectGoogleCalendar = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard/integrations?provider=google_calendar`,
        scopes: 'https://www.googleapis.com/auth/calendar',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, data, message: 'Redirection vers Google...' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

/**
 * Connecte Gmail
 */
export const connectGmail = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard/integrations?provider=gmail`,
        scopes: 'https://www.googleapis.com/auth/gmail.send',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, data, message: 'Redirection vers Google...' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

/**
 * Connecte Apple Calendar (via Sign in with Apple)
 */
export const connectAppleCalendar = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${window.location.origin}/dashboard/integrations?provider=apple_calendar`,
        scopes: 'name email',
      },
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, data, message: 'Redirection vers Apple...' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

/**
 * Sauvegarde une intégration
 */
export const saveIntegration = async (provider: string, accessToken: string, refreshToken?: string, expiresAt?: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, message: 'Non authentifié' };
    }

    // Vérifier si l'intégration existe déjà
    const { data: existing } = await supabase
      .from('integrations')
      .select('id')
      .eq('user_id', user.id)
      .eq('provider', provider)
      .single();

    if (existing) {
      // Mettre à jour
      const { error } = await supabase
        .from('integrations')
        .update({
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_at: expiresAt,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id);

      if (error) {
        return { success: false, message: error.message };
      }
    } else {
      // Créer
      const { error } = await supabase
        .from('integrations')
        .insert({
          user_id: user.id,
          provider,
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_at: expiresAt,
        });

      if (error) {
        return { success: false, message: error.message };
      }
    }

    return { success: true, message: 'Intégration sauvegardée' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

/**
 * Déconnecte une intégration
 */
export const disconnectIntegration = async (provider: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, message: 'Non authentifié' };
    }

    const { error } = await supabase
      .from('integrations')
      .delete()
      .eq('user_id', user.id)
      .eq('provider', provider);

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: 'Intégration déconnectée' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

/**
 * Récupère les membres de l'équipe
 */
export const getTeamMembers = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, data: [], message: 'Non authentifié' };
    }

    // Récupérer l'organization_id de l'utilisateur
    const organizationId = user.user_metadata?.organization_id || user.id;

    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching team members:', error);
      return { success: false, data: [], message: error.message };
    }

    return { success: true, data: data || [], message: 'Membres récupérés' };
  } catch (error: any) {
    console.error('Error in getTeamMembers:', error);
    return { success: false, data: [], message: error.message };
  }
};

/**
 * Invite un nouveau membre à l'équipe
 */
export const inviteTeamMember = async (email: string, role: 'admin' | 'member' = 'member') => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, message: 'Non authentifié' };
    }

    // Récupérer l'organization_id
    const organizationId = user.user_metadata?.organization_id || user.id;

    // Vérifier si le membre existe déjà
    const { data: existing } = await supabase
      .from('team_members')
      .select('id')
      .eq('organization_id', organizationId)
      .eq('email', email)
      .single();

    if (existing) {
      return { success: false, message: 'Ce membre fait déjà partie de l\'équipe' };
    }

    // Créer l'invitation
    const { data, error } = await supabase
      .from('team_members')
      .insert({
        organization_id: organizationId,
        email,
        role,
        status: 'pending',
        invited_by: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error inviting team member:', error);
      return { success: false, message: error.message };
    }

    // TODO: Envoyer un email d'invitation
    // Vous pouvez utiliser Supabase Edge Functions ou un service tiers comme SendGrid

    return { success: true, data, message: `Invitation envoyée à ${email}` };
  } catch (error: any) {
    console.error('Error in inviteTeamMember:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Retire un membre de l'équipe
 */
export const removeTeamMember = async (memberId: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, message: 'Non authentifié' };
    }

    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', memberId);

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: 'Membre retiré de l\'équipe' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

/**
 * Met à jour le rôle d'un membre
 */
export const updateMemberRole = async (memberId: string, role: 'admin' | 'member') => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, message: 'Non authentifié' };
    }

    const { error } = await supabase
      .from('team_members')
      .update({ role })
      .eq('id', memberId);

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: 'Rôle mis à jour' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};
