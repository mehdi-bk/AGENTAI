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
        // Attendre un peu pour que Supabase termine l'auth
        await new Promise(resolve => setTimeout(resolve, 1000));

        const { completed, needsOnboarding, user } = await checkOnboardingStatus();

        if (!user) {
          toast.error('Erreur d\'authentification');
          navigate('/login');
          return;
        }

        if (needsOnboarding) {
          // Nouvel utilisateur ou profil incomplet -> Onboarding
          navigate('/onboarding');
        } else {
          // Utilisateur existant avec profil complet -> Dashboard
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
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
