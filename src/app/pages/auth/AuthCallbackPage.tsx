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
        console.log('🌐 Current URL:', window.location.href);
        console.log('🔗 Search params:', window.location.search);
        console.log('🔗 Hash:', window.location.hash);
        
        // Attendre que Supabase termine complètement l'authentification OAuth
        console.log('⏳ Waiting for Supabase to complete authentication...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log('🔍 Checking onboarding status...');
        const { completed, needsOnboarding, user } = await checkOnboardingStatus();

        console.log('📊 Callback result:', { 
          completed, 
          needsOnboarding, 
          userEmail: user?.email,
          userId: user?.id,
          userCreatedAt: user?.created_at,
          userMetadata: user?.user_metadata,
          appMetadata: user?.app_metadata
        });

        if (!user) {
          console.error('❌ No user found after authentication');
          console.error('❌ This might be a session issue or OAuth callback error');
          
          // Vérifier s'il y a des erreurs dans l'URL
          const params = new URLSearchParams(window.location.search);
          const error = params.get('error');
          const errorDescription = params.get('error_description');
          
          if (error) {
            console.error('❌ OAuth Error:', error);
            console.error('❌ Error Description:', errorDescription);
            toast.error(`Erreur OAuth: ${errorDescription || error}`);
          } else {
            toast.error('Erreur d\'authentification. Veuillez réessayer.');
          }
          
          navigate('/login', { replace: true });
          return;
        }

        console.log('✅ User authenticated:', user.email);
        console.log('🆔 User ID:', user.id);
        console.log('🔑 Auth provider:', user.app_metadata?.provider);
        console.log('📅 Account created:', user.created_at);
        console.log('📋 Needs onboarding?', needsOnboarding);

        // Afficher un message de bienvenue avec l'email
        if (needsOnboarding) {
          console.log('➡️ NEW USER - redirecting to onboarding...');
          toast.info(`Connecté avec ${user.email}. Complétez votre profil.`);
          navigate('/onboarding', { replace: true });
        } else {
          console.log('➡️ EXISTING USER - redirecting to dashboard...');
          toast.success(`Bienvenue ${user.email} !`);
          navigate('/dashboard', { replace: true });
        }
      } catch (error) {
        console.error('❌ Error in auth callback:', error);
        console.error('❌ Error details:', JSON.stringify(error, null, 2));
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
