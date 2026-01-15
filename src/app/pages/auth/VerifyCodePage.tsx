import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent, CardHeader } from '@/app/components/ui/card';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { verifyOTPCode } from '@/services/authService';
import { Mail, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export default function VerifyCodePage() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Récupère l'email depuis l'URL ou localStorage
  const email = new URLSearchParams(window.location.search).get('email') || 
                localStorage.getItem('verification_email') || '';

  const isDev = import.meta.env.VITE_DEV_MODE === 'true';

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Email manquant. Veuillez recommencer.');
      navigate('/login');
      return;
    }

    if (code.length !== 6) {
      toast.error('Le code doit contenir 6 chiffres');
      return;
    }

    setLoading(true);

    try {
      const result = await verifyOTPCode({ email, token: code });
      
      if (result.success) {
        toast.success(result.message);
        localStorage.removeItem('verification_email');
        navigate('/dashboard');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Erreur lors de la vérification');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${import.meta.env.VITE_APP_URL}/dashboard`,
        },
      });
      
      if (error) throw error;
      
      toast.success('Nouveau code envoyé !');
      
      if (isDev) {
        console.log('🔐 [DEV MODE] Nouveau code envoyé à:', email);
      }
    } catch (error) {
      toast.error('Erreur lors du renvoi du code');
    }
  };

  // Skip verification en mode dev
  const handleDevSkip = async () => {
    if (!isDev) return;
    
    setLoading(true);
    try {
      // En mode dev, on marque qu'on bypass l'auth
      localStorage.setItem('dev_bypass_auth', 'true');
      localStorage.setItem('dev_user_email', email);
      
      // Essaie de récupérer le nom et l'entreprise depuis les données d'inscription
      const fullName = localStorage.getItem('signup_full_name');
      const company = localStorage.getItem('signup_company');
      
      if (fullName) {
        localStorage.setItem('dev_user_name', fullName);
        localStorage.removeItem('signup_full_name'); // Nettoie après usage
      }
      
      if (company) {
        localStorage.setItem('dev_user_company', company);
        localStorage.removeItem('signup_company'); // Nettoie après usage
      }
      
      localStorage.removeItem('verification_email');
      
      toast.success('Mode Dev: Accès autorisé sans vérification');
      
      // Attendre un peu pour que l'utilisateur voit le message
      setTimeout(() => {
        navigate('/dashboard');
        // Force un reload pour que le AuthContext se rafraîchisse
        window.location.href = '/dashboard';
      }, 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center pb-8">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">Vérifiez votre email</h1>
            <p className="text-gray-600">
              Nous avons envoyé un code à <br />
              <span className="font-medium text-gray-900">{email}</span>
            </p>
          </div>
        </CardHeader>
        
        <CardContent>
          {isDev && (
            <Alert className="mb-6 bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800 text-sm">
                <strong>Mode Développement :</strong>
                <br />
                <span className="text-xs">
                  • Vérifiez votre boîte mail si c'est l'email de votre compte Supabase
                  <br />
                  • Ou cliquez sur "Skip en Mode Dev" ci-dessous pour passer directement
                </span>
              </AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Code de vérification (6 chiffres)
              </label>
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="text-center text-2xl tracking-widest font-mono"
                autoFocus
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                Le code expire dans 10 minutes
              </p>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-secondary"
              disabled={loading || code.length !== 6}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Vérification...
                </>
              ) : (
                'Vérifier'
              )}
            </Button>
            
            <div className="text-center space-y-3">

            {isDev && (
              <Button
                type="button"
                onClick={handleDevSkip}
                className="w-full"
                variant="outline"
                disabled={loading}
              >
                🔓 Skip en Mode Dev (Bypass)
              </Button>
            )}
              <button
                type="button"
                onClick={handleResendCode}
                className="text-sm text-primary hover:underline"
              >
                Renvoyer le code
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900 w-full"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour à la connexion
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
