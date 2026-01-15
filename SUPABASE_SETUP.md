# Configuration Supabase - Guide Complet

## 📋 Étapes de Configuration

### 1. Créer un Projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Cliquez sur "Start your project"
3. Connectez-vous avec GitHub (recommandé)
4. Cliquez sur "New Project"
5. Remplissez :
   - **Nom du projet** : `agentai-prod` (ou votre choix)
   - **Database Password** : Générer un mot de passe fort
   - **Région** : Choisissez la plus proche (ex: Frankfurt pour l'Europe)
6. Cliquez sur "Create new project" (prend 2-3 minutes)

### 2. Récupérer vos Credentials

Une fois le projet créé :

1. Dans le menu latéral, cliquez sur **Settings** (icône engrenage)
2. Allez dans **API**
3. Copiez ces deux valeurs :
   - **Project URL** : `https://xxxxxxxxxxxx.supabase.co`
   - **anon public key** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 3. Configurer les Variables d'Environnement

1. Ouvrez le fichier `.env.local` à la racine du projet
2. Remplacez les valeurs :

```env
VITE_SUPABASE_URL=https://votre-projet-id.supabase.co
VITE_SUPABASE_ANON_KEY=votre_anon_key_tres_longue_ici
VITE_APP_URL=http://localhost:5173
```

### 4. Configurer l'Authentification par Email

Dans Supabase Dashboard :

1. Allez dans **Authentication** → **Providers**
2. Activez **Email** (normalement déjà activé)
3. Configurez les options :

#### Email Templates

Allez dans **Authentication** → **Email Templates**

**Template "Magic Link"** (c'est celui utilisé pour l'OTP) :
```html
<h2>Votre code de vérification</h2>
<p>Utilisez ce code pour vous connecter :</p>
<h1 style="font-size: 48px; font-weight: bold; color: #1E40AF;">{{ .Token }}</h1>
<p>Ce code expire dans 10 minutes.</p>
<p>Si vous n'avez pas demandé ce code, ignorez cet email.</p>
```

#### Paramètres OTP

Dans **Authentication** → **Settings** :

- **OTP Expiry** : 600 secondes (10 minutes)
- **OTP Length** : 6 digits
- **Enable email confirmations** : ✅ Activé

### 5. Configuration des URLs de Redirection

Dans **Authentication** → **URL Configuration** :

**Site URL** :
```
http://localhost:5173
```

**Redirect URLs** (ajoutez ces lignes) :
```
http://localhost:5173/dashboard
http://localhost:5173/verify-code
https://votre-domaine.com/dashboard
https://votre-domaine.com/verify-code
```

### 6. Configuration Email (Production)

Par défaut, Supabase utilise son propre service email (limite: 3-4 emails/heure).

Pour la production, configurez un service SMTP :

#### Option A : Resend (recommandé)

1. Créez un compte sur [resend.com](https://resend.com)
2. Vérifiez votre domaine
3. Dans Supabase : **Project Settings** → **Auth** → **SMTP Settings**
   - **Host** : `smtp.resend.com`
   - **Port** : `465`
   - **Username** : `resend`
   - **Password** : Votre API Key Resend
   - **Sender email** : `noreply@votre-domaine.com`
   - **Sender name** : `AI SDR`

#### Option B : SendGrid

1. Créez un compte sur [sendgrid.com](https://sendgrid.com)
2. Créez une API Key
3. Dans Supabase : **Project Settings** → **Auth** → **SMTP Settings**
   - **Host** : `smtp.sendgrid.net`
   - **Port** : `587`
   - **Username** : `apikey`
   - **Password** : Votre API Key SendGrid
   - **Sender email** : `noreply@votre-domaine.com`

### 7. Configuration des Politiques de Sécurité (RLS)

Par défaut, les tables sont protégées. Pour l'instant, on n'a besoin que de l'auth.

Plus tard, quand vous ajouterez des tables (campaigns, prospects, etc.), vous devrez configurer Row Level Security :

```sql
-- Exemple pour une future table "campaigns"
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own campaigns"
ON campaigns FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create campaigns"
ON campaigns FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

## 🧪 Test de l'Authentification

### Test Local

1. Démarrez le serveur de dev :
```bash
npm run dev
```

2. Ouvrez http://localhost:5173

3. Testez le flow :
   - Allez sur `/signup`
   - Remplissez le formulaire
   - Cliquez "Create Account"
   - Vérifiez votre email
   - Entrez le code à 6 chiffres
   - Vous devriez être redirigé vers `/dashboard`

### Vérifier dans Supabase

1. Allez dans **Authentication** → **Users**
2. Vous devriez voir votre utilisateur créé
3. Cliquez dessus pour voir les détails (metadata, etc.)

## 🔧 Commandes Utiles

### Voir les logs Supabase

Dans le dashboard : **Logs** → **Auth Logs**

### Tester l'API directement

```javascript
// Dans la console du navigateur
const { data, error } = await supabase.auth.signInWithOtp({
  email: 'test@example.com'
})
console.log(data, error)
```

## 🚨 Troubleshooting

### "Invalid API Key"
- Vérifiez que vous avez bien copié la **anon key** (pas la service_role key)
- Redémarrez le serveur dev après avoir modifié `.env.local`

### "Email not sent"
- Vérifiez les Auth Logs dans Supabase
- En dev, utilisez l'email inscrit sur votre compte Supabase
- En prod, configurez SMTP

### "Code invalid or expired"
- Les codes expirent en 10 minutes
- Redemandez un nouveau code

### "User already registered"
- Allez dans Supabase → Authentication → Users
- Supprimez l'utilisateur pour retester

## 📚 Ressources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Magic Link / OTP Guide](https://supabase.com/docs/guides/auth/auth-magic-link)
- [Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)

## 🔒 Sécurité

### En Production

1. **Domaine vérifié** : Utilisez votre propre domaine pour les emails
2. **Rate Limiting** : Supabase a des limites par défaut (bonnes)
3. **CORS** : Configurez les URLs autorisées
4. **Environment Variables** : Ne commitez JAMAIS les clés dans Git
5. **HTTPS** : Utilisez toujours HTTPS en production

### Variables à NE PAS commiter

❌ `.env.local` → Gitignore
✅ `.env.example` → Commit (sans valeurs réelles)

## 🎯 Prochaines Étapes

Une fois l'auth fonctionnelle :

1. Créer les tables dans Supabase :
   - `campaigns`
   - `prospects`
   - `meetings`
   - `ai_sdrs`

2. Configurer les relations et RLS

3. Créer les API pour CRUD operations

4. Intégrer les services IA (OpenAI, etc.)
