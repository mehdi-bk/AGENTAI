# Configuration Google OAuth avec Supabase

## 🎯 Objectif
Permettre aux utilisateurs de se connecter avec leur compte Google.

---

## 📋 Étape 1 : Créer un Projet Google Cloud

### 1.1 Accéder à Google Cloud Console

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Connectez-vous avec votre compte Google
3. Cliquez sur le sélecteur de projet en haut
4. Cliquez sur **"Nouveau projet"**

### 1.2 Créer le projet

- **Nom du projet** : `AI SDR` (ou votre choix)
- **Organisation** : Laissez vide si compte personnel
- Cliquez sur **"Créer"**

---

## 📋 Étape 2 : Configurer l'écran de consentement OAuth

### 2.1 Accéder aux paramètres OAuth

1. Dans le menu latéral, allez dans **"API et services"** → **"Écran de consentement OAuth"**
2. Sélectionnez **"Externe"** (pour autoriser tous les utilisateurs avec un compte Google)
3. Cliquez sur **"Créer"**

### 2.2 Remplir les informations

**Configuration de l'application :**

- **Nom de l'application** : `AI SDR`
- **E-mail d'assistance utilisateur** : Votre email
- **Logo de l'application** : (Optionnel)

**Informations de contact du développeur :**
- **Adresses e-mail** : Votre email

Cliquez sur **"Enregistrer et continuer"**

### 2.3 Portées (Scopes)

- Laissez vide pour l'instant (les scopes par défaut suffisent)
- Cliquez sur **"Enregistrer et continuer"**

### 2.4 Utilisateurs de test (si en développement)

- Ajoutez vos emails de test
- Cliquez sur **"Enregistrer et continuer"**

### 2.5 Résumé

- Vérifiez les informations
- Cliquez sur **"Retour au tableau de bord"**

---

## 📋 Étape 3 : Créer les Identifiants OAuth

### 3.1 Créer un ID client OAuth

1. Dans **"API et services"** → **"Identifiants"**
2. Cliquez sur **"+ Créer des identifiants"** → **"ID client OAuth"**

### 3.2 Configurer le client

**Type d'application :** 
- Sélectionnez **"Application Web"**

**Nom :**
- `AI SDR Web Client`

**Origines JavaScript autorisées :**
```
http://localhost:5173
http://localhost:5174
https://votre-domaine.com
```

**URI de redirection autorisés :**

⚠️ **IMPORTANT** : Vous devez d'abord récupérer l'URL de callback de Supabase.

1. Allez dans votre [Dashboard Supabase](https://supabase.com/dashboard)
2. Sélectionnez votre projet
3. Allez dans **Authentication** → **Providers** → **Google**
4. Copiez l'URL **"Callback URL (for OAuth)"**
   - Elle ressemble à : `https://votre-projet-id.supabase.co/auth/v1/callback`

5. Collez cette URL dans **"URI de redirection autorisés"**

**Ajoutez aussi ces URLs de redirection locales :**
```
http://localhost:5173/dashboard
http://localhost:5174/dashboard
```

Cliquez sur **"Créer"**

### 3.3 Récupérer les Credentials

Une popup s'affiche avec :
- **ID client** : `123456789-abcdefgh.apps.googleusercontent.com`
- **Code secret du client** : `GOCSPX-xxxxxxxxxxxx`

⚠️ **Gardez ces informations ouvertes**, vous en aurez besoin pour Supabase !

---

## 📋 Étape 4 : Configurer Supabase

### 4.1 Activer Google Provider

1. Dans votre [Dashboard Supabase](https://supabase.com/dashboard)
2. Sélectionnez votre projet
3. Allez dans **Authentication** → **Providers**
4. Trouvez **Google** dans la liste et activez-le

### 4.2 Entrer les Credentials

Dans la configuration Google :

- **Client ID (for OAuth)** : Collez l'ID client de Google Cloud
- **Client Secret (for OAuth)** : Collez le code secret de Google Cloud
- **Authorized Client IDs** : (Laissez vide pour l'instant)

Cliquez sur **"Save"**

---

## 📋 Étape 5 : Tester l'authentification

### 5.1 Lancer votre app

```bash
npm run dev
```

### 5.2 Tester la connexion

1. Allez sur http://localhost:5174/login
2. Cliquez sur **"Continue with Google"**
3. Vous serez redirigé vers Google
4. Choisissez votre compte Google
5. Autorisez l'application
6. Vous serez redirigé vers `/dashboard`

### 5.3 Tester l'inscription

1. Allez sur http://localhost:5174/signup
2. Cliquez sur **"Sign up with Google"**
3. Même processus que la connexion
4. Un nouveau compte sera créé automatiquement

---

## 🔧 Vérifier les utilisateurs

Dans Supabase Dashboard :
1. Allez dans **Authentication** → **Users**
2. Vous devriez voir votre utilisateur avec :
   - Email de votre compte Google
   - Provider : `google`
   - Photo de profil (si disponible)

---

## 🚨 Troubleshooting

### "Error: redirect_uri_mismatch"

**Problème** : L'URI de redirection n'est pas autorisé.

**Solution** :
1. Retournez dans Google Cloud Console
2. Allez dans **Identifiants** → Cliquez sur votre ID client OAuth
3. Vérifiez que l'URL de callback Supabase est bien dans **"URI de redirection autorisés"**
4. Format exact : `https://votre-projet-id.supabase.co/auth/v1/callback`

### "Error: invalid_client"

**Problème** : Client ID ou Secret incorrect.

**Solution** :
1. Vérifiez que vous avez bien copié l'ID client et le secret
2. Pas d'espaces avant/après
3. Resauvegardez dans Supabase

### "Access blocked: This app's request is invalid"

**Problème** : L'écran de consentement n'est pas publié.

**Solution** :
1. Dans Google Cloud Console → **Écran de consentement OAuth**
2. Si le statut est "En test", ajoutez votre email dans **"Utilisateurs de test"**
3. Ou publiez l'application (pour la production)

### L'utilisateur est redirigé mais pas connecté

**Problème** : Le callback ne fonctionne pas correctement.

**Solution** :
1. Vérifiez que `VITE_APP_URL` dans `.env.local` correspond à votre URL locale
2. Videz le cache du navigateur et les cookies
3. Réessayez

---

## 🎯 En Production

### 1. Mettre à jour les URLs autorisées

Dans Google Cloud Console :

**Origines JavaScript autorisées :**
```
https://votre-domaine.com
https://www.votre-domaine.com
```

**URI de redirection autorisés :**
```
https://votre-projet-id.supabase.co/auth/v1/callback
https://votre-domaine.com/dashboard
```

### 2. Publier l'écran de consentement

1. Dans **Écran de consentement OAuth**
2. Cliquez sur **"Publier l'application"**
3. Suivez le processus de vérification si nécessaire

### 3. Mettre à jour .env de production

```env
VITE_APP_URL=https://votre-domaine.com
```

---

## 📚 Ressources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Auth with Google](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)

---

## ✅ Checklist Finale

Avant de considérer la configuration terminée :

- [ ] Projet Google Cloud créé
- [ ] Écran de consentement configuré
- [ ] ID client OAuth créé
- [ ] URI de redirection Supabase ajouté dans Google Cloud
- [ ] Google Provider activé dans Supabase
- [ ] Client ID et Secret ajoutés dans Supabase
- [ ] Test de connexion réussi
- [ ] Test d'inscription réussi
- [ ] Utilisateur visible dans Supabase Dashboard

🎉 **Votre authentification Google est maintenant fonctionnelle !**
