import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { checkOnboardingStatus } from '@/services/authService';

interface OnboardingRouteProps {
  children: React.ReactNode;
}

/**
 * Route spéciale pour la page d'onboarding
 * - Redirige vers /login si pas authentifié
 * - Redirige vers /dashboard si l'onboarding est déjà complété
 * - Affiche la page d'onboarding si authentifié mais onboarding incomplet
 */
export default function OnboardingRoute({ children }: OnboardingRouteProps) {
  const { user, loading: authLoading } = useAuth();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      if (!user) {
        setCheckingOnboarding(false);
        return;
      }

      try {
        console.log('🔍 OnboardingRoute: Checking onboarding status for', user.email);
        const { needsOnboarding: needs } = await checkOnboardingStatus();
        console.log('📊 OnboardingRoute: Needs onboarding?', needs);
        setNeedsOnboarding(needs);
      } catch (error) {
        console.error('❌ OnboardingRoute: Error checking status', error);
        setNeedsOnboarding(true); // Par défaut, demander l'onboarding en cas d'erreur
      } finally {
        setCheckingOnboarding(false);
      }
    };

    if (!authLoading) {
      checkStatus();
    }
  }, [user, authLoading]);

  // Attendre que l'auth et la vérification d'onboarding soient terminées
  if (authLoading || checkingOnboarding) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Vérification du profil...</p>
        </div>
      </div>
    );
  }

  // Pas authentifié -> rediriger vers login
  if (!user) {
    console.log('❌ OnboardingRoute: No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Authentifié mais onboarding déjà complété -> rediriger vers dashboard
  if (!needsOnboarding) {
    console.log('✅ OnboardingRoute: Onboarding already completed, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  // Authentifié et onboarding incomplet -> afficher la page d'onboarding
  console.log('✅ OnboardingRoute: Showing onboarding page');
  return <>{children}</>;
}
