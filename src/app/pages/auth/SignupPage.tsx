import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Brain, Loader2, Mail, User, Building, Check } from 'lucide-react';
import { signUpWithMetadata, signInWithGoogle, signInWithOutlook } from '@/services/authService';
import { toast } from 'sonner';

export default function SignupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [outlookLoading, setOutlookLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreedToTerms) {
      toast.error('Veuillez accepter les conditions d\'utilisation');
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await signUpWithMetadata({
        email: email,
      });
      
      if (result.success) {
        toast.success(result.message);
        localStorage.setItem('verification_email', email);
        navigate(`/verify-code?email=${encodeURIComponent(email)}`);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    try {
      const result = await signInWithGoogle();
      
      if (!result.success) {
        toast.error(result.message || 'Erreur lors de l\'inscription avec Google');
        setGoogleLoading(false);
      }
      // Si succès, Supabase redirige automatiquement vers Google OAuth
      // puis revient sur /dashboard après l'authentification
    } catch (error) {
      toast.error('Erreur lors de l\'inscription avec Google');
      setGoogleLoading(false);
    }
  };

  const handleOutlookSignUp = async () => {
    setOutlookLoading(true);
    try {
      const result = await signInWithOutlook();
      
      if (!result.success) {
        toast.error(result.message || 'Erreur lors de l\'inscription avec Outlook');
        setOutlookLoading(false);
      }
      // Si succès, Supabase redirige automatiquement vers Azure OAuth
    } catch (error) {
      toast.error('Erreur lors de l\'inscription avec Outlook');
      setOutlookLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center space-x-2 mb-8">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">AI SDR</span>
          </Link>
          
          <h1 className="text-3xl font-bold mb-2">Create your account</h1>
          <p className="text-gray-600 mb-8">Choose your preferred sign-up method</p>
          
          {/* Boutons OAuth en premier */}
          <div className="space-y-3 mb-6">
            <Button 
              type="button" 
              variant="outline" 
              className="w-full"
              onClick={handleGoogleSignUp} 
              disabled={googleLoading}
            >
              {googleLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Connexion...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign up with Google
                </>
              )}
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              className="w-full"
              onClick={handleOutlookSignUp} 
              disabled={outlookLoading}
            >
              {outlookLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Connexion...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 7.387v9.226a3.387 3.387 0 01-3.387 3.387h-6.226V3h6.226A3.387 3.387 0 0124 6.387v1zM13.355 3v17H3.387A3.387 3.387 0 010 16.613V7.387A3.387 3.387 0 013.387 4h9.968v-1zm-2.258 8.516c0-1.161-.968-2.097-2.161-2.097-1.194 0-2.162.936-2.162 2.097 0 1.161.968 2.097 2.162 2.097 1.193 0 2.161-.936 2.161-2.097z"/>
                  </svg>
                  Sign up with Outlook
                </>
              )}
            </Button>
          </div>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or sign up with email</span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Work Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10"
                  autoFocus
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                We'll send you a verification code
              </p>
            </div>
            
            <div className="flex items-start space-x-2 pt-2">
              <Checkbox 
                id="terms" 
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                required 
              />
              <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                I agree to the{' '}
                <a href="#" className="text-primary hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-primary hover:underline">Privacy Policy</a>
              </label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending code...
                </>
              ) : (
                'Continue with Email'
              )}
            </Button>
          </form>
          
          <p className="text-center text-sm text-gray-600 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
      
      {/* Right Side - Gradient with Value Prop */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-secondary via-primary to-accent items-center justify-center p-12">
        <div className="max-w-lg text-white">
          <h2 className="text-4xl font-bold mb-6">Join 100+ Companies</h2>
          <p className="text-xl mb-8 text-white/90">
            Start booking more meetings with AI-powered outreach that actually works.
          </p>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mr-3">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold mb-1">14-day free trial</p>
                <p className="text-sm text-white/80">No credit card required. Cancel anytime.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mr-3">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold mb-1">AI-powered personalization</p>
                <p className="text-sm text-white/80">Every message is researched and customized.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mr-3">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold mb-1">Instant setup</p>
                <p className="text-sm text-white/80">Start sending campaigns in minutes.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
