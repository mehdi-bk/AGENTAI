# Correctif du problème de compte Google incorrect

## Problème rapporté

Lorsque l'utilisateur essaie de se connecter avec un nouveau compte Google (`rwdrawingart@gmail.com`), le système le connecte avec un ancien compte (`vanessianroman@gmail.com`).

## Cause

Le problème vient de **la réutilisation d'une session Google existante** :

1. **Session Google active dans le navigateur** : Si vous êtes déjà connecté à Google avec un compte, Google OAuth peut réutiliser cette session
2. **Session Supabase existante** : Si une session Supabase était encore active localement, elle pouvait interférer
3. **Paramètre OAuth incorrect** : Le paramètre `prompt: 'consent'` ne force pas la sélection du compte, il demande juste le consentement

## Solutions apportées

### 1. Nettoyage de session avant OAuth ✅

**Fichier** : `src/services/authService.ts`

```typescript
export const signInWithGoogle = async () => {
  // Nettoyer toute session existante AVANT OAuth
  await supabase.auth.signOut({ scope: 'local' });
  
  // Petit délai pour garantir le nettoyage
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${import.meta.env.VITE_APP_URL}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'select_account', // ⚠️ Changé de 'consent' à 'select_account'
      },
    },
  });
};
```

**Changements** :
- ✅ Ajout de `supabase.auth.signOut({ scope: 'local' })` avant OAuth
- ✅ Délai de 300ms pour garantir la synchronisation
- ✅ Changement de `prompt: 'consent'` vers `prompt: 'select_account'`

### 2. Amélioration des logs de callback ✅

**Fichier** : `src/app/pages/auth/AuthCallbackPage.tsx`

```typescript
console.log('📊 Callback result:', { 
  completed, 
  needsOnboarding, 
  userEmail: user?.email,
  userMetadata: user?.user_metadata,
  userId: user?.id  // Nouveau
});

console.log('🆔 User ID:', user.id);
console.log('🔑 Auth provider:', user.app_metadata?.provider); // Nouveau
```

**Avantages** :
- Voir clairement quel email a été connecté
- Identifier le provider utilisé (google, azure, email)
- Vérifier l'ID utilisateur pour détecter les comptes différents

### 3. Page de diagnostic /debug-session ✅

**Fichier** : `src/app/pages/auth/SessionDebugPage.tsx`

Une nouvelle page accessible à `/debug-session` qui affiche :
- ✅ Email de l'utilisateur connecté
- ✅ ID utilisateur
- ✅ Provider (google, azure, email)
- ✅ Toutes les métadonnées
- ✅ Statut de l'onboarding
- ✅ Bouton pour nettoyer complètement la session

**Utilisation** :
1. Aller sur http://localhost:5183/debug-session
2. Vérifier l'email actuellement connecté
3. Cliquer sur "Nettoyer session" si besoin
4. Se reconnecter avec le bon compte

## Comment tester la correction

### Test 1 : Connexion avec un nouveau compte

1. **Nettoyer complètement** :
   ```bash
   # Dans la console du navigateur (F12)
   localStorage.clear()
   sessionStorage.clear()
   ```

2. **Aller sur la page de debug** :
   - Visiter http://localhost:5183/debug-session
   - Cliquer sur "Nettoyer session"

3. **Se déconnecter de Google** :
   - Aller sur https://accounts.google.com
   - Se déconnecter de tous les comptes

4. **Se reconnecter** :
   - Aller sur http://localhost:5183/login
   - Cliquer sur "Continue with Google"
   - **Google devrait maintenant demander de choisir un compte**
   - Sélectionner `rwdrawingart@gmail.com`

5. **Vérifier** :
   - Après le callback, vérifier les logs dans la console
   - Chercher `👤 User authenticated: rwdrawingart@gmail.com`
   - Le toast devrait afficher le bon email

### Test 2 : Utiliser la page de debug

1. Après connexion, aller sur `/debug-session`
2. Vérifier que l'email affiché est correct
3. Vérifier le `userId` - il doit être différent pour chaque compte
4. Si le mauvais compte est connecté :
   - Cliquer sur "Nettoyer session"
   - Retourner à `/login`
   - Se reconnecter

### Test 3 : Vérifier dans Supabase

1. Aller sur https://supabase.com/dashboard
2. Projet : `vqebrtggktfymchljbtx`
3. Aller dans "Authentication" > "Users"
4. Vérifier que les deux comptes existent :
   - `vanessianroman@gmail.com`
   - `rwdrawingart@gmail.com`
5. Chaque compte doit avoir un `id` unique

## Différence entre les prompts OAuth

| Prompt | Comportement |
|--------|--------------|
| `consent` | Demande le consentement mais peut réutiliser le compte déjà connecté |
| `select_account` | **Force** la sélection du compte, affiche tous les comptes disponibles |
| `login` | Force une nouvelle authentification complète |

**Nous utilisons maintenant `select_account`** pour garantir que l'utilisateur choisit explicitement le compte.

## Problèmes potentiels restants

### 1. Session Google dans le navigateur
Si vous êtes connecté à Google avec un seul compte, Google peut quand même utiliser ce compte automatiquement. 

**Solution** : Se déconnecter de Google complètement avant de tester.

### 2. Cookies de domaine
Si des cookies persistent entre les sessions.

**Solution** : 
```bash
# Console navigateur
document.cookie.split(";").forEach(function(c) { 
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});
```

### 3. Cache du navigateur
Le cache peut contenir d'anciennes informations OAuth.

**Solution** : Tester en navigation privée ou vider le cache.

## Commandes de debug utiles

### Console navigateur (F12)

```javascript
// Voir la session actuelle
const { data, error } = await supabase.auth.getSession()
console.log('Session:', data.session)

// Voir l'utilisateur actuel
const { data: userData } = await supabase.auth.getUser()
console.log('User:', userData.user)

// Nettoyer complètement
await supabase.auth.signOut()
localStorage.clear()
sessionStorage.clear()
location.reload()
```

## Logs à surveiller

Lors de la connexion Google, vous devriez voir :

```
🔐 Starting Google OAuth sign in...
🧹 Cleaning existing session before OAuth...
✅ Google OAuth initiated successfully
🔄 Auth callback started...
⏳ Waiting for Supabase to complete authentication...
🔍 Checking onboarding status...
👤 User authenticated: rwdrawingart@gmail.com
🆔 User ID: [uuid]
🔑 Auth provider: google
➡️ New user or incomplete profile - redirecting to onboarding...
```

## Prochaines étapes si le problème persiste

Si après ces correctifs le problème persiste :

1. **Vérifier dans Supabase Dashboard** :
   - Aller dans Authentication > Users
   - Supprimer l'ancien utilisateur `vanessianroman@gmail.com` si nécessaire

2. **Tester en navigation privée** :
   - Ouvrir une fenêtre privée
   - Aller sur l'application
   - Se connecter avec Google

3. **Vérifier les redirects OAuth** :
   - Dans Google Cloud Console
   - Vérifier que les URIs de redirection sont corrects
   - Callback doit être : `http://localhost:5173/auth/callback` (dev) et votre URL prod

4. **Contacter le support** si le problème vient de Supabase :
   - Fournir les logs de la console
   - Indiquer les emails des deux comptes
   - Expliquer le comportement observé

## Résumé des fichiers modifiés

1. ✅ `src/services/authService.ts` - Nettoyage session + prompt select_account
2. ✅ `src/app/pages/auth/AuthCallbackPage.tsx` - Logs améliorés
3. ✅ `src/app/pages/auth/SessionDebugPage.tsx` - Page de diagnostic (nouveau)
4. ✅ `src/app/App.tsx` - Route /debug-session ajoutée
