import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Brain, Home, Rocket, Users, Calendar, BarChart3, Bot, Plug, Settings, Bell, ChevronLeft, Menu, Search, LogOut, AlertCircle, CreditCard } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { checkOnboardingStatus } from '@/services/authService';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  
  const isDev = import.meta.env.VITE_DEV_MODE === 'true';
  const devBypass = isDev && localStorage.getItem('dev_bypass_auth') === 'true';
  const devEmail = localStorage.getItem('dev_user_email') || 'dev@example.com';
  
  // Vérifier que l'utilisateur a complété l'onboarding
  useEffect(() => {
    const verifyOnboarding = async () => {
      // Ne vérifier que si pas en mode dev bypass
      if (devBypass) {
        setCheckingOnboarding(false);
        return;
      }

      if (!user) {
        setCheckingOnboarding(false);
        return;
      }

      try {
        console.log('🔍 DashboardLayout: Checking onboarding status');
        const { needsOnboarding } = await checkOnboardingStatus();
        
        if (needsOnboarding) {
          console.log('⚠️ DashboardLayout: User needs onboarding, redirecting...');
          navigate('/onboarding', { replace: true });
        } else {
          console.log('✅ DashboardLayout: Onboarding completed');
          setCheckingOnboarding(false);
        }
      } catch (error) {
        console.error('❌ DashboardLayout: Error checking onboarding', error);
        setCheckingOnboarding(false);
      }
    };

    verifyOnboarding();
  }, [user, devBypass, navigate]);

  // Afficher un loader pendant la vérification
  if (checkingOnboarding) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }
  
  // Récupère le nom de l'utilisateur
  const getUserName = () => {
    if (devBypass) {
      // En mode dev, affiche le nom de l'entreprise
      const company = localStorage.getItem('dev_user_company');
      if (company) return company;
      
      const name = localStorage.getItem('dev_user_name');
      if (name) return name;
      
      const emailName = devEmail.split('@')[0];
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
    
    // Utilisateur authentifié - récupère l'entreprise depuis metadata
    const metadata = user?.user_metadata || {};
    
    if (metadata.company) {
      // Si company contient un pipe (ancien format), extraire juste le nom
      const companyName = metadata.company.split('|')[0].trim();
      return companyName;
    }
    
    // Fallback sur l'email
    if (user?.email) {
      const emailName = user.email.split('@')[0];
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
    
    return 'Utilisateur';
  };
  
  const userName = getUserName();
  
  // Récupère le nom complet de l'utilisateur
  const getUserFullName = () => {
    if (devBypass) {
      return localStorage.getItem('dev_user_name') || 'Dev Mode';
    }
    
    const metadata = user?.user_metadata || {};
    return metadata.full_name || user?.email?.split('@')[0] || 'Utilisateur';
  };
  
  // Récupère les initiales de l'utilisateur
  const getUserInitials = () => {
    if (devBypass) return 'DV';
    
    const metadata = user?.user_metadata || {};
    const fullName = metadata.full_name;
    
    if (fullName) {
      const names = fullName.split(' ');
      if (names.length >= 2) {
        return (names[0][0] + names[1][0]).toUpperCase();
      }
      return fullName.substring(0, 2).toUpperCase();
    }
    
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    
    return 'U';
  };
  
  const userFullName = getUserFullName();
  const userInitials = getUserInitials();
  const userEmail = user?.email || devEmail;
  
  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/login';
  };
  
  const navigation = [
    { name: 'Tableau de bord', href: '/dashboard/home', icon: Home },
    { name: 'Campagnes', href: '/dashboard/campaigns', icon: Rocket },
    { name: 'Prospects', href: '/dashboard/prospects', icon: Users },
    { name: 'Rendez-vous', href: '/dashboard/meetings', icon: Calendar },
    { name: 'Analytique', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Paramètres agents', href: '/dashboard/ai-sdr-settings', icon: Bot },
    { name: 'Intégrations', href: '/dashboard/integrations', icon: Plug },
    { name: 'Paramètres', href: '/dashboard/settings', icon: Settings },
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold">LeadFlow</span>
            </Link>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-gradient-to-r from-primary/10 to-secondary/10 text-primary'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-primary' : 'text-gray-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          {/* User Profile */}
          <div className="p-4 border-t">
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full">
                <div className="flex items-center hover:bg-gray-50 rounded-lg p-2 transition-colors">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-3 flex-1 text-left">
                    <p className="text-sm font-medium">{userFullName}</p>
                    <p className="text-xs text-gray-500">{userEmail}</p>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className={`transition-all duration-200 ${sidebarOpen ? 'lg:ml-64' : ''}`}>
        {/* Top Nav */}
        <header className="bg-white border-b sticky top-0 z-40">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4 flex-1">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-500 hover:text-gray-700 lg:hidden"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              {/* Message de bienvenue */}
              <div className="hidden md:block">
                <h2 className="text-xl font-semibold text-gray-900">
                  Bonjour {userName} !
                </h2>
              </div>
              
              <div className="relative flex-1 max-w-md ml-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-10 bg-gray-50 border-gray-200"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
              </button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-sm">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div>
                      <p className="font-medium">{userFullName}</p>
                      <p className="text-xs text-gray-500">{userEmail}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>
                    <Settings className="w-4 h-4 mr-2" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.open('https://help.aisdr.com', '_blank')}>
                    <Bell className="w-4 h-4 mr-2" />
                    Help Center
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        
        {/* Dev Mode Banner */}
        {devBypass && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-3">
            <Alert className="border-0 bg-transparent p-0">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800 text-sm ml-2">
                <strong>Mode Développement :</strong> Vous êtes connecté en mode bypass (sans authentification réelle)
              </AlertDescription>
            </Alert>
          </div>
        )}
        
        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
