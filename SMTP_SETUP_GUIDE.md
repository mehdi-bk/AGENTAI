# 📧 Guide Complet: Configuration SMTP pour Supabase

**MBK: Comment obtenir et configurer les credentials SMTP pour envoyer des emails OTP**

---

## 🎯 **Pourquoi Configurer SMTP?**

Par défaut, Supabase utilise son propre service email (limite: **3-4 emails/heure**). Pour la production, vous devez configurer un service SMTP pour :
- ✅ Envoyer plus d'emails
- ✅ Meilleure délivrabilité
- ✅ Emails personnalisés avec votre domaine
- ✅ Pas de limite stricte

---

## 🏆 **Recommandation: Resend (Le Plus Simple)**

**Resend** est le plus simple et moderne pour commencer.

### **Étape 1: Créer un Compte Resend**

1. Allez sur [resend.com](https://resend.com)
2. Cliquez sur **"Sign Up"**
3. Créez un compte (gratuit jusqu'à 3,000 emails/mois)
4. Vérifiez votre email

### **Étape 2: Vérifier Votre Domaine (Optionnel mais Recommandé)**

1. Dans Resend Dashboard, allez dans **"Domains"**
2. Cliquez sur **"Add Domain"**
3. Entrez votre domaine (ex: `yourdomain.com`)
4. Ajoutez les enregistrements DNS fournis par Resend
5. Attendez la vérification (quelques minutes)

**Note:** Si vous n'avez pas de domaine, vous pouvez utiliser l'email par défaut de Resend temporairement.

### **Étape 3: Obtenir les Credentials SMTP**

1. Dans Resend Dashboard, allez dans **"API Keys"**
2. Cliquez sur **"Create API Key"**
3. Donnez un nom (ex: "Supabase OTP")
4. **Copiez l'API Key** (vous ne pourrez plus la voir après!)

### **Étape 4: Configurer dans Supabase**

1. Allez dans **Supabase Dashboard** → **Project Settings** → **Auth** → **SMTP Settings**
2. Remplissez :

```
Host: smtp.resend.com
Port: 465
Username: resend
Password: [Votre API Key Resend]
Sender email: noreply@yourdomain.com (ou onboarding@resend.dev pour test)
Sender name: LeadFlow
```

3. Cliquez sur **"Save"**

### **Étape 5: Tester**

1. Créez un compte de test
2. Vérifiez que l'email arrive avec le code OTP
3. Vérifiez les logs dans Resend Dashboard

---

## 📦 **Option 2: SendGrid (Populaire)**

### **Étape 1: Créer un Compte SendGrid**

1. Allez sur [sendgrid.com](https://sendgrid.com)
2. Créez un compte (gratuit jusqu'à 100 emails/jour)
3. Vérifiez votre email

### **Étape 2: Créer une API Key**

1. Allez dans **Settings** → **API Keys**
2. Cliquez sur **"Create API Key"**
3. Donnez un nom (ex: "Supabase SMTP")
4. Sélectionnez **"Full Access"** ou **"Mail Send"** permissions
5. **Copiez l'API Key**

### **Étape 3: Vérifier Votre Domaine (Recommandé)**

1. Allez dans **Settings** → **Sender Authentication**
2. Cliquez sur **"Authenticate Your Domain"**
3. Suivez les instructions pour ajouter les enregistrements DNS

### **Étape 4: Configurer dans Supabase**

```
Host: smtp.sendgrid.net
Port: 587
Username: apikey
Password: [Votre API Key SendGrid]
Sender email: noreply@yourdomain.com
Sender name: LeadFlow
```

---

## 📦 **Option 3: Mailgun (Robuste)**

### **Étape 1: Créer un Compte Mailgun**

1. Allez sur [mailgun.com](https://mailgun.com)
2. Créez un compte (gratuit jusqu'à 5,000 emails/mois)
3. Vérifiez votre email

### **Étape 2: Vérifier Votre Domaine**

1. Allez dans **Sending** → **Domains**
2. Cliquez sur **"Add New Domain"**
3. Entrez votre domaine
4. Ajoutez les enregistrements DNS
5. Attendez la vérification

### **Étape 3: Obtenir les Credentials**

1. Allez dans **Sending** → **Domain Settings**
2. Trouvez **"SMTP credentials"**
3. **Copiez:**
   - SMTP hostname
   - SMTP port (587)
   - SMTP username
   - SMTP password

### **Étape 4: Configurer dans Supabase**

```
Host: smtp.mailgun.org (ou votre domaine vérifié)
Port: 587
Username: [Votre SMTP username de Mailgun]
Password: [Votre SMTP password de Mailgun]
Sender email: noreply@yourdomain.com
Sender name: LeadFlow
```

---

## 📦 **Option 4: AWS SES (Pour Production à Grande Échelle)**

### **Étape 1: Créer un Compte AWS**

1. Allez sur [aws.amazon.com](https://aws.amazon.com)
2. Créez un compte AWS
3. Allez dans **SES (Simple Email Service)**

### **Étape 2: Vérifier Votre Email/Domaine**

1. Allez dans **Verified identities**
2. Cliquez sur **"Create identity"**
3. Vérifiez votre email ou domaine

### **Étape 3: Créer SMTP Credentials**

1. Allez dans **SMTP settings**
2. Cliquez sur **"Create SMTP credentials"**
3. Donnez un nom à l'utilisateur IAM
4. **Téléchargez les credentials** (fichier CSV)

### **Étape 4: Configurer dans Supabase**

```
Host: email-smtp.[region].amazonaws.com (ex: email-smtp.us-east-1.amazonaws.com)
Port: 587
Username: [Votre SMTP username AWS]
Password: [Votre SMTP password AWS]
Sender email: noreply@yourdomain.com
Sender name: LeadFlow
```

**Note:** AWS SES est en "Sandbox" par défaut (seulement emails vérifiés). Pour production, demandez la sortie du sandbox.

---

## 📦 **Option 5: Gmail SMTP (Pour Test Rapide)**

⚠️ **Non recommandé pour production**, mais utile pour tester rapidement.

### **Étape 1: Activer l'Accès aux Apps Moins Sécurisées (Désactivé par Google)**

**Alternative: Utiliser App Password**

1. Allez dans votre compte Google → **Security**
2. Activez **2-Step Verification**
3. Allez dans **App passwords**
4. Créez un nouveau mot de passe pour "Mail"
5. **Copiez le mot de passe** (16 caractères)

### **Étape 2: Configurer dans Supabase**

```
Host: smtp.gmail.com
Port: 587
Username: votre-email@gmail.com
Password: [Votre App Password de 16 caractères]
Sender email: votre-email@gmail.com
Sender name: LeadFlow
```

---

## ✅ **Tableau Comparatif**

| Provider     | Gratuit | Limite Gratuite | Facilité | Recommandé Pour  |
| ------------ | ------- | --------------- | -------- | ---------------- |
| **Resend**   | ✅       | 3,000/mois      | ⭐⭐⭐⭐⭐    | Démarrage rapide |
| **SendGrid** | ✅       | 100/jour        | ⭐⭐⭐⭐     | Petites apps     |
| **Mailgun**  | ✅       | 5,000/mois      | ⭐⭐⭐⭐     | Apps moyennes    |
| **AWS SES**  | ✅       | 62,000/mois     | ⭐⭐⭐      | Production       |
| **Gmail**    | ✅       | 500/jour        | ⭐⭐       | Test uniquement  |

---

## 🎯 **Recommandation pour Votre Projet**

### **Pour Commencer (Maintenant):**
👉 **Resend** - Le plus simple, setup en 5 minutes

### **Pour Production (Plus tard):**
👉 **AWS SES** ou **Mailgun** - Plus robuste, meilleure délivrabilité

---

## 📋 **Checklist de Configuration**

### **Dans le Provider SMTP:**
- [ ] Compte créé
- [ ] Domaine vérifié (optionnel mais recommandé)
- [ ] API Key / SMTP credentials obtenus
- [ ] Test d'envoi réussi

### **Dans Supabase:**
- [ ] SMTP Settings configurés
- [ ] Host, Port, Username, Password remplis
- [ ] Sender email et name configurés
- [ ] Settings sauvegardés
- [ ] Test d'envoi OTP réussi

---

## 🧪 **Tester la Configuration**

1. **Dans Supabase:**
   - Allez dans **Authentication** → **Users**
   - Créez un utilisateur de test
   - Envoyez un email de vérification

2. **Vérifiez:**
   - Email reçu dans la boîte de réception
   - Code OTP visible (pas de lien)
   - Email arrive rapidement (< 30 secondes)

3. **Vérifiez les Logs:**
   - **Supabase:** Logs → Auth Logs
   - **Provider SMTP:** Dashboard → Activity / Logs

---

## 🚨 **Troubleshooting**

### **Problème: "SMTP authentication failed"**

**Solutions:**
1. Vérifiez que le username et password sont corrects
2. Pour Gmail, utilisez App Password (pas le mot de passe normal)
3. Vérifiez que le port est correct (465 ou 587)
4. Vérifiez que votre IP n'est pas bloquée

### **Problème: "Connection timeout"**

**Solutions:**
1. Vérifiez que le hostname est correct
2. Vérifiez que le port n'est pas bloqué par un firewall
3. Essayez le port 587 au lieu de 465 (ou vice versa)

### **Problème: "Emails marqués comme spam"**

**Solutions:**
1. Vérifiez votre domaine (SPF, DKIM, DMARC)
2. Utilisez un domaine vérifié (pas d'email générique)
3. Évitez les mots-clés spam dans le contenu
4. Utilisez un service réputé (Resend, SendGrid, Mailgun)

---

## 📚 **Ressources**

- [Resend Documentation](https://resend.com/docs)
- [SendGrid SMTP Guide](https://docs.sendgrid.com/for-developers/sending-email/getting-started-smtp)
- [Mailgun SMTP Guide](https://documentation.mailgun.com/en/latest/user_manual.html#sending-via-smtp)
- [AWS SES SMTP Guide](https://docs.aws.amazon.com/ses/latest/dg/send-email-smtp.html)
- [Supabase SMTP Settings](https://supabase.com/docs/guides/auth/auth-smtp)

---

## 🎯 **Quick Start: Resend (5 Minutes)**

1. Créez un compte sur [resend.com](https://resend.com)
2. Créez une API Key
3. Dans Supabase → Settings → Auth → SMTP:
   ```
   Host: smtp.resend.com
   Port: 465
   Username: resend
   Password: [Votre API Key]
   Sender: noreply@yourdomain.com
   ```
4. Testez!

---

**MBK: Guide SMTP - Configuration complète pour emails OTP**

Last updated: January 2025
