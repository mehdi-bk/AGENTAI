import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Brain, Loader2, Building } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    companySize: '',
    industry: '',
  });

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.company || !formData.companySize || !formData.industry) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    console.log('🚀 Starting onboarding submission...', formData);

    try {
      // Récupérer l'utilisateur actuel
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      console.log('👤 Current user:', user?.email);
      
      if (userError) {
        console.error('❌ Error getting user:', userError);
        throw userError;
      }
      
      if (!user) {
        console.error('❌ No user found');
        toast.error('Session expirée. Veuillez vous reconnecter.');
        setLoading(false);
        navigate('/login');
        return;
      }

      console.log('💾 Updating user metadata...');
      
      // Mettre à jour les métadonnées et ATTENDRE la confirmation
      const { data: updateData, error: updateError } = await supabase.auth.updateUser({
        data: {
          company: formData.company,
          company_size: formData.companySize,
          industry: formData.industry,
          onboarding_completed: true,
          onboarding_completed_at: new Date().toISOString(),
        }
      });

      if (updateError) {
        console.error('❌ Error updating user metadata:', updateError);
        throw updateError;
      }

      console.log('✅ User metadata updated successfully:', updateData?.user?.user_metadata);
      
      // Petite pause pour s'assurer que les données sont bien synchronisées
      await new Promise(resolve => setTimeout(resolve, 500));

      // Rediriger vers le dashboard
      console.log('➡️ Redirecting to dashboard...');
      toast.success('Profil complété avec succès !');
      navigate('/dashboard', { replace: true });
      
    } catch (error: any) {
      console.error('❌ Error in onboarding:', error);
      toast.error(error.message || 'Erreur lors de la mise à jour du profil');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 p-8">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Brain className="w-10 h-10 text-white" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Bienvenue sur AI SDR !</h1>
            <p className="text-gray-600">
              Complétez votre profil pour commencer à automatiser votre démarchage
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="company">Nom de l'entreprise *</Label>
              <div className="relative mt-1">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="company"
                  type="text"
                  placeholder="Acme Inc."
                  value={formData.company}
                  onChange={(e) => updateFormData('company', e.target.value)}
                  required
                  className="pl-10"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <Label htmlFor="companySize">Taille de l'entreprise *</Label>
              <Select 
                value={formData.companySize} 
                onValueChange={(value) => updateFormData('companySize', value)}
                required
              >
                <SelectTrigger id="companySize" className="mt-1">
                  <SelectValue placeholder="Sélectionnez une taille" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10 employés</SelectItem>
                  <SelectItem value="11-50">11-50 employés</SelectItem>
                  <SelectItem value="51-200">51-200 employés</SelectItem>
                  <SelectItem value="201-500">201-500 employés</SelectItem>
                  <SelectItem value="501-1000">501-1000 employés</SelectItem>
                  <SelectItem value="1000+">1000+ employés</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="industry">Secteur d'activité *</Label>
              <Select 
                value={formData.industry} 
                onValueChange={(value) => updateFormData('industry', value)}
                required
              >
                <SelectTrigger id="industry" className="mt-1">
                  <SelectValue placeholder="Sélectionnez un secteur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technologie / SaaS</SelectItem>
                  <SelectItem value="finance">Finance / Banque</SelectItem>
                  <SelectItem value="healthcare">Santé</SelectItem>
                  <SelectItem value="education">Éducation</SelectItem>
                  <SelectItem value="retail">Commerce / Retail</SelectItem>
                  <SelectItem value="manufacturing">Industrie / Manufacturing</SelectItem>
                  <SelectItem value="consulting">Conseil / Services</SelectItem>
                  <SelectItem value="real-estate">Immobilier</SelectItem>
                  <SelectItem value="marketing">Marketing / Publicité</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg py-6"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Finalisation...
                </>
              ) : (
                'Commencer'
              )}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-1">🎯</div>
                <p className="text-sm text-gray-600">Prospection automatisée</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary mb-1">✉️</div>
                <p className="text-sm text-gray-600">Emails personnalisés</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent mb-1">📅</div>
                <p className="text-sm text-gray-600">Meetings qualifiés</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
