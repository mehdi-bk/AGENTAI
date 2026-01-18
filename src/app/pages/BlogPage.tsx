// MBK: Blog Page - Page de blog avec articles sur l'IA et la prospection commerciale
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Brain, ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';

// MBK: Blog posts data (in production, this would come from a CMS or database)
const blogPosts = [
  {
    id: 'ai-in-2026',
    title: 'L\'Intelligence Artificielle en 2026 : Révolution de la Prospection Commerciale',
    excerpt: 'Découvrez comment l\'IA transforme la prospection commerciale en 2026 et pourquoi LeadFlow est à l\'avant-garde de cette révolution.',
    author: 'Mehdi Ben Khadra',
    date: '15 Janvier 2026',
    readTime: '8 min de lecture',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
    category: 'Intelligence Artificielle'
  }
];

export default function BlogPage() {
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
            Blog LeadFlow
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez les dernières tendances de l'IA, les avancées technologiques et les meilleures pratiques 
            pour transformer votre prospection commerciale
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link key={post.id} to={`/blog/${post.id}`}>
              <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col">
                <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary opacity-60"></div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                      {post.category}
                    </span>
                  </div>
                </div>
                <CardContent className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold mb-3 text-gray-900 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 flex-1 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{post.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Coming Soon */}
        {blogPosts.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Brain className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-2xl font-bold mb-2 text-gray-900">Bientôt disponible</h3>
              <p className="text-gray-600">
                De nouveaux articles arrivent bientôt sur l'IA et la prospection commerciale.
              </p>
            </CardContent>
          </Card>
        )}
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
