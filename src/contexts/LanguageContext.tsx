/**
 * Language Context
 * MBK: Manages language state globally across the application
 */
import { createContext, useContext, useState, ReactNode, useMemo } from 'react';

type Language = 'FR' | 'ENG';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations: Record<Language, Record<string, string>> = {
  FR: {
    // Navigation
    dashboard: 'Tableau de bord',
    campaigns: 'Campagnes',
    prospects: 'Prospects',
    meetings: 'Rendez-vous',
    analytics: 'Analyses',
    aiSdrSettings: 'IA SDR',
    integrations: 'Intégrations',
    settings: 'Paramètres',
    subscription: 'Abonnement',
    
    // Header
    welcome: 'Bienvenue',
    search: 'Rechercher...',
    notifications: 'Notifications',
    myAccount: 'Mon compte',
    profileSettings: 'Paramètres du profil',
    billing: 'Facturation',
    helpCenter: 'Centre d\'aide',
    logout: 'Déconnexion',
    
    // Common
    loading: 'Chargement...',
    home: 'Accueil',
    profile: 'Profil',
    accountManagement: 'Gestion du compte',
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    add: 'Ajouter',

    // Landing Page
    aiPoweredProspecting: 'Prospection alimentée par IA',
    transformYourSales: 'Transformez votre prospection avec LeadFlow',
    aiProspectingDescription: 'Générez des leads qualifiés et réservez des rendez-vous automatiquement avec notre plateforme IA SDR de nouvelle génération.',
    getStarted: 'Commencer gratuitement',
    watchDemo: 'Voir la démo',
    
    // Features
    aiProspectSearch: 'Recherche de prospects par IA',
    aiProspectSearchDesc: 'Analyse automatiquement les sites web, LinkedIn et signaux d\'entreprise',
    humanLevelPersonalization: 'Personnalisation de niveau humain',
    humanLevelPersonalizationDesc: 'Chaque email est rédigé comme par un humain après une recherche approfondie',
    emailVoiceCampaigns: 'Campagnes Email + Voix',
    emailVoiceCampaignsDesc: 'Coordonnez la prospection sur tous les canaux de manière transparente',

    // How it works
    howItWorks: 'Comment ça marche',
    uploadProspectList: 'Téléchargez votre liste de prospects',
    aiResearchProspect: 'L\'IA recherche chaque prospect',
    personalizedOutreach: 'Prospection personnalisée envoyée',
    automatedMeetings: 'Rendez-vous réservés automatiquement',

    // Pricing
    pricing: 'Tarifs',
    discovery: 'Discovery',
    launch: 'Lancement',
    business: 'Business',
    replaceHalfSalesRep: 'Remplace un commercial à mi-temps',
    scale: 'Scale',
    agencyScale: 'Agence - Pour inonder le marché',
    enterprise: 'Entreprise',
    customEnterprise: 'Sur Mesure - Grands Comptes et Call Centers',
    limitedOffer: 'Offre limitée aux 50 premiers',
    bestValue: 'Le meilleur rapport qualité/prix',
    maxPerformance: 'Performance maximale',
    customPrice: 'Prix adapté au volume',
    chooseThis: 'Choisir cette offre',
    startNow: 'Démarrer maintenant',
    scaleUp: 'Passer à l\'échelle',
    contactTeam: 'Contacter l\'équipe',

    // Plan features
    emailsPerMonth: 'Emails IA / mois',
    aiCalls: 'Appels IA',
    qualifiedLeads: 'Leads qualifiés offerts',
    standardVoice: 'Voix Standard (Pas de clonage)',
    voiceCloning: 'Clonage de Voix',
    yourAIVoice: 'Votre voix par l\'IA',
    automatedMeeting: 'Prise de RDV automatique Agenda',
    unlimitedEmails: 'Emails Illimités (Fair use)',
    advancedAI: 'IA Avancée (Gestion barrages secrétaires)',
    dedicatedManager: 'Account Manager dédié',
    unlimitedCalls: 'Volume d\'appels Illimité (+ de 10k/mois)',
    dedicatedInfra: 'Infrastructure Dédiée (Serveurs privés)',
    fullAPI: 'Accès API complet',
    whiteLabel: 'Marque Blanche (Pour revendeurs)',
    enhancedSecurity: 'Sécurité Renforcée (ISO/RGPD Custom)',
    
    // Testimonials
    transformedProspecting: 'LeadFlow a complètement transformé notre prospection. Nous réservons 3x plus de rendez-vous qu\'avant.',

    // Footer
    privacyPolicy: 'Politique de confidentialité',
    termsOfService: 'Conditions d\'utilisation',
    careers: 'Carrières',
    blog: 'Blog',
    contact: 'Contact',
    copyright: '© 2026 LeadFlow. Tous droits réservés.',

    // Auth
    login: 'Connexion',
    signup: 'S\'inscrire',
    email: 'Email',
    password: 'Mot de passe',
    forgotPassword: 'Mot de passe oublié',
    rememberMe: 'Se souvenir de moi',
    dontHaveAccount: 'Pas encore de compte',
    alreadyHaveAccount: 'Vous avez déjà un compte',
  },
  ENG: {
    // Navigation
    dashboard: 'Dashboard',
    campaigns: 'Campaigns',
    prospects: 'Prospects',
    meetings: 'Meetings',
    analytics: 'Analytics',
    aiSdrSettings: 'AI SDR',
    integrations: 'Integrations',
    settings: 'Settings',
    subscription: 'Subscription',
    
    // Header
    welcome: 'Welcome',
    search: 'Search...',
    notifications: 'Notifications',
    myAccount: 'My Account',
    profileSettings: 'Profile Settings',
    billing: 'Billing',
    helpCenter: 'Help Center',
    logout: 'Logout',
    
    // Common
    loading: 'Loading...',
    home: 'Home',
    profile: 'Profile',
    accountManagement: 'Account Management',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',

    // Landing Page
    aiPoweredProspecting: 'AI-Powered Prospecting',
    transformYourSales: 'Transform Your Prospecting with LeadFlow',
    aiProspectingDescription: 'Generate qualified leads and book meetings automatically with our next-generation AI SDR platform.',
    getStarted: 'Get Started Free',
    watchDemo: 'Watch Demo',

    // Features
    aiProspectSearch: 'AI Prospect Search',
    aiProspectSearchDesc: 'Automatically analyzes websites, LinkedIn and company signals',
    humanLevelPersonalization: 'Human-Level Personalization',
    humanLevelPersonalizationDesc: 'Every email is written like a human after in-depth research',
    emailVoiceCampaigns: 'Email + Voice Campaigns',
    emailVoiceCampaignsDesc: 'Coordinate prospecting across all channels seamlessly',

    // How it works
    howItWorks: 'How It Works',
    uploadProspectList: 'Upload your prospect list',
    aiResearchProspect: 'AI researches each prospect',
    personalizedOutreach: 'Personalized outreach sent',
    automatedMeetings: 'Meetings booked automatically',

    // Pricing
    pricing: 'Pricing',
    discovery: 'Discovery',
    launch: 'Launch',
    business: 'Business',
    replaceHalfSalesRep: 'Replaces half a sales rep',
    scale: 'Scale',
    agencyScale: 'Agency - To flood the market',
    enterprise: 'Enterprise',
    customEnterprise: 'Custom - Large Accounts and Call Centers',
    limitedOffer: 'Limited offer to first 50',
    bestValue: 'Best value for money',
    maxPerformance: 'Maximum performance',
    customPrice: 'Price adapted to volume',
    chooseThis: 'Choose This Plan',
    startNow: 'Start Now',
    scaleUp: 'Scale Up',
    contactTeam: 'Contact Team',

    // Plan features
    emailsPerMonth: 'AI Emails / month',
    aiCalls: 'AI Calls',
    qualifiedLeads: 'Qualified Leads included',
    standardVoice: 'Standard Voice (No cloning)',
    voiceCloning: 'Voice Cloning',
    yourAIVoice: 'Your voice via AI',
    automatedMeeting: 'Automated meeting booking Calendar',
    unlimitedEmails: 'Unlimited Emails (Fair use)',
    advancedAI: 'Advanced AI (Secretary barrier management)',
    dedicatedManager: 'Dedicated Account Manager',
    unlimitedCalls: 'Unlimited call volume (10k+/month)',
    dedicatedInfra: 'Dedicated Infrastructure (Private servers)',
    fullAPI: 'Full API Access',
    whiteLabel: 'White Label (For resellers)',
    enhancedSecurity: 'Enhanced Security (Custom ISO/GDPR)',

    // Footer
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    careers: 'Careers',
    blog: 'Blog',
    contact: 'Contact',
    copyright: '© 2026 LeadFlow. All rights reserved.',

    // Auth
    login: 'Login',
    signup: 'Sign Up',
    email: 'Email',
    password: 'Password',
    forgotPassword: 'Forgot Password',
    rememberMe: 'Remember me',
    dontHaveAccount: 'Don\'t have an account',
    alreadyHaveAccount: 'Already have an account',
    
    // Testimonials
    transformedProspecting: 'LeadFlow completely transformed our prospecting. We book 3x more meetings than before.',
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  // Récupère la langue du localStorage ou utilise 'FR' par défaut
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language') as Language | null;
    return saved || 'FR';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = useMemo(() => {
    return (key: string): string => {
      return translations[language][key] || key;
    };
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t,
  }), [language, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
