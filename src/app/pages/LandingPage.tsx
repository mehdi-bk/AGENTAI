// MBK: Landing page component with marketing sections
import { Link } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Search, Sparkles, Mail, Phone, Upload, Brain, Send, CalendarCheck, CheckCircle, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const companyLogos = ['Entreprise A', 'Entreprise B', 'Entreprise C', 'Entreprise D', 'Entreprise E'];
  
  const features = [
    {
      icon: <Search className="w-8 h-8 text-primary" />,
      title: 'Recherche de prospects par IA',
      description: 'Analyse automatiquement les sites web, LinkedIn et signaux d\'entreprise'
    },
    {
      icon: <Sparkles className="w-8 h-8 text-secondary" />,
      title: 'Personnalisation de niveau humain',
      description: 'Chaque email est rédigé comme par un humain après une recherche approfondie'
    },
    {
      icon: <Mail className="w-8 h-8 text-accent" />,
      title: 'Campagnes Email + Voix',
      description: 'Coordonnez la prospection sur tous les canaux de manière transparente'
    }
  ];
  
  const howItWorks = [
    { icon: <Upload className="w-6 h-6" />, title: 'Téléchargez votre liste de prospects', step: 1 },
    { icon: <Brain className="w-6 h-6" />, title: 'L\'IA recherche chaque prospect', step: 2 },
    { icon: <Send className="w-6 h-6" />, title: 'Prospection personnalisée envoyée', step: 3 },
    { icon: <CalendarCheck className="w-6 h-6" />, title: 'Rendez-vous réservés automatiquement', step: 4 }
  ];
  
  const pricingPlans = [
    {
      name: 'Discovery',
      subtitle: 'Lancement',
      price: '150€',
      period: '/mois',
      badge: 'Offre limitée aux 50 premiers',
      features: ['✉️ 1 500 Emails IA / mois', '📞 30 Appels IA (Test & Closing)', '🔍 250 Leads qualifiés offerts', '🚫 Voix Standard (Pas de clonage)']
    },
    {
      name: 'Business',
      subtitle: 'Remplace un commercial à mi-temps',
      price: '499€',
      period: '/mois',
      badge: 'Le meilleur rapport qualité/prix',
      features: ['✉️ 10 000 Emails IA / mois', '📞 500 Appels IA / mois', '🔍 2 000 Leads qualifiés offerts', '🎙️ Clonage de Voix (Votre voix par l\'IA)', '📅 Prise de RDV automatique Agenda'],
      popular: true
    },
    {
      name: 'Scale',
      subtitle: 'Agence - Pour inonder le marché',
      price: '1 290€',
      period: '/mois',
      badge: 'Performance maximale',
      features: ['✉️ Emails Illimités (Fair use)', '📞 2 000 Appels IA / mois', '🔍 Scraping Illimité', '🧠 IA Avancée (Gestion barrages secrétaires)', '👤 Account Manager dédié']
    },
    {
      name: 'Entreprise',
      subtitle: 'Sur Mesure - Grands Comptes et Call Centers',
      price: 'Sur Devis',
      period: '',
      badge: 'Prix adapté au volume',
      features: ['📞 Volume d\'appels Illimité (+ de 10k/mois)', '🏢 Infrastructure Dédiée (Serveurs privés)', '🔌 Accès API complet', '🏷️ Marque Blanche (Pour revendeurs)', '🔐 Sécurité Renforcée (ISO/RGPD Custom)']
    }
  ];
  
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'VP des Ventes',
      company: 'TechCorp Inc',
      quote: 'LeadFlow a complètement transformé notre prospection. Nous réservons 3x plus de rendez-vous qu\'avant.'
    },
    {
      name: 'Michael Chen',
      role: 'Fondateur',
      company: 'StartupXYZ',
      quote: 'La personnalisation est incroyable. Nos prospects répondent en pensant que c\'est une vraie personne.'
    }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">LeadFlow</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-primary transition-colors">Fonctionnalités</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-primary transition-colors">Comment ça marche</a>
            <a href="#pricing" className="text-gray-600 hover:text-primary transition-colors">Tarifs</a>
            <Link to="/login">
              <Button variant="ghost">Se connecter</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">Essai gratuit</Button>
            </Link>
          </nav>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 md:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Votre Premier Commercial 100% IA : Infatigable et 10x Moins Cher.
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10">
            Arrêtez de payer des charges salariales pour la prospection à froid. LeadFlow AI contacte, qualifie et prend vos rendez-vous par téléphone et email. 24h/24, sans pause café.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg px-8">
                Démarrer l'essai à 150€
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Écouter une démo vocale ▶
            </Button>
          </div>
          <p className="text-gray-500 mt-6">Approuvé par plus de 100 entreprises B2B</p>
          
          {/* Logo Cloud */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-12 opacity-50">
            {companyLogos.map((logo, i) => (
              <div key={i} className="h-8 px-6 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-600 font-medium">{logo}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Hero Image */}
        <div className="mt-16 rounded-2xl overflow-hidden shadow-2xl border">
          <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 p-8 aspect-video flex items-center justify-center">
            <div className="text-center">
              <Brain className="w-24 h-24 text-primary mx-auto mb-4" />
              <p className="text-gray-600">Aperçu du tableau de bord</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Problem Section - Comparison */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Plus besoin d'engager de commerciaux</h2>
            <p className="text-xl text-gray-600">Comparez le coût et l'efficacité</p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Commercial Humain */}
              <Card className="border-2 border-gray-200">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6 text-gray-700">Commercial Humain (SDR)</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="text-red-500 text-xl">❌</span>
                      <div>
                        <p className="font-medium text-gray-700">Coût : ~4 000€ / mois</p>
                        <p className="text-sm text-gray-500">(salaire chargé)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-red-500 text-xl">❌</span>
                      <p className="text-gray-700">60 appels / jour maximum</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-red-500 text-xl">❌</span>
                      <p className="text-gray-700">10% de motivation le vendredi</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-red-500 text-xl">❌</span>
                      <p className="text-gray-700">Gestion des arrêts maladie</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* LeadFlow AI */}
              <Card className="border-2 border-primary shadow-lg relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-gradient-to-r from-primary to-secondary text-white px-3 py-1 rounded-full text-sm font-medium">
                  Recommandé
                </div>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">LeadFlow AI</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="text-green-500 text-xl">✅</span>
                      <div>
                        <p className="font-medium text-gray-700">Coût : À partir de 150€ / mois</p>
                        <p className="text-sm text-primary font-semibold">96% d'économie</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-green-500 text-xl">✅</span>
                      <p className="text-gray-700">Appels illimités / jour</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-green-500 text-xl">✅</span>
                      <p className="text-gray-700">100% de performance 7j/7</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-green-500 text-xl">✅</span>
                      <p className="text-gray-700">Jamais malade</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Prospection intelligente, alimentée par l'IA</h2>
          <p className="text-xl text-gray-600">Tout ce dont vous avez besoin pour développer votre prospection commerciale</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <Card key={i} className="hover:shadow-lg transition-shadow border-2 hover:border-primary/20">
              <CardContent className="p-8">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      {/* How It Works */}
      <section id="how-it-works" className="bg-muted/50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Comment ça marche</h2>
            <p className="text-xl text-gray-600">Du prospect au rendez-vous en 4 étapes simples</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {howItWorks.map((step, i) => (
              <div key={i} className="relative">
                <div className="bg-white rounded-xl p-6 shadow-sm border-2 hover:border-primary/20 transition-all">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold mb-4">
                    {step.step}
                  </div>
                  <div className="mb-3 text-primary">{step.icon}</div>
                  <h4 className="font-semibold">{step.title}</h4>
                </div>
                {i < howItWorks.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-1/2 -right-4 w-8 h-8 text-gray-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Pricing */}
      <section id="pricing" className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">L'Offre</h2>
          <p className="text-xl text-gray-600">Choisissez le plan qui correspond à vos besoins</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {pricingPlans.map((plan, i) => (
            <Card key={i} className={`relative ${plan.popular ? 'border-primary border-2 shadow-xl md:scale-105' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-secondary text-white px-4 py-1 rounded-full text-sm font-medium">
                  🔥 POPULAIRE
                </div>
              )}
              <CardContent className="p-8">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{plan.subtitle}</p>
                  {plan.badge && (
                    <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                      {plan.badge}
                    </span>
                  )}
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/signup">
                  <Button className={`w-full ${plan.popular ? 'bg-gradient-to-r from-primary to-secondary' : ''}`}>
                    {plan.name === 'Entreprise' ? 'Contacter l\'équipe' : plan.name === 'Discovery' ? 'Choisir cette offre' : plan.name === 'Business' ? 'Démarrer maintenant' : 'Passer à l\'échelle'}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      {/* Audio Demo Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Vous n'y croyez pas ? Écoutez LeadFlow travailler.</h2>
          <p className="text-xl text-gray-600">Découvrez la qualité de nos conversations IA</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold mr-4">
                  🎧
                </div>
                <div>
                  <h3 className="text-xl font-bold">Exemple 1 : Prise de RDV Agence Immo</h3>
                  <p className="text-sm text-gray-600">L'IA gère l'objection "Je n'ai pas le temps"</p>
                </div>
              </div>
              <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center h-20">
                <Button variant="outline" className="gap-2">
                  ▶ Écouter l'extrait (1:30)
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-secondary to-accent flex items-center justify-center text-white font-bold mr-4">
                  🎧
                </div>
                <div>
                  <h3 className="text-xl font-bold">Exemple 2 : Qualification B2B</h3>
                  <p className="text-sm text-gray-600">L'IA vérifie le budget du client</p>
                </div>
              </div>
              <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center h-20">
                <Button variant="outline" className="gap-2">
                  ▶ Écouter l'extrait (2:15)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Questions Fréquentes</h2>
            <p className="text-xl text-gray-600">Tout ce que vous devez savoir sur LeadFlow</p>
          </div>
          <div className="max-w-3xl mx-auto space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3">Est-ce légal en France ?</h3>
                <p className="text-gray-700">Oui, en B2B (professionnel à professionnel), le démarchage est autorisé. LeadFlow AI respecte les listes d'opposition et les horaires légaux.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3">La voix fait-elle "Robot" ?</h3>
                <p className="text-gray-700">Non. Avec notre offre Business, nous utilisons les technologies de synthèse vocale les plus avancées (latence &lt; 800ms) pour une conversation fluide.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3">Puis-je utiliser ma propre voix ?</h3>
                <p className="text-gray-700">Absolument. Avec l'offre Business, l'IA clone votre timbre de voix pour appeler vos prospects à votre place.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Social Proof */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Équipes commerciales conquises</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, i) => (
              <Card key={i}>
                <CardContent className="p-8">
                  <p className="text-lg text-gray-700 mb-6">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary mr-4"></div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}, {testimonial.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Metrics */}
          <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">2,000+</div>
              <div className="text-gray-600">Rendez-vous réservés</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-secondary mb-2">87%</div>
              <div className="text-gray-600">Taux de réponse</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">4.5x</div>
              <div className="text-gray-600">ROI moyen</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t bg-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold">LeadFlow</span>
              </div>
              <p className="text-gray-600 text-sm">Vos agents IA qui recherchent vraiment les prospects</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#features" className="hover:text-primary">Fonctionnalités</a></li>
                <li><a href="#pricing" className="hover:text-primary">Tarifs</a></li>
                <li><a href="#" className="hover:text-primary">Intégrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Entreprise</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-primary">À propos</a></li>
                <li><a href="#" className="hover:text-primary">Blog</a></li>
                <li><a href="#" className="hover:text-primary">Carrières</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-primary">Politique de confidentialité</a></li>
                <li><a href="#" className="hover:text-primary">Conditions d'utilisation</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
              <p>© 2026 LeadFlow. Tous droits réservés.</p>
              <p className="text-gray-500">Fondateurs : Mehdi Ben Khadra et Roman Gradante</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
