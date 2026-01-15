import { supabase } from '@/lib/supabase';

export interface SignInWithOTPParams {
  email: string;
}

export interface VerifyOTPParams {
  email: string;
  token: string;
}

export interface SignUpParams {
  email: string;
  fullName?: string;
  company?: string;
}

/**
 * Authentification avec Google OAuth
 */
export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${import.meta.env.VITE_APP_URL}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) throw error;

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    console.error('Error signing in with Google:', error);
    return {
      success: false,
      message: error.message || 'Erreur lors de la connexion avec Google',
      data: null,
    };
  }
};

/**
 * Vérifie si l'utilisateur a complété l'onboarding
 */
export const checkOnboardingStatus = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { completed: false, needsOnboarding: false };
    }

    const metadata = user.user_metadata || {};
    const onboardingCompleted = metadata.onboarding_completed === true;
    const hasCompany = !!metadata.company;

    return {
      completed: onboardingCompleted && hasCompany,
      needsOnboarding: !onboardingCompleted || !hasCompany,
      user,
    };
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return { completed: false, needsOnboarding: false };
  }
};

/**
 * Envoie un code de vérification OTP par email
 */
export const sendVerificationCode = async ({ email }: SignInWithOTPParams) => {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true, // Crée automatiquement un user si n'existe pas
        emailRedirectTo: `${import.meta.env.VITE_APP_URL}/dashboard`,
      },
    });

    if (error) throw error;

    // En mode dev, affiche un message dans la console
    if (import.meta.env.VITE_DEV_MODE === 'true') {
      console.log('🔐 [DEV MODE] Code OTP envoyé à:', email);
      console.log('📧 Vérifiez les logs Supabase Auth pour voir le code');
      console.log('🔗 https://supabase.com/dashboard/project/vqebrtggktfymchljbtx/logs/auth-logs');
    }

    return {
      success: true,
      message: 'Code de vérification envoyé ! Vérifiez votre email.',
      data,
    };
  } catch (error: any) {
    console.error('Error sending OTP:', error);
    return {
      success: false,
      message: error.message || 'Erreur lors de l\'envoi du code',
      data: null,
    };
  }
};

/**
 * Vérifie le code OTP entré par l'utilisateur
 */
export const verifyOTPCode = async ({ email, token }: VerifyOTPParams) => {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });

    if (error) throw error;

    return {
      success: true,
      message: 'Connexion réussie !',
      user: data.user,
      session: data.session,
    };
  } catch (error: any) {
    console.error('Error verifying OTP:', error);
    return {
      success: false,
      message: error.message || 'Code invalide ou expiré',
      user: null,
      session: null,
    };
  }
};

/**
 * Inscription avec métadonnées supplémentaires
 */
export const signUpWithMetadata = async ({ email, fullName, company }: SignUpParams) => {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        data: {
          full_name: fullName,
          company: company,
        },
        emailRedirectTo: `${import.meta.env.VITE_APP_URL}/dashboard`,
      },
    });

    if (error) throw error;

    return {
      success: true,
      message: 'Code de vérification envoyé ! Vérifiez votre email.',
      data,
    };
  } catch (error: any) {
    console.error('Error signing up:', error);
    return {
      success: false,
      message: error.message || 'Erreur lors de l\'inscription',
      data: null,
    };
  }
};

/**
 * Déconnexion
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error signing out:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Récupère la session courante
 */
export const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};

/**
 * Récupère l'utilisateur courant
 */
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};
