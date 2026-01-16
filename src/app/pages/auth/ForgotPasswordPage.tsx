import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Brain, ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-muted/30 to-white">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border p-8">
          <Link to="/" className="flex items-center space-x-2 mb-8">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">AI SDR</span>
          </Link>
          
          {!submitted ? (
            <>
              <h1 className="text-2xl font-bold mb-2">Mot de passe oublié ?</h1>
              <p className="text-gray-600 mb-8">No worries, we'll send you reset instructions.</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                
                <Button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                  Send Reset Link
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-success" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Check your email</h1>
              <p className="text-gray-600 mb-8">
                We sent a password reset link to<br />
                <span className="font-medium text-gray-900">{email}</span>
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Didn't receive the email? Check your spam folder or{' '}
                <button onClick={() => setSubmitted(false)} className="text-primary hover:underline">
                  try another email address
                </button>
              </p>
            </div>
          )}
          
          <Link to="/login" className="flex items-center justify-center text-sm text-gray-600 hover:text-primary mt-8 group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
}
