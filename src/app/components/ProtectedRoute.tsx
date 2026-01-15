import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  
  // En mode dev, permet le bypass
  const isDev = import.meta.env.VITE_DEV_MODE === 'true';
  const devBypass = isDev && localStorage.getItem('dev_bypass_auth') === 'true';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Permet l'accès si user authentifié OU en mode dev bypass
  if (!user && !devBypass) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
