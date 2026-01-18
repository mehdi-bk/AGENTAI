# 🔐 Configuration Supabase pour OTP Codes (Pas de Liens Magiques)

**MBK: Guide pour configurer Supabase pour envoyer des codes OTP numériques au lieu de liens magiques**

---

## ⚠️ **IMPORTANT: Configuration Requise**

Par défaut, Supabase peut envoyer soit des **liens magiques** soit des **codes OTP**. Pour forcer l'envoi de codes uniquement, vous devez configurer Supabase Dashboard.

---

## 📋 **Étape 1: Configurer l'Email Template dans Supabase**

1. Allez dans **Supabase Dashboard** → **Authentication** → **Email Templates**

2. Trouvez le template **"Magic Link"** (c'est celui utilisé pour OTP)

3. **Modifiez le template** pour afficher le code au lieu d'un lien :

```html
<h2>Votre code de vérification LeadFlow</h2>
<p>Utilisez ce code à 6 chiffres pour vous connecter :</p>
<div style="text-align: center; margin: 30px 0;">
  <h1 style="font-size: 48px; font-weight: bold; color: #1E40AF; letter-spacing: 8px; font-family: monospace;">
    {{ .Token }}
  </h1>
</div>
<p style="color: #666; font-size: 14px;">
  Ce code expire dans 10 minutes.
</p>
<p style="color: #666; font-size: 14px;">
  Si vous n'avez pas demandé ce code, ignorez cet email.
</p>
```

4. **Cliquez sur "Save"**

---

## 📋 **Étape 2: Configurer les Paramètres OTP**

1. Allez dans **Authentication** → **Settings**

2. Configurez ces paramètres :

   - **OTP Expiry**: `600` secondes (10 minutes)
   - **OTP Length**: `6` digits
   - **Enable email confirmations**: ✅ **Activé**
   - **Secure email change**: ✅ Activé (recommandé)

3. **Cliquez sur "Save"**

---

## 📋 **Étape 3: Désactiver les Liens Magiques (Optionnel mais Recommandé)**

Pour forcer l'utilisation de codes uniquement :

1. Allez dans **Authentication** → **Providers**

2. Cliquez sur **Email**

3. Assurez-vous que :
   - ✅ **Enable email provider** est activé
   - ✅ **Confirm email** est activé
   - ❌ **Enable magic links** peut être désactivé si vous voulez uniquement des codes

**Note:** Même si "magic links" est activé, en ne passant pas `emailRedirectTo` dans le code, Supabase enverra un code OTP.

---

## 📋 **Étape 4: Tester la Configuration**

### **Test 1: Vérifier l'Email Template**

1. Créez un compte de test
2. Vérifiez votre email
3. Vous devriez recevoir un **code à 6 chiffres** (ex: `123456`)
4. **PAS** de lien cliquable

### **Test 2: Vérifier dans les Logs**

1. Allez dans **Logs** → **Auth Logs**
2. Cherchez votre tentative de connexion
3. Vous devriez voir : `OTP sent to email`

---

## 🔧 **Configuration du Code (Déjà Fait)**

Le code a été modifié pour :

1. ✅ **Ne pas inclure `emailRedirectTo`** dans `signInWithOtp()` → Force l'envoi de codes
2. ✅ **Utiliser `verifyOtp()`** avec `type: 'email'` → Vérifie le code numérique
3. ✅ **Ajouter le champ téléphone** dans le signup
4. ✅ **Sauvegarder le téléphone** dans les métadonnées utilisateur

---

## 📧 **Template Email Complet (Recommandé)**

Voici un template email professionnel pour Supabase :

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #1E40AF; margin: 0;">LeadFlow</h1>
  </div>
  
  <div style="background: #f9fafb; border-radius: 8px; padding: 30px; margin: 20px 0;">
    <h2 style="color: #1f2937; margin-top: 0;">Votre code de vérification</h2>
    <p style="color: #6b7280;">Utilisez ce code à 6 chiffres pour vous connecter :</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <div style="display: inline-block; background: white; padding: 20px 40px; border-radius: 8px; border: 2px solid #e5e7eb;">
        <h1 style="font-size: 48px; font-weight: bold; color: #1E40AF; letter-spacing: 8px; font-family: 'Courier New', monospace; margin: 0;">
          {{ .Token }}
        </h1>
      </div>
    </div>
    
    <p style="color: #6b7280; font-size: 14px; margin-bottom: 0;">
      ⏱️ Ce code expire dans <strong>10 minutes</strong>.
    </p>
  </div>
  
  <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 30px;">
    Si vous n'avez pas demandé ce code, vous pouvez ignorer cet email en toute sécurité.
  </p>
  
  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
  
  <p style="color: #9ca3af; font-size: 12px; text-align: center;">
    © 2025 LeadFlow. Tous droits réservés.
  </p>
</body>
</html>
```

---

## 🚨 **Troubleshooting**

### **Problème: Je reçois toujours un lien au lieu d'un code**

**Solution:**
1. Vérifiez que `emailRedirectTo` n'est **PAS** inclus dans `signInWithOtp()`
2. Vérifiez le template email dans Supabase Dashboard
3. Videz le cache et réessayez

### **Problème: Le code ne fonctionne pas**

**Solution:**
1. Vérifiez que vous utilisez `verifyOtp()` avec `type: 'email'`
2. Vérifiez que le code n'a pas expiré (10 minutes)
3. Vérifiez les logs Auth dans Supabase

### **Problème: L'email n'est pas envoyé**

**Solution:**
1. Vérifiez les **Auth Logs** dans Supabase
2. En développement, utilisez l'email de votre compte Supabase
3. En production, configurez SMTP (Resend, SendGrid, etc.)

---

## ✅ **Checklist de Configuration**

- [ ] Template email modifié pour afficher le code
- [ ] OTP Length configuré à 6 digits
- [ ] OTP Expiry configuré à 600 secondes
- [ ] Email confirmations activées
- [ ] Code modifié pour ne pas inclure `emailRedirectTo`
- [ ] Testé avec un compte de test
- [ ] Code reçu dans l'email (pas de lien)

---

## 📚 **Ressources**

- [Supabase OTP Documentation](https://supabase.com/docs/guides/auth/auth-otp)
- [Supabase Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Supabase Auth Settings](https://supabase.com/docs/guides/auth/auth-settings)

---

**MBK: Configuration OTP - Codes numériques uniquement, pas de liens magiques**

Last updated: January 2025
