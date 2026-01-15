# Configuration Azure OAuth (Outlook/Microsoft)

Guide complet pour configurer l'authentification Azure (Outlook/Microsoft) dans votre application AI SDR.

## 1. Configuration Azure Portal

### Étape 1 : Créer une Application Azure AD

1. Allez sur le [Azure Portal](https://portal.azure.com)
2. Recherchez et sélectionnez **Azure Active Directory**
3. Dans le menu latéral, cliquez sur **App registrations**
4. Cliquez sur **New registration**
5. Configurez votre application :
   - **Name**: AI SDR Application (ou votre nom)
   - **Supported account types**: Accounts in any organizational directory (Any Azure AD directory - Multitenant) and personal Microsoft accounts
   - **Redirect URI**: Web → `https://vqebrtggktfymchljbtx.supabase.co/auth/v1/callback`
6. Cliquez sur **Register**

### Étape 2 : Configurer les Redirect URIs

1. Dans votre application Azure, allez dans **Authentication**
2. Sous **Platform configurations**, cliquez sur **Add a platform** → **Web**
3. Ajoutez les URIs de redirection suivants :
   ```
   https://vqebrtggktfymchljbtx.supabase.co/auth/v1/callback
   http://localhost:5180/dashboard
   http://localhost:5173/dashboard
   http://localhost:5174/dashboard
   ```
4. Cochez les cases :
   - ☑ **Access tokens** (used for implicit flows)
   - ☑ **ID tokens** (used for implicit and hybrid flows)
5. Cliquez sur **Save**

### Étape 3 : Configurer les API Permissions

1. Dans le menu latéral, cliquez sur **API permissions**
2. Cliquez sur **Add a permission** → **Microsoft Graph**
3. Sélectionnez **Delegated permissions**
4. Ajoutez les permissions suivantes :
   - `openid`
   - `profile`
   - `email`
   - `offline_access`
5. Cliquez sur **Add permissions**
6. Cliquez sur **Grant admin consent for [Your Organization]** (si vous êtes admin)

### Étape 4 : Créer un Client Secret

1. Dans le menu latéral, cliquez sur **Certificates & secrets**
2. Sous **Client secrets**, cliquez sur **New client secret**
3. Ajoutez une description : "AI SDR OAuth Secret"
4. Sélectionnez une expiration : **24 months** (recommandé)
5. Cliquez sur **Add**
6. **⚠️ IMPORTANT** : Copiez immédiatement la **Value** du secret - elle ne sera plus visible après !

### Étape 5 : Récupérer les Credentials

Dans la page **Overview** de votre application, notez :
- **Application (client) ID** : `VOTRE_AZURE_CLIENT_ID`
- **Directory (tenant) ID** : `VOTRE_AZURE_TENANT_ID`
- **Client Secret** : La value que vous avez copiée à l'étape 4

## 2. Configuration Supabase

### Étape 1 : Activer Azure Provider

1. Allez sur [Supabase Dashboard](https://app.supabase.com)
2. Sélectionnez votre projet
3. Allez dans **Authentication** → **Providers**
4. Cherchez **Azure** et activez-le
5. Configurez les paramètres :
   - **Azure Client ID** : `VOTRE_AZURE_CLIENT_ID`
   - **Azure Secret** : `VOTRE_CLIENT_SECRET`
   - **Azure Tenant** : Laissez vide pour multitenant OU mettez `VOTRE_AZURE_TENANT_ID` pour un seul tenant
6. Cliquez sur **Save**

### Étape 2 : Vérifier la Redirect URL

La Redirect URL de Supabase doit être :
```
https://vqebrtggktfymchljbtx.supabase.co/auth/v1/callback
```

Cette URL doit correspondre exactement à celle configurée dans Azure Portal.

## 3. Test de l'Authentification

### Test en Local

1. Lancez votre serveur de développement :
   ```bash
   npm run dev
   ```

2. Allez sur http://localhost:5180/login

3. Cliquez sur **Continue with Outlook**

4. Vous serez redirigé vers Microsoft pour vous authentifier

5. Après authentification, vous serez redirigé vers :
   - `/auth/callback` (traitement)
   - `/onboarding` (si nouveau compte) ou `/dashboard` (si compte existant)

### Vérifications

- [ ] Le bouton "Continue with Outlook" est visible
- [ ] La redirection vers Microsoft fonctionne
- [ ] Après authentification, retour sur l'application
- [ ] Les informations utilisateur sont correctement récupérées
- [ ] Le nom et l'email s'affichent dans le dashboard

## 4. Dépannage

### Erreur : "AADSTS50011: The reply URL specified in the request does not match"

**Solution** : Vérifiez que l'URL de redirection dans Azure Portal correspond exactement à celle de Supabase.

### Erreur : "AADSTS7000215: Invalid client secret is provided"

**Solution** : Vérifiez que le Client Secret dans Supabase est correct. Si le secret a expiré, créez-en un nouveau dans Azure Portal.

### Erreur : "AADSTS65001: User or administrator has not consented"

**Solution** : Assurez-vous d'avoir accordé le consentement admin dans **API permissions** → **Grant admin consent**.

### L'utilisateur ne peut pas se connecter avec un compte personnel (Gmail, Yahoo, etc.)

**Solution** : Vérifiez dans Azure Portal → **Authentication** que le type de compte supporté est bien :
- **Accounts in any organizational directory and personal Microsoft accounts (e.g. Skype, Xbox)**

### Les informations utilisateur ne s'affichent pas

**Solution** : Vérifiez que les permissions `openid`, `profile`, `email` sont bien accordées dans Azure Portal.

## 5. Configuration Production

Pour la production, ajoutez votre domaine de production dans les Redirect URIs :

```
https://votre-domaine.com/auth/callback
https://votre-domaine.com/dashboard
```

Et mettez à jour la variable d'environnement :
```env
VITE_APP_URL=https://votre-domaine.com
```

## 6. Sécurité

### Bonnes Pratiques

1. **Client Secret** : 
   - Ne jamais exposer dans le code frontend
   - Stocké uniquement dans Supabase
   - Renouveler régulièrement (tous les 6-12 mois)

2. **Permissions** :
   - Demander uniquement les permissions nécessaires
   - Éviter de demander des permissions étendues sans raison

3. **Monitoring** :
   - Surveiller les tentatives de connexion dans Azure Portal → **Sign-in logs**
   - Activer les alertes en cas d'activité suspecte

## 7. Ressources

- [Documentation Azure AD OAuth](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow)
- [Documentation Supabase Auth](https://supabase.com/docs/guides/auth/social-login/auth-azure)
- [Microsoft Graph API](https://docs.microsoft.com/en-us/graph/overview)

## Support

En cas de problème, vérifiez :
1. Les logs dans Supabase Dashboard → Logs
2. La console du navigateur (F12)
3. Les logs Azure Portal → App registrations → votre app → Sign-in logs
