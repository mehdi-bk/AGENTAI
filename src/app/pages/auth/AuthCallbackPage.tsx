import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { checkOnboardingStatus } from '@/services/authService';
import { toast } from 'sonner';

export default function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('🔄 Auth callback started...');
        
        // Attendre que Supabase termine complètement l'authentification OAuth
        console.log('⏳ Waiting for Supabase to complete authentication...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log('🔍 Checking onboarding status...');
        const { completed, needsOnboarding, user } = await checkOnboardingStatus();

        console.log('📊 Callback result:', { 
          completed, 
          needsOnboarding, 
          userEmail: user?.email,
          userMetadata: user?.user_metadata 
        });

        if (!user) {
          console.error('❌ No user found after authentication');
          toast.error('Erreur d\'authentification. Veuillez réessayer.');
          navigate('/login', { replace: true });
          return;
        }

        console.log('👤 User authenticated:', user.email);

        if (needsOnboarding) {
          console.log('➡️ New user or incomplete profile - redirecting to onboarding...');
          toast.info('Bienvenue ! Veuillez compléter votre profil.');
          // Force navigation to onboarding
          navigate('/onboarding', { replace: true });
        } else {
          console.log('➡️ Existing user with complete profile - redirecting to dashboard...');
          toast.success(`Bienvenue ${user.email} !`);
          // User has completed onboarding
          navigate('/dashboard', { replace: true });
        }
      } catch (error) {
        console.error('❌ Error in auth callback:', error);
        toast.error('Erreur lors de la connexion. Veuillez réessayer.');
        navigate('/login', { replace: true });
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Connexion en cours...</h2>
        <p className="text-gray-600">Veuillez patienter</p>
      </div>
    </div>
  );
}
