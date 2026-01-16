# 🔧 Guide de test - Correction OAuth Google

## ⚠️ Problème à tester
Connexion avec `rwdrawingart@gmail.com` mais connecté sur `vanessianroman@gmail.com`

## ✅ Étapes de test

### 1️⃣ Nettoyer complètement la session actuelle

#### Option A : Via la page de debug (RECOMMANDÉ)
1. Ouvrir : http://localhost:5183/debug-session
2. Cliquer sur le bouton rouge "Déconnecter et nettoyer complètement"
3. Vérifier que "Aucun utilisateur connecté" s'affiche

#### Option B : Via la console du navigateur
1. Ouvrir la console (F12)
2. Exécuter :
```javascript
localStorage.clear()
sessionStorage.clear()
location.href = '/login'
```

### 2️⃣ Se déconnecter de Google

1. Ouvrir un nouvel onglet
2. Aller sur : https://accounts.google.com
3. Cliquer sur votre photo de profil en haut à droite
4. Cliquer sur "Se déconnecter"
5. Si plusieurs comptes sont connectés, répéter pour tous

### 3️⃣ Tester la connexion Google

1. Retourner sur : http://localhost:5183/login
2. Cliquer sur le bouton "Continue with Google"
3. **IMPORTANT** : Google devrait maintenant afficher :
   - Une liste de comptes disponibles
   - OU demander de se connecter
4. Choisir/se connecter avec : `rwdrawingart@gmail.com`

### 4️⃣ Vérifier dans les logs

Ouvrir la console du navigateur (F12) et chercher :

```
✅ Logs attendus :
🔐 Starting Google OAuth sign in...
🧹 Cleaning existing session before OAuth...
✅ Google OAuth initiated successfully
🔄 Auth callback started...
👤 User authenticated: rwdrawingart@gmail.com
🆔 User ID: [un ID unique]
```

### 5️⃣ Vérifier sur la page de debug

1. Après connexion, aller sur : http://localhost:5183/debug-session
2. Vérifier que l'email affiché est : `rwdrawingart@gmail.com`
3. Noter le User ID (important pour la suite)

### 6️⃣ Compléter l'onboarding

1. Vous devriez être redirigé vers `/onboarding`
2. Remplir les informations :
   - Nom de l'entreprise
   - Taille de l'entreprise
   - Secteur d'activité
3. Cliquer sur "Commencer"
4. Vérifier la redirection vers le dashboard

## 🔍 Points de contrôle

### ✅ Connexion réussie si :
- [ ] Google demande de choisir un compte
- [ ] Le toast affiche "Bienvenue rwdrawingart@gmail.com !"
- [ ] La console affiche le bon email dans les logs
- [ ] La page `/debug-session` affiche le bon email
- [ ] L'onboarding s'affiche pour un nouveau compte

### ❌ Échec si :
- [ ] Google se connecte automatiquement avec `vanessianroman@gmail.com`
- [ ] Le toast affiche le mauvais email
- [ ] La page `/debug-session` affiche `vanessianroman@gmail.com`

## 🐛 Si le problème persiste

### Méthode 1 : Navigation privée
1. Ouvrir une fenêtre de navigation privée (Cmd+Shift+N sur Mac)
2. Aller sur http://localhost:5183/login
3. Se connecter avec Google
4. Choisir `rwdrawingart@gmail.com`

### Méthode 2 : Vider le cache Google
1. Dans la console du navigateur :
```javascript
// Supprimer tous les cookies
document.cookie.split(";").forEach(function(c) { 
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});

// Nettoyer
localStorage.clear()
sessionStorage.clear()

// Recharger
location.reload()
```

### Méthode 3 : Supprimer l'ancien compte dans Supabase
1. Aller sur https://supabase.com/dashboard
2. Sélectionner votre projet
3. Aller dans "Authentication" > "Users"
4. Trouver `vanessianroman@gmail.com`
5. Cliquer sur les 3 points > "Delete user"
6. Confirmer la suppression
7. Réessayer de se connecter

## 📊 Comparer les comptes

### Utiliser la page de debug pour comparer

1. Se connecter avec `vanessianroman@gmail.com`
2. Aller sur `/debug-session`
3. Noter le User ID (ex: `abc-123-def`)
4. Se déconnecter
5. Se connecter avec `rwdrawingart@gmail.com`
6. Aller sur `/debug-session`
7. Noter le User ID (ex: `xyz-789-ghi`)

**Les User IDs DOIVENT être différents** ✅

Si les User IDs sont identiques, c'est le même compte qui est utilisé ❌

## 🎯 Test final

Pour confirmer que tout fonctionne :

1. ✅ Nettoyer complètement (méthode 1️⃣)
2. ✅ Se déconnecter de Google (méthode 2️⃣)
3. ✅ Se connecter avec `rwdrawingart@gmail.com` (méthode 3️⃣)
4. ✅ Vérifier l'email dans les logs (méthode 4️⃣)
5. ✅ Vérifier sur `/debug-session` (méthode 5️⃣)
6. ✅ Compléter l'onboarding (méthode 6️⃣)
7. ✅ Accéder au dashboard
8. ✅ Se déconnecter
9. ✅ Se reconnecter → doit aller directement au dashboard (onboarding déjà complété)

## 📞 Si rien ne fonctionne

Prenez des captures d'écran de :
1. La console avec les logs
2. La page `/debug-session`
3. L'écran de sélection de compte Google

Et partagez-les pour analyse.

## 🔗 Liens utiles

- Page de login : http://localhost:5183/login
- Page de debug : http://localhost:5183/debug-session
- Dashboard Supabase : https://supabase.com/dashboard
- Google Accounts : https://accounts.google.com
