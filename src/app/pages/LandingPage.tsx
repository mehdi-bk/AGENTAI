import { Link } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Search, Sparkles, Mail, Phone, Upload, Brain, Send, CalendarCheck, CheckCircle, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const companyLogos = ['Company A', 'Company B', 'Company C', 'Company D', 'Company E'];
  
  const features = [
    {
      icon: <Search className="w-8 h-8 text-primary" />,
      title: 'AI-Powered Prospect Research',
      description: 'Automatically analyzes company websites, LinkedIn, and signals'
    },
    {
      icon: <Sparkles className="w-8 h-8 text-secondary" />,
      title: 'Human-Level Personalization',
      description: 'Every email reads like a human wrote it after deep research'
    },
    {
      icon: <Mail className="w-8 h-8 text-accent" />,
      title: 'Email + Voice Campaigns',
      description: 'Seamlessly coordinate outreach across all channels'
    }
  ];
  
  const howItWorks = [
    { icon: <Upload className="w-6 h-6" />, title: 'Upload your lead list', step: 1 },
    { icon: <Brain className="w-6 h-6" />, title: 'AI researches each prospect', step: 2 },
    { icon: <Send className="w-6 h-6" />, title: 'Personalized outreach sent', step: 3 },
    { icon: <CalendarCheck className="w-6 h-6" />, title: 'Meetings booked automatically', step: 4 }
  ];
  
  const pricingPlans = [
    {
      name: 'Starter',
      price: '€800',
      period: '/month',
      features: ['Email only', '1 AI SDR', '500 prospects/month', 'Basic analytics', 'Email support']
    },
    {
      name: 'Professional',
      price: '€1,500',
      period: '/month',
      features: ['Email + Voice', '2 AI SDRs', '2,000 prospects/month', 'Advanced analytics', 'Priority support'],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      features: ['Unlimited SDRs', 'White-label option', 'Unlimited prospects', 'Dedicated support', 'Custom integrations']
    }
  ];
  
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'VP of Sales',
      company: 'TechCorp Inc',
      quote: 'This AI SDR has completely transformed our outreach. We\'re booking 3x more meetings than before.'
    },
    {
      name: 'Michael Chen',
      role: 'Founder',
      company: 'StartupXYZ',
      quote: 'The personalization is incredible. Our prospects actually respond thinking it\'s a real person.'
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
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">AI SDR</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-primary transition-colors">How It Works</a>
            <a href="#pricing" className="text-gray-600 hover:text-primary transition-colors">Pricing</a>
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">Start Free Trial</Button>
            </Link>
          </nav>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 md:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Your AI SDR That Actually Researches Prospects
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10">
            Stop sending spam. Start booking meetings with AI that thinks before it speaks.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg px-8">
                Start Free Trial
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Watch Demo
            </Button>
          </div>
          <p className="text-gray-500 mt-6">Trusted by 100+ B2B companies</p>
          
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
              <p className="text-gray-600">Dashboard Preview</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Intelligent Outreach, Powered by AI</h2>
          <p className="text-xl text-gray-600">Everything you need to scale your sales outreach</p>
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
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">From lead to meeting in 4 simple steps</p>
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
          <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-600">Choose the plan that fits your needs</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, i) => (
            <Card key={i} className={`relative ${plan.popular ? 'border-primary border-2 shadow-xl scale-105' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-secondary text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-success mr-2 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/signup">
                  <Button className={`w-full ${plan.popular ? 'bg-gradient-to-r from-primary to-secondary' : ''}`}>
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      {/* Social Proof */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Loved by Sales Teams</h2>
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
              <div className="text-gray-600">Meetings Booked</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-secondary mb-2">87%</div>
              <div className="text-gray-600">Reply Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">4.5x</div>
              <div className="text-gray-600">Average ROI</div>
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
                <span className="font-bold">AI SDR</span>
              </div>
              <p className="text-gray-600 text-sm">Your AI SDR That Actually Researches Prospects</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#features" className="hover:text-primary">Features</a></li>
                <li><a href="#pricing" className="hover:text-primary">Pricing</a></li>
                <li><a href="#" className="hover:text-primary">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-primary">About</a></li>
                <li><a href="#" className="hover:text-primary">Blog</a></li>
                <li><a href="#" className="hover:text-primary">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
            <p>© 2026 AI SDR. All rights reserved.</p>
            <p className="flex items-center mt-4 md:mt-0">
              Built with <Brain className="w-4 h-4 mx-1" /> AI
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
