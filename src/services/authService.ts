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
    
    // Nettoyer toute session existante AVANT de démarrer OAuth
    console.log('🧹 Cleaning existing session before OAuth...');
    await supabase.auth.signOut({ scope: 'local' });
    
    // Petit délai pour s'assurer que la session est bien nettoyée
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        redirectTo: `${import.meta.env.VITE_APP_URL}/auth/callback`,
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
    
    // Vérifier si c'est un compte NOUVELLEMENT créé (moins de 5 minutes)
    const userCreatedAt = new Date(user.created_at);
    const now = new Date();
    const minutesSinceCreation = (now.getTime() - userCreatedAt.getTime()) / (1000 * 60);
    const isNewlyCreated = minutesSinceCreation < 5;
    
    console.log('⏱️ Account age (minutes):', minutesSinceCreation.toFixed(2));
    console.log('🆕 Is newly created (< 5 min):', isNewlyCreated);
    
    // IMPORTANT : Pour les utilisateurs OAuth (Google, Azure, etc.)
    // on doit TOUJOURS vérifier que l'onboarding est explicitement complété
    // Sinon, c'est un nouvel utilisateur qui doit passer par l'onboarding
    
    const onboardingCompleted = metadata.onboarding_completed === true;
    const hasCompany = !!metadata.company;
    
    // Si le compte a été créé il y a moins de 5 minutes ET n'a pas d'onboarding_completed_at
    // alors c'est FORCÉMENT un nouveau compte qui doit passer par l'onboarding
    const hasOnboardingTimestamp = !!metadata.onboarding_completed_at;
    
    // Un profil est complet SEULEMENT si :
    // 1. onboarding_completed est explicitement true
    // 2. ET company existe
    // 3. ET ce n'est PAS un compte nouvellement créé SANS timestamp d'onboarding
    const isProfileComplete = onboardingCompleted && hasCompany && (hasOnboardingTimestamp || !isNewlyCreated);
    
    // Si le profil n'est pas complet, l'utilisateur doit passer par l'onboarding
    const needsOnboarding = !isProfileComplete;

    console.log('✅ Onboarding completed:', onboardingCompleted);
    console.log('🏢 Has company:', hasCompany);
    console.log('⏰ Has onboarding timestamp:', hasOnboardingTimestamp);
    console.log('📝 Is profile complete:', isProfileComplete);
    console.log('📍 Needs onboarding:', needsOnboarding);

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
