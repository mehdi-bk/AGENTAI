# Correctif du flux d'authentification OAuth Google

## Problème identifié

Lorsqu'un utilisateur se connectait avec un compte Google différent, le système :
- Ne détectait pas qu'il s'agissait d'un nouvel utilisateur
- Ne demandait pas de renseigner les informations de l'entreprise
- Redirigeait directement vers le dashboard avec un compte incomplet

## Cause racine

1. **Détection incorrecte des nouveaux utilisateurs** : La fonction `checkOnboardingStatus()` ne faisait pas la distinction entre :
   - Un utilisateur existant qui a complété l'onboarding
   - Un nouvel utilisateur OAuth sans métadonnées

2. **Absence de protection de la route d'onboarding** : La page d'onboarding n'était pas protégée, permettant des incohérences de flux

3. **Sauvegarde non-bloquante** : Les métadonnées de l'utilisateur étaient sauvegardées de manière asynchrone sans attendre la confirmation

## Corrections apportées

### 1. Amélioration de `checkOnboardingStatus()` dans `authService.ts`
```typescript
// AVANT : Vérification basique
const isProfileComplete = onboardingCompleted && hasCompany;

// APRÈS : Vérification stricte avec plus de logs
const onboardingCompleted = metadata.onboarding_completed === true;
const hasCompany = !!metadata.company;
const isProfileComplete = onboardingCompleted && hasCompany;
```
- Vérification explicite que `onboarding_completed === true`
- Logs détaillés pour faciliter le débogage
- Tous les nouveaux utilisateurs OAuth doivent passer par l'onboarding

### 2. Nouveau composant `OnboardingRoute.tsx`
Protège la page d'onboarding avec une logique intelligente :
- ❌ Non authentifié → Redirection vers `/login`
- ✅ Authentifié + Onboarding déjà complété → Redirection vers `/dashboard`
- ✅ Authentifié + Onboarding incomplet → Affichage de la page d'onboarding

### 3. Amélioration de `OnboardingPage.tsx`
```typescript
// AVANT : Sauvegarde async sans attendre
supabase.auth.updateUser({ ... }).then(...)
navigate('/dashboard'); // Immédiat

// APRÈS : Sauvegarde bloquante
const { error } = await supabase.auth.updateUser({ ... });
if (error) throw error;
await new Promise(resolve => setTimeout(resolve, 500)); // Sync
navigate('/dashboard', { replace: true });
```
- Attente de la confirmation de sauvegarde
- Ajout d'un timestamp `onboarding_completed_at`
- Petite pause pour garantir la synchronisation
- Gestion d'erreur améliorée

### 4. Amélioration de `AuthCallbackPage.tsx`
- Délai augmenté de 1.5s à 2s pour la synchronisation OAuth
- Meilleure gestion des erreurs et messages utilisateur
- Logs détaillés incluant les métadonnées utilisateur
- Utilisation de `replace: true` pour éviter les problèmes de navigation arrière

### 5. Protection du `DashboardLayout.tsx`
Ajout d'une vérification d'onboarding au chargement :
```typescript
useEffect(() => {
  const { needsOnboarding } = await checkOnboardingStatus();
  if (needsOnboarding) {
    navigate('/onboarding', { replace: true });
  }
}, [user]);
```
- Double protection pour empêcher l'accès au dashboard sans onboarding
- Affichage d'un loader pendant la vérification

### 6. Mise à jour de `App.tsx`
```typescript
<Route path="/onboarding" element={
  <OnboardingRoute>
    <OnboardingPage />
  </OnboardingRoute>
} />
```

## Flux d'authentification corrigé

### 1. Connexion OAuth Google
```
Utilisateur clique "Continue with Google"
    ↓
Redirection vers Google OAuth
    ↓
Authentification Google réussie
    ↓
Redirection vers /auth/callback
```

### 2. Callback et vérification
```
AuthCallbackPage
    ↓
Attente 2s (synchronisation Supabase)
    ↓
checkOnboardingStatus()
    ↓
Vérification de onboarding_completed et company
```

### 3. Redirection intelligente
```
SI nouvel utilisateur OU profil incomplet
    → /onboarding (forcé)
    
SINON SI profil complété
    → /dashboard
```

### 4. Page d'onboarding
```
OnboardingRoute vérifie l'authentification
    ↓
Utilisateur remplit le formulaire
    ↓
Sauvegarde BLOQUANTE des métadonnées
    ↓
Confirmation de sauvegarde
    ↓
Redirection vers /dashboard
```

### 5. Accès au dashboard
```
DashboardLayout vérifie l'onboarding
    ↓
SI onboarding incomplet
    → Redirection forcée vers /onboarding
    
SINON
    → Affichage du dashboard
```

## Tests recommandés

1. **Nouveau compte Google**
   - Se connecter avec un nouveau compte Google
   - Vérifier la redirection vers `/onboarding`
   - Compléter le formulaire
   - Vérifier l'accès au dashboard

2. **Compte existant**
   - Se connecter avec un compte ayant déjà complété l'onboarding
   - Vérifier la redirection directe vers `/dashboard`

3. **Tentative de bypass**
   - Essayer d'accéder à `/dashboard` sans avoir complété l'onboarding
   - Vérifier la redirection forcée vers `/onboarding`

4. **Changement de compte**
   - Se déconnecter
   - Se connecter avec un autre compte Google
   - Vérifier le flux complet d'onboarding

## Logs de débogage

Les logs suivent maintenant un format cohérent :
- 🔄 : Début d'un processus
- 🔍 : Vérification / recherche
- ✅ : Succès
- ❌ : Erreur
- ➡️ : Redirection
- 👤 : Information utilisateur
- 📊 : Résultat de vérification
- 💾 : Sauvegarde de données
- ⏳ : Attente

Exemple de logs lors d'une première connexion :
```
🔄 Auth callback started...
⏳ Waiting for Supabase to complete authentication...
🔍 Checking onboarding status...
🔍 Getting user from Supabase...
✅ User found: user@gmail.com
📋 User metadata: {}
📝 Is profile complete: false
📍 Needs onboarding: true
➡️ New user or incomplete profile - redirecting to onboarding...
```

## Métadonnées utilisateur sauvegardées

Lors de l'onboarding, les champs suivants sont sauvegardés :
```typescript
{
  company: string,              // Nom de l'entreprise
  company_size: string,         // Taille (1-10, 11-50, etc.)
  industry: string,             // Secteur d'activité
  onboarding_completed: true,   // Flag de complétion
  onboarding_completed_at: ISO  // Timestamp de complétion
}
```

## Prochaines améliorations possibles

1. **Validation backend** : Ajouter une validation côté Supabase pour garantir l'intégrité des données
2. **Base de données dédiée** : Créer une table `profiles` pour stocker les informations d'entreprise
3. **Onboarding multi-étapes** : Diviser l'onboarding en plusieurs étapes pour plus de flexibilité
4. **Analytics** : Tracker les abandons d'onboarding pour améliorer le taux de conversion
