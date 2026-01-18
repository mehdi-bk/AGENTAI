  # AI SDR - Agent IA de Démarchage Commercial

  Plateforme SaaS B2B pour automatiser le démarchage commercial avec des agents IA intelligents.

  ## 📖 Documentation

  **Essential guides for setup and development:**

  - **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Complete setup guide for new computers
    - Database setup (PostgreSQL)
    - Backend & Frontend configuration
    - Environment variables
    - Admin panel access
    - Database administration
    - Troubleshooting

  - **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Quick command reference
    - Starting servers
    - Database commands
    - Creating admin users
    - Common troubleshooting

  - **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Supabase configuration (for client authentication)
  - **[OAUTH_SETUP.md](./OAUTH_SETUP.md)** - OAuth setup (Google & Azure/Outlook authentication)

  ## 🚀 Quick Start

  ### 1. Installation

  ```bash
  npm install
  ```

  ### 2. Configuration Supabase

  Créez un fichier `.env.local` à la racine du projet :

  ```env
  VITE_SUPABASE_URL=your-project-url.supabase.co
  VITE_SUPABASE_ANON_KEY=your-anon-key-here
  VITE_APP_URL=http://localhost:5173
  ```

  **📖 Guide complet :** See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed configuration.

  ### 3. Lancer le projet

  ```bash
  npm run dev
  ```

  Ouvrez [http://localhost:5173](http://localhost:5173)

  ## ✨ Fonctionnalités

  ### Authentification
  - ✅ Connexion par code de vérification email (OTP)
  - ✅ Inscription avec métadonnées (nom, entreprise, industrie)
  - ✅ Sessions persistantes avec JWT
  - ✅ Routes protégées

  ### Dashboard
  - 📊 Vue d'ensemble des campagnes
  - 🤖 Gestion des AI SDRs
  - 👥 Suivi des prospects
  - 📅 Meetings bookés
  - 📈 Analytics et performances

  ## 🏗️ Architecture

  ### Frontend
  - **React 18** + **TypeScript**
  - **Vite** (build tool)
  - **Tailwind CSS 4** (styling)
  - **shadcn/ui** (composants)
  - **React Router v7** (navigation)
  - **Recharts** (graphiques)

  ### Backend
  - **Supabase** (Auth + Database + API)
  - PostgreSQL avec Row Level Security
  - Real-time subscriptions

  ## 📁 Structure du Projet

  ```
  AGENTAI/
  ├── src/
  │   ├── app/
  │   │   ├── components/      # Composants UI
  │   │   │   ├── ui/          # shadcn/ui components
  │   │   │   ├── DashboardLayout.tsx
  │   │   │   └── ProtectedRoute.tsx
  │   │   └── pages/           # Pages de l'application
  │   │       ├── auth/        # Login, Signup, VerifyCode
  │   │       ├── dashboard/   # Pages du dashboard
  │   │       └── LandingPage.tsx
  │   ├── contexts/            # React Contexts
  │   │   └── AuthContext.tsx
  │   ├── services/            # Services API
  │   │   └── authService.ts
  │   ├── lib/                 # Configurations
  │   │   └── supabase.ts
  │   └── styles/              # CSS global
  ├── .env.example             # Template variables d'environnement
  └── SUPABASE_SETUP.md        # Guide de configuration
  ```

  ## 🔑 Variables d'Environnement

  | Variable | Description | Exemple |
  |----------|-------------|---------|
  | `VITE_SUPABASE_URL` | URL du projet Supabase | `https://xxx.supabase.co` |
  | `VITE_SUPABASE_ANON_KEY` | Clé publique Supabase | `eyJhbGc...` |
  | `VITE_APP_URL` | URL de votre app | `http://localhost:5173` |

  ## 🎨 Stack Technique

  ### UI/UX
  - Tailwind CSS 4 avec animations
  - Composants Radix UI (Accessible)
  - Motion pour animations fluides
  - Design system cohérent

  ### Authentification
  - Supabase Auth avec OTP
  - JWT tokens avec auto-refresh
  - Sessions persistantes
  - Protection des routes

  ## 📚 Scripts Disponibles

  ```bash
  npm run dev      # Démarre le serveur de développement
  npm run build    # Build pour la production
  npm run preview  # Prévisualise le build de production
  ```

  ## 🔒 Sécurité

  - Authentification par code OTP (6 chiffres)
  - Sessions JWT avec expiration
  - Row Level Security (RLS) sur la base de données
  - Variables d'environnement séparées
  - HTTPS requis en production

  ## 🚧 Roadmap

  ### Phase 1 - MVP ✅
  - [x] Authentification par email + OTP
  - [x] Interface dashboard
  - [x] Pages de gestion (Campaigns, Prospects, AI SDRs)

  ### Phase 2 - Backend Integration 🚧
  - [ ] Base de données (tables Supabase)
  - [ ] API CRUD pour campaigns/prospects
  - [ ] Intégration OpenAI pour génération d'emails
  - [ ] Service d'envoi d'emails (Resend/SendGrid)

  ### Phase 3 - Features Avancées 📋
  - [ ] Scraping LinkedIn/Apollo.io
  - [ ] Enrichissement de données (Clearbit/Hunter.io)
  - [ ] Calendar booking (Calendly API)
  - [ ] Analytics avancées
  - [ ] A/B testing d'emails

  ### Phase 4 - Scale 🚀
  - [ ] Voice AI (Vapi.ai/ElevenLabs)
  - [ ] Modèle IA fine-tuné
  - [ ] Marketplace de templates
  - [ ] White-label pour agences

  ## 🤝 Contributing

  1. Fork le projet
  2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
  3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
  4. Push vers la branche (`git push origin feature/AmazingFeature`)
  5. Ouvrez une Pull Request

  ## 📄 License

  Ce projet est sous licence MIT.

  ## 💬 Support

  For questions or issues:
  - Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) for setup help
  - Check [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for quick commands
  - See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for Supabase configuration

  ---

  Fait avec ❤️ pour automatiser le démarchage commercial
