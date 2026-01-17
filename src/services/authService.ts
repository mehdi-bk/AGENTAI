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
    console.log('🔐 Starting Google OAuth sign in...');
    
    // Nettoyer COMPLÈTEMENT toute session existante
    console.log('🧹 Cleaning ALL existing sessions before OAuth...');
    
    // 1. Déconnexion Supabase globale
    await supabase.auth.signOut({ scope: 'global' });
    
    // 2. Nettoyer le localStorage
    console.log('🗑️ Clearing localStorage...');
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('supabase') || key.includes('auth'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // 3. Nettoyer le sessionStorage
    sessionStorage.clear();
    
    // Délai plus long pour garantir le nettoyage
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('🔄 Starting fresh OAuth flow...');
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${import.meta.env.VITE_APP_URL}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account', // Force la sélection du compte Google
          // Ajouter un paramètre pour forcer le refresh
          login_hint: '', // Vide pour ne pas suggérer de compte
        },
        skipBrowserRedirect: false,
      },
    });

    if (error) throw error;

    console.log('✅ Google OAuth initiated successfully');
    return {
      success: true,
      data,
    };
  } catch (error: any) {
    console.error('❌ Error signing in with Google:', error);
    return {
      success: false,
      message: error.message || 'Erreur lors de la connexion avec Google',
      data: null,
    };
  }
};

/**
 * Authentification avec Outlook/Microsoft Azure OAuth
 */
export const signInWithOutlook = async () => {
  try {
    console.log('🔐 Starting Outlook OAuth sign in...');
    
    console.log('🔄 Starting Outlook OAuth flow...');
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        // Supabase redirigera automatiquement vers son propre callback
        // puis vers cette URL après l'authentification
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: 'email openid profile offline_access',
        queryParams: {
          prompt: 'select_account', // Force la sélection du compte Microsoft
        },
      },
    });

    if (error) throw error;

    console.log('✅ Outlook OAuth initiated successfully');
    return {
      success: true,
      data,
    };
  } catch (error: any) {
    console.error('❌ Error signing in with Outlook:', error);
    return {
      success: false,
      message: error.message || 'Erreur lors de la connexion avec Outlook',
      data: null,
    };
  }
};

/**
 * Vérifie si l'utilisateur a complété l'onboarding
 */
export const checkOnboardingStatus = async () => {
  try {
    console.log('🔍 Getting user from Supabase...');
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('❌ Error getting user:', error);
      return { completed: false, needsOnboarding: false, user: null };
    }
    
    if (!user) {
      console.log('❌ No user found');
      return { completed: false, needsOnboarding: false, user: null };
    }

    console.log('✅ User found:', user.email);
    console.log('📋 User metadata:', user.user_metadata);
    console.log('🆔 User ID:', user.id);
    console.log('📅 User created at:', user.created_at);

    const metadata = user.user_metadata || {};
    
    // LOGIQUE SIMPLE : L'onboarding est complété SEULEMENT si ces 3 conditions sont remplies :
    // 1. Le flag onboarding_completed est à true
    // 2. Il y a une entreprise (company)
    // 3. Il y a un timestamp de complétion (onboarding_completed_at)
    
    const onboardingCompleted = metadata.onboarding_completed === true;
    const hasCompany = !!metadata.company;
    const hasTimestamp = !!metadata.onboarding_completed_at;
    
    // Si ces 3 conditions ne sont PAS toutes remplies, alors onboarding est nécessaire
    const isProfileComplete = onboardingCompleted && hasCompany && hasTimestamp;
    const needsOnboarding = !isProfileComplete;

    console.log('✅ Onboarding completed flag:', onboardingCompleted);
    console.log('🏢 Has company:', hasCompany);
    console.log('⏰ Has completion timestamp:', hasTimestamp);
    console.log('📝 Is profile complete:', isProfileComplete);
    console.log('📍 Needs onboarding:', needsOnboarding);
    
    // Si needsOnboarding est TRUE, afficher pourquoi
    if (needsOnboarding) {
      const reasons = [];
      if (!onboardingCompleted) reasons.push('no completed flag');
      if (!hasCompany) reasons.push('no company');
      if (!hasTimestamp) reasons.push('no timestamp');
      console.log('❗ Onboarding needed because:', reasons.join(', '));
    }

    return {
      completed: isProfileComplete,
      needsOnboarding: needsOnboarding,
      user,
    };
  } catch (error) {
    console.error('❌ Exception in checkOnboardingStatus:', error);
    return { completed: false, needsOnboarding: true, user: null };
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
