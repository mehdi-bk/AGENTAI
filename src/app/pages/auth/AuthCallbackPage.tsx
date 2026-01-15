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
        
        // Attendre un peu pour que Supabase termine l'auth
        console.log('⏳ Waiting for Supabase to complete authentication...');
        await new Promise(resolve => setTimeout(resolve, 1500));

        console.log('✅ Checking onboarding status...');
        const { completed, needsOnboarding, user } = await checkOnboardingStatus();

        console.log('📊 Callback result:', { completed, needsOnboarding, userEmail: user?.email });

        if (!user) {
          console.error('❌ No user found after authentication');
          toast.error('Erreur d\'authentification');
          navigate('/login');
          return;
        }

        console.log('👤 User found:', user.email);

        if (needsOnboarding) {
          console.log('➡️ Redirecting to onboarding...');
          // Nouvel utilisateur ou profil incomplet -> Onboarding
          navigate('/onboarding');
        } else {
          console.log('➡️ Redirecting to dashboard...');
          // Utilisateur existant avec profil complet -> Dashboard
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('❌ Error in auth callback:', error);
        toast.error('Erreur lors de la connexion');
        navigate('/login');
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
