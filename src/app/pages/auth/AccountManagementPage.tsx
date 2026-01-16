import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card } from '@/app/components/ui/card';
import { Brain, Trash2, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export default function AccountManagementPage() {
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [checkingUser, setCheckingUser] = useState(false);

  const checkCurrentUser = async () => {
    setCheckingUser(true);
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      setCurrentUser(user);
      toast.success(`Utilisateur actuel: ${user?.email || 'Aucun'}`);
    } catch (error: any) {
      toast.error('Erreur: ' + error.message);
      setCurrentUser(null);
    } finally {
      setCheckingUser(false);
    }
  };

  const deleteCurrentAccount = async () => {
    if (!currentUser) {
      toast.error('Aucun utilisateur connecté');
      return;
    }

    const confirmed = window.confirm(
      `⚠️ ATTENTION ⚠️\n\nVoulez-vous vraiment supprimer le compte:\n${currentUser.email}\n\nCette action est IRRÉVERSIBLE !`
    );

    if (!confirmed) return;

    setLoading(true);
    try {
      // Note: La suppression du côté client ne fonctionne que si activée dans Supabase
      // Sinon, il faut aller dans le dashboard Supabase
      
      console.log('🗑️ Attempting to delete user:', currentUser.email);
      
      // Déconnexion complète
      await supabase.auth.signOut({ scope: 'global' });
      
      // Nettoyer tout
      localStorage.clear();
      sessionStorage.clear();
      
      toast.success('Compte supprimé (session nettoyée). Allez dans Supabase Dashboard pour supprimer définitivement.', {
        duration: 10000
      });
      
      console.log('ℹ️ Pour supprimer définitivement:');
      console.log('1. Allez sur https://supabase.com/dashboard');
      console.log('2. Authentication > Users');
      console.log(`3. Trouvez ${currentUser.email}`);
      console.log('4. Cliquez sur les 3 points > Delete user');
      
      setCurrentUser(null);
      
      // Rediriger vers login après 2 secondes
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      
    } catch (error: any) {
      console.error('❌ Error deleting account:', error);
      toast.error('Erreur: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const signOutCompletely = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut({ scope: 'global' });
      localStorage.clear();
      sessionStorage.clear();
      toast.success('Déconnexion complète réussie');
      setCurrentUser(null);
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
    } catch (error: any) {
      toast.error('Erreur: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Gestion de compte</h1>
                <p className="text-sm text-gray-600">Outils de débogage et gestion</p>
              </div>
            </div>
            <Link to="/login">
              <Button variant="outline" size="sm">
                Retour au login
              </Button>
            </Link>
          </div>
        </div>

        {/* Warning */}
        <Card className="p-6 mb-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Attention</h3>
              <p className="text-sm text-yellow-800">
                Cette page permet de gérer et supprimer des comptes. Utilisez avec précaution.
                La suppression d'un compte est irréversible.
              </p>
            </div>
          </div>
        </Card>

        {/* Current User */}
        <Card className="p-6 mb-6">
          <h3 className="font-semibold mb-4">Utilisateur actuel</h3>
          <Button 
            onClick={checkCurrentUser} 
            disabled={checkingUser}
            variant="outline"
            className="w-full mb-4"
          >
            {checkingUser ? 'Vérification...' : 'Vérifier l\'utilisateur connecté'}
          </Button>

          {currentUser && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-gray-600">Email:</div>
                <div className="col-span-2 font-semibold">{currentUser.email}</div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-gray-600">ID:</div>
                <div className="col-span-2 text-xs font-mono">{currentUser.id}</div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-gray-600">Provider:</div>
                <div className="col-span-2">{currentUser.app_metadata?.provider || 'N/A'}</div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-gray-600">Créé le:</div>
                <div className="col-span-2">{new Date(currentUser.created_at).toLocaleString('fr-FR')}</div>
              </div>
            </div>
          )}
        </Card>

        {/* Actions */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Actions</h3>
          <div className="space-y-3">
            <Button 
              onClick={signOutCompletely} 
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              Déconnexion complète
            </Button>

            <Button 
              onClick={deleteCurrentAccount} 
              disabled={loading || !currentUser}
              variant="destructive"
              className="w-full"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer le compte actuel
            </Button>
          </div>
        </Card>

        {/* Instructions */}
        <Card className="p-6 mt-6">
          <h3 className="font-semibold mb-4">Instructions pour supprimer définitivement un compte</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            <li>Allez sur <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-primary underline">Supabase Dashboard</a></li>
            <li>Sélectionnez votre projet</li>
            <li>Allez dans "Authentication" &gt; "Users"</li>
            <li>Trouvez l'utilisateur à supprimer (vanessianroman@gmail.com par exemple)</li>
            <li>Cliquez sur les 3 points à droite de la ligne</li>
            <li>Cliquez sur "Delete user"</li>
            <li>Confirmez la suppression</li>
          </ol>
        </Card>
      </div>
    </div>
  );
}
