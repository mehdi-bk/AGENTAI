import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { Brain, RefreshCw, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { signOut } from '@/services/authService';
import { toast } from 'sonner';

interface SessionInfo {
  user: any;
  session: any;
  metadata: any;
}

export default function SessionDebugPage() {
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSessionInfo = async () => {
    setLoading(true);
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      setSessionInfo({
        user: user,
        session: session,
        metadata: user?.user_metadata || {},
      });
    } catch (error) {
      console.error('Error fetching session:', error);
      toast.error('Erreur lors de la récupération de la session');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessionInfo();
  }, []);

  const handleClearSession = async () => {
    try {
      await signOut();
      toast.success('Session nettoyée avec succès');
      // Nettoyer le localStorage
      localStorage.clear();
      // Recharger les infos
      await fetchSessionInfo();
    } catch (error) {
      toast.error('Erreur lors du nettoyage de la session');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Session Debug</h1>
                <p className="text-sm text-gray-600">Informations de session et utilisateur</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={fetchSessionInfo} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualiser
              </Button>
              <Button onClick={handleClearSession} variant="destructive" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Nettoyer session
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* User Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">👤 Utilisateur</h2>
              {sessionInfo?.user ? (
                <div className="space-y-2 font-mono text-sm">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-gray-600">Email:</div>
                    <div className="col-span-2 font-semibold">{sessionInfo.user.email}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-gray-600">ID:</div>
                    <div className="col-span-2 text-xs">{sessionInfo.user.id}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-gray-600">Provider:</div>
                    <div className="col-span-2">{sessionInfo.user.app_metadata?.provider || 'N/A'}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-gray-600">Créé le:</div>
                    <div className="col-span-2">{new Date(sessionInfo.user.created_at).toLocaleString('fr-FR')}</div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic">Aucun utilisateur connecté</p>
              )}
            </div>

            {/* Metadata */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">📋 Métadonnées utilisateur</h2>
              {sessionInfo?.metadata && Object.keys(sessionInfo.metadata).length > 0 ? (
                <div className="space-y-2 font-mono text-sm">
                  {Object.entries(sessionInfo.metadata).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-3 gap-2">
                      <div className="text-gray-600">{key}:</div>
                      <div className="col-span-2">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">Aucune métadonnée</p>
              )}
            </div>

            {/* Session Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">🔑 Session</h2>
              {sessionInfo?.session ? (
                <div className="space-y-2 font-mono text-sm">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-gray-600">Access Token:</div>
                    <div className="col-span-2 text-xs truncate">{sessionInfo.session.access_token.substring(0, 50)}...</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-gray-600">Expire à:</div>
                    <div className="col-span-2">
                      {sessionInfo.session.expires_at 
                        ? new Date(sessionInfo.session.expires_at * 1000).toLocaleString('fr-FR')
                        : 'N/A'}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic">Aucune session active</p>
              )}
            </div>

            {/* Raw JSON */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">📄 JSON Complet</h2>
              <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-xs">
                {JSON.stringify(sessionInfo, null, 2)}
              </pre>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">🔧 Actions</h2>
              <div className="space-y-3">
                <Link to="/login">
                  <Button variant="outline" className="w-full">
                    Aller à la page de connexion
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="outline" className="w-full">
                    Aller au dashboard
                  </Button>
                </Link>
                <Button onClick={handleClearSession} variant="destructive" className="w-full">
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnecter et nettoyer complètement
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
