import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Switch } from '@/app/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Separator } from '@/app/components/ui/separator';
import { User, CreditCard, Bell, Code, Building, Loader2, Mail, Calendar, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { billingService } from '@/services/billingService';

export default function SettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [billingLoading, setBillingLoading] = useState(false);
  const plansRef = useRef<HTMLDivElement | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    companySize: '',
    industry: '',
  });

  const planOptions = [
    {
      id: 'discovery',
      name: 'Discovery',
      priceLabel: '150€ / mois',
      priceValue: 150,
      badge: 'Pour démarrer',
      description: 'Idéal pour tester l’IA et lancer vos premières campagnes.',
      features: ['1 500 emails IA / mois', '30 appels IA (test & closing)', '250 leads qualifiés offerts'],
      agents: 1,
      emails: '1 500',
      nextBilling: 'Dans 30 jours',
    },
    {
      id: 'business',
      name: 'Business',
      priceLabel: '499€ / mois',
      priceValue: 499,
      badge: 'Le plus populaire',
      description: 'Remplace un commercial à mi-temps avec voix clonée.',
      features: ['10 000 emails IA / mois', '500 appels IA / mois', 'Clonage de voix inclus'],
      agents: 5,
      emails: '10 000',
      nextBilling: 'Dans 30 jours',
      popular: true,
    },
    {
      id: 'scale',
      name: 'Scale',
      priceLabel: '1 290€ / mois',
      priceValue: 1290,
      badge: 'Croissance',
      description: 'Pour les équipes qui industrialisent la prospection multi-canale.',
      features: ['Emails illimités (fair use)', '2 000 appels IA / mois', 'Account Manager dédié'],
      agents: 10,
      emails: 'Illimités (fair use)',
      nextBilling: 'Dans 30 jours',
    },
    {
      id: 'enterprise',
      name: 'Entreprise',
      priceLabel: 'Sur devis',
      priceValue: null,
      badge: 'Sur mesure',
      description: 'Infrastructure dédiée, API complète, sécurité renforcée.',
      features: ['Appels illimités (10k+/mois)', 'Serveurs privés', 'Accès API complet, marque blanche'],
      agents: 20,
      emails: 'Illimités',
      nextBilling: 'À définir',
    },
  ];

  const defaultPlan = {
    id: 'professional',
    name: 'Plan Professional',
    priceLabel: '€1,500 / mois',
    priceValue: 1500,
    status: 'Actif',
    nextBilling: '14 février 2026',
    agents: 5,
    emails: '10,000',
  };

  const [currentPlan, setCurrentPlan] = useState(() => {
    const saved = localStorage.getItem('currentPlan');
    return saved ? JSON.parse(saved) : defaultPlan;
  });

  useEffect(() => {
    console.log('📋 Loading user data for settings...');
    if (user) {
      const metadata = user.user_metadata || {};
      console.log('User metadata:', metadata);
      setFormData({
        fullName: metadata.full_name || '',
        email: user.email || '',
        company: metadata.company?.split('|')[0] || metadata.company || '',
        companySize: metadata.company_size || '',
        industry: metadata.industry || '',
      });
    }
  }, [user]);

  // Après retour de Stripe (success), mettre à jour l'abonnement local depuis le pending
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get('checkout') === 'success';
    const planId = params.get('plan');
    if (success && planId) {
      const pendingRaw = localStorage.getItem('pendingPlanId');
      if (pendingRaw === planId) {
        const plan = planOptions.find(p => p.id === planId);
        if (plan) {
          savePlan({
            id: plan.id,
            name: plan.name,
            priceLabel: plan.priceLabel,
            priceValue: plan.priceValue,
            status: 'Actif',
            nextBilling: plan.nextBilling,
            agents: plan.agents,
            emails: plan.emails,
          });
          toast.success('Abonnement mis à jour');
        }
      }
      localStorage.removeItem('pendingPlanId');
    }
  }, []);

  const savePlan = (plan: any) => {
    setCurrentPlan(plan);
    localStorage.setItem('currentPlan', JSON.stringify(plan));
    toast.success('Plan mis à jour');
  };

  const handleChoosePlan = async (planId: string) => {
    const plan = planOptions.find(p => p.id === planId);
    if (!plan) return;
    try {
      setBillingLoading(true);
      localStorage.setItem('pendingPlanId', planId);
      const successUrl = `${window.location.origin}/dashboard/settings?checkout=success&plan=${planId}`;
      const cancelUrl = `${window.location.origin}/dashboard/settings?checkout=cancel&plan=${planId}`;
      const url = await billingService.startCheckout(planId, successUrl, cancelUrl);
      window.location.href = url;
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la création de la session Stripe');
      setBillingLoading(false);
      localStorage.removeItem('pendingPlanId');
    }
  };

  const handleCancelPlan = async () => {
    try {
      setBillingLoading(true);
      const returnUrl = `${window.location.origin}/dashboard/settings?portal=return`;
      const url = await billingService.openPortal(returnUrl);
      window.location.href = url;
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l’ouverture du portail Stripe');
      setBillingLoading(false);
    }
  };

  const scrollToPlans = () => {
    plansRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSave = async () => {
    setLoading(true);
    
    try {
      // En mode dev, on skip la vérification de session
      const isDev = import.meta.env.VITE_DEV_MODE === 'true';
      const devBypass = isDev && localStorage.getItem('dev_bypass_auth') === 'true';
      
      if (!devBypass) {
        // Vérifier la session seulement si pas en mode dev bypass
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          console.error('Session error:', sessionError);
          toast.error('Session expirée. Veuillez vous reconnecter.');
          setLoading(false);
          return;
        }
      } else {
        console.log('🔧 Dev mode: skipping session check');
      }

      console.log('📝 Saving user data...', formData);
      
      if (devBypass) {
        // En mode dev, simuler la sauvegarde
        console.log('🔧 Dev mode: simulating save');
        toast.success('Profil mis à jour avec succès ! (Mode dev)');
        setLoading(false);
        return;
      }
      
      // Mettre à jour sans attendre (même solution que OnboardingPage)
      supabase.auth.updateUser({
        data: {
          full_name: formData.fullName,
          company: formData.company,
          company_size: formData.companySize,
          industry: formData.industry,
        }
      }).then(async ({ error }) => {
        if (error) {
          console.error('Error updating user:', error);
          toast.error(error.message || 'Erreur lors de la mise à jour');
        } else {
          console.log('✅ User metadata updated successfully');
          // Forcer le refresh de la session pour mettre à jour AuthContext
          await supabase.auth.refreshSession();
        }
      });

      // Afficher le succès immédiatement
      toast.success('Profil mis à jour avec succès !');
      setLoading(false);
      
    } catch (error: any) {
      console.error('Error in handleSave:', error);
      toast.error(error.message || 'Erreur lors de la mise à jour');
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>
      
      <Tabs defaultValue="billing" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="w-4 h-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="billing">
            <CreditCard className="w-4 h-4 mr-2" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="api">
            <Code className="w-4 h-4 mr-2" />
            API
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <div className="space-y-6">
            {/* Informations de compte */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informations de compte
                </CardTitle>
                <CardDescription>Informations de votre compte LeadFlow</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      Email
                    </Label>
                    <Input 
                      id="email"
                      value={formData.email} 
                      disabled
                      className="mt-1 bg-gray-50" 
                    />
                    <p className="text-xs text-gray-500 mt-1">Utilisé pour la connexion</p>
                  </div>
                  <div>
                    <Label htmlFor="accountCreated" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      Membre depuis
                    </Label>
                    <Input 
                      id="accountCreated"
                      value={user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                      disabled
                      className="mt-1 bg-gray-50" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informations personnelles */}
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>Ces informations sont utilisées pour personnaliser votre expérience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Nom complet</Label>
                  <Input 
                    id="fullName"
                    value={formData.fullName} 
                    onChange={(e) => updateFormData('fullName', e.target.value)}
                    placeholder="Jean Dupont"
                    className="mt-1" 
                  />
                </div>
              </CardContent>
            </Card>

            {/* Informations entreprise */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Informations entreprise
                </CardTitle>
                <CardDescription>Détails de votre entreprise pour la personnalisation des campagnes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="company">Nom de l'entreprise</Label>
                  <Input 
                    id="company"
                    value={formData.company} 
                    onChange={(e) => updateFormData('company', e.target.value)}
                    placeholder="Acme Inc."
                    className="mt-1" 
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companySize">Taille de l'entreprise</Label>
                    <Select 
                      value={formData.companySize} 
                      onValueChange={(value) => updateFormData('companySize', value)}
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
                    <Label htmlFor="industry">Secteur d'activité</Label>
                    <Select 
                      value={formData.industry} 
                      onValueChange={(value) => updateFormData('industry', value)}
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
                </div>

                <div className="pt-4 border-t">
                  <Button 
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-gradient-to-r from-primary to-secondary"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      'Enregistrer les modifications'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="billing">
          <div className="space-y-6">
            {/* Plan actuel */}
            <Card>
              <CardHeader>
                <CardTitle>Votre abonnement</CardTitle>
                <CardDescription>Gérez votre plan et vos paiements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-6 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{currentPlan.name}</h3>
                      <Badge className={`text-white ${currentPlan.status === 'Actif' ? 'bg-success' : 'bg-gray-400'}`}>
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        {currentPlan.status}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-primary">{currentPlan.priceLabel?.split(' ')[0]}</p>
                      <p className="text-sm text-gray-600">{currentPlan.priceLabel?.split(' ').slice(1).join(' ')}</p>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Prochaine facturation</span>
                      <span className="font-medium">{currentPlan.nextBilling}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Agents IA inclus</span>
                      <span className="font-medium">{currentPlan.agents} agents</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Emails mensuels</span>
                      <span className="font-medium">{currentPlan.emails}</span>
                    </div>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={scrollToPlans} disabled={billingLoading}>
                      Modifier le plan
                    </Button>
                    <Button variant="outline" className="flex-1 text-error border-error hover:bg-error/10" onClick={handleCancelPlan} disabled={billingLoading}>
                      Annuler l'abonnement
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Plans disponibles */}
            <Card>
              <CardHeader>
                <CardTitle>Changer de plan</CardTitle>
                <CardDescription>Comparez et sélectionnez l’offre qui correspond à vos besoins</CardDescription>
              </CardHeader>
              <CardContent ref={plansRef}>
                <div className="grid gap-4 lg:grid-cols-2">
                  {planOptions.map((plan) => (
                    <div key={plan.name} className="p-4 border rounded-lg hover:shadow-md transition-all bg-white/60">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-lg font-semibold">{plan.name}</h4>
                            {plan.badge && (
                              <Badge className={plan.popular ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}>
                                {plan.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-primary">{plan.price}</p>
                        </div>
                      </div>
                      <ul className="space-y-1 text-sm text-gray-700 mt-3">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 flex gap-2">
                        <Button variant={plan.popular ? 'default' : 'outline'} className="flex-1" onClick={() => handleChoosePlan(plan.id)} disabled={billingLoading}>
                          Choisir ce plan
                        </Button>
                        <Button variant="ghost" className="flex-1 text-primary">
                          En savoir plus
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Moyens de paiement */}
            <Card>
              <CardHeader>
                <CardTitle>Moyens de paiement</CardTitle>
                <CardDescription>Gérez vos cartes et méthodes de paiement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg bg-gradient-to-r from-gray-900 to-gray-700 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium">Carte principale</span>
                    <Badge className="bg-white/20">Par défaut</Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl font-mono tracking-wider">•••• •••• •••• 4242</p>
                    <div className="flex items-center justify-between text-sm">
                      <span>Expire le 12/2027</span>
                      <span className="font-semibold">VISA</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Ajouter un moyen de paiement
                </Button>
              </CardContent>
            </Card>

            {/* Historique des paiements */}
            <Card>
              <CardHeader>
                <CardTitle>Derniers paiements</CardTitle>
                <CardDescription>Historique de vos transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { date: '15 janvier 2026', montant: '€1,500', status: 'Payé', invoice: 'INV-2026-001' },
                    { date: '15 décembre 2025', montant: '€1,500', status: 'Payé', invoice: 'INV-2025-012' },
                    { date: '15 novembre 2025', montant: '€1,500', status: 'Payé', invoice: 'INV-2025-011' },
                  ].map((payment, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-success" />
                        </div>
                        <div>
                          <p className="font-medium">{payment.invoice}</p>
                          <p className="text-sm text-gray-600">{payment.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{payment.montant}</p>
                        <Button variant="ghost" size="sm" className="text-primary h-auto p-0">
                          Télécharger
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Voir tout l'historique
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Email notifications for new meetings', id: 'email-meetings' },
                { label: 'Campaign completion alerts', id: 'campaign-alerts' },
                { label: 'Weekly performance digest', id: 'weekly-digest' },
                { label: 'Alertes agents IA', id: 'ai-alerts' },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <Label htmlFor={item.id}>{item.label}</Label>
                  <Switch id={item.id} defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API & Developers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>API Key</Label>
                <div className="flex gap-2 mt-1">
                  <Input type="password" defaultValue="sk_live_1234567890abcdef" readOnly />
                  <Button variant="outline">Copy</Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Keep your API key secure and never share it publicly.</p>
              </div>
              <Button variant="outline">Generate New Key</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
