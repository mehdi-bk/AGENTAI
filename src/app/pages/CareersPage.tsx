// MBK: Careers Page - Page des carrières avec profils des fondateurs
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Brain, ArrowLeft, Linkedin, Mail } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';

export default function CareersPage() {
  // MBK: Scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">LeadFlow</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Carrières
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Rejoignez l'équipe qui révolutionne la prospection commerciale avec l'intelligence artificielle
          </p>
        </div>

        {/* Founders Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Nos Fondateurs</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mehdi Ben Khadra Profile */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
                    <span className="text-4xl font-bold text-white">MBK</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">Mehdi Ben Khadra</h3>
                  <p className="text-primary font-semibold mb-4">Fondateur & CEO</p>
                </div>

                <div className="space-y-4 mb-6">
                  <p className="text-gray-700 leading-relaxed">
                    Fondateur et CEO de LeadFlow, je suis étudiant en Bachelor Cybersécurité à Epitech. 
                    Passionné par l'intersection entre la cybersécurité et l'intelligence artificielle, 
                    je me concentre sur le développement de solutions innovantes qui protègent et automatisent 
                    les écosystèmes numériques à grande échelle.
                  </p>
                  
                  <p className="text-gray-700 leading-relaxed">
                    Mon approche combine expertise technique et vision stratégique pour transformer la prospection 
                    commerciale grâce à l'IA, tout en garantissant la sécurité et la conformité des données.
                  </p>
                </div>

                <div className="flex justify-center gap-4">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => window.open('https://www.linkedin.com/in/mehdibk/', '_blank')}
                  >
                    <Linkedin className="w-5 h-5" />
                    LinkedIn
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => window.open('mailto:mehdi@leadflow.ai', '_blank')}
                  >
                    <Mail className="w-5 h-5" />
                    Email
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Roman Gradante Profile */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center mb-4">
                    <span className="text-4xl font-bold text-white">RG</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">Roman Gradante</h3>
                  <p className="text-primary font-semibold mb-4">Fondateur & COO</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <p className="text-gray-500 italic">
                      Profil à venir...
                    </p>
                  </div>
                </div>

                <div className="flex justify-center gap-4">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => window.open('https://www.linkedin.com/in/roman-gradante', '_blank')}
                  >
                    <Linkedin className="w-5 h-5" />
                    LinkedIn
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => window.open('mailto:roman@leadflow.ai', '_blank')}
                  >
                    <Mail className="w-5 h-5" />
                    Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Join Us Section */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-primary/20">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Rejoignez Notre Équipe</h2>
            <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
              Nous recherchons des talents passionnés pour nous aider à construire l'avenir de la prospection commerciale 
              automatisée. Si vous partagez notre vision, n'hésitez pas à nous contacter.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/careers/apply">
                <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                  <Mail className="w-5 h-5 mr-2" />
                  Postuler maintenant
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => window.open('mailto:info@leadflow.ai', '_blank')}
              >
                En savoir plus
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-8 border-t flex items-center justify-center">
        <Link to="/">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Button>
        </Link>
      </div>
    </div>
  );
}
