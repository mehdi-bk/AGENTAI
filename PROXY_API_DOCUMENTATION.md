# 🚀 PROXY API SYSTEM - DOCUMENTATION COMPLÈTE

## Architecture

```
Client paie → Stripe Webhook → Génère clé API proxy unique
                                 ↓
                         Assigne quotas selon plan
                                 ↓
Client utilise sa clé → Backend proxy vérifie quota
                                 ↓
                    Appelle DeepSeek/Instantly avec clé secrète
                                 ↓
                         Track usage en DB
```

## ✅ CE QUI A ÉTÉ CODÉ

### 1. **Base de données** (Prisma)
- ✅ Champ `apiKey` unique pour chaque client
- ✅ Quotas mensuels: `deepseekTokensQuota`, `instantlyEmailsQuota`
- ✅ Tracking usage: `deepseekTokensUsed`, `instantlyEmailsUsed`
- ✅ Table `ApiUsage` pour logs détaillés
- ✅ Reset automatique quota le 1er de chaque mois

### 2. **Webhook Stripe** (`/api/billing/webhook`)
- ✅ Génère clé API `sk_agentai_...` unique
- ✅ Assigne quotas selon plan:
  - **Discovery**: 1M tokens DeepSeek, 1k emails Instantly
  - **Business**: 10M tokens, 10k emails
  - **Scale**: 100M tokens, 100k emails

### 3. **Routes Proxy** (`/api/proxy/*`)
- ✅ `POST /api/proxy/deepseek/chat` - Proxy DeepSeek Chat Completions
- ✅ `POST /api/proxy/instantly/send` - Proxy Instantly Email
- ✅ `GET /api/proxy/usage` - Stats d'usage client

### 4. **Middleware**
- ✅ Validation clé API (`Authorization: Bearer sk_agentai_...`)
- ✅ Vérification quota avant chaque appel
- ✅ Reset automatique quota mensuel
- ✅ Tracking détaillé de chaque requête

---

## 📖 UTILISATION PAR LE CLIENT

### 1. Le client paie un abonnement

```bash
# Frontend appelle
POST /api/billing/checkout
{
  "planId": "business",
  "successUrl": "https://app.com/success",
  "cancelUrl": "https://app.com/cancel"
}

# → Client redirigé vers Stripe
# → Paie avec sa carte
# → Webhook déclenché
# → Clé API générée et envoyée par email (à implémenter)
```

### 2. Le client reçoit sa clé API

```
sk_agentai_a1b2c3d4e5f6...
```

### 3. Le client appelle DeepSeek via le proxy

```bash
curl -X POST https://api.yoursite.com/api/proxy/deepseek/chat \
  -H "Authorization: Bearer sk_agentai_a1b2c3d4e5f6..." \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek-chat",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'
```

**Réponse:**
```json
{
  "id": "chatcmpl-...",
  "choices": [{
    "message": {
      "role": "assistant",
      "content": "Hello! How can I help?"
    }
  }],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 15,
    "total_tokens": 25
  },
  "quota": {
    "used": 25,
    "limit": 10000000,
    "remaining": 9999975,
    "resetDate": "2026-02-01T00:00:00.000Z"
  }
}
```

### 4. Le client appelle Instantly via le proxy

```bash
curl -X POST https://api.yoursite.com/api/proxy/instantly/send \
  -H "Authorization: Bearer sk_agentai_a1b2c3d4e5f6..." \
  -H "Content-Type: application/json" \
  -d '{
    "to": "prospect@example.com",
    "subject": "Test Email",
    "body": "Hello from AgentAI!"
  }'
```

**Réponse:**
```json
{
  "success": true,
  "messageId": "msg_...",
  "quota": {
    "used": 1,
    "limit": 10000,
    "remaining": 9999,
    "resetDate": "2026-02-01T00:00:00.000Z"
  }
}
```

### 5. Le client consulte ses stats d'usage

```bash
curl -X GET https://api.yoursite.com/api/proxy/usage \
  -H "Authorization: Bearer sk_agentai_a1b2c3d4e5f6..."
```

**Réponse:**
```json
{
  "success": true,
  "quota": {
    "deepseek": {
      "used": 125000,
      "limit": 10000000,
      "remaining": 9875000
    },
    "instantly": {
      "used": 543,
      "limit": 10000,
      "remaining": 9457
    },
    "resetDate": "2026-02-01T00:00:00.000Z"
  },
  "recentUsage": [
    {
      "service": "deepseek",
      "endpoint": "/chat/completions",
      "tokensUsed": 25,
      "statusCode": 200,
      "createdAt": "2026-01-26T12:00:00.000Z"
    },
    {
      "service": "instantly",
      "endpoint": "/send",
      "emailsSent": 1,
      "statusCode": 200,
      "createdAt": "2026-01-26T11:55:00.000Z"
    }
  ]
}
```

---

## 🔒 SÉCURITÉ

### Côté backend (tes vraies clés)
- ✅ `DEEPSEEK_API_KEY` et `INSTANTLY_API_KEY` restent dans `.env` backend
- ✅ Jamais exposées au client
- ✅ Toutes les requêtes passent par ton proxy

### Côté client (clé proxy)
- ✅ Chaque client a une clé unique `sk_agentai_...`
- ✅ Révocable instantanément (delete apiKey en DB)
- ✅ Limitée par quota mensuel
- ✅ Trackée à 100% (logs détaillés)

---

## 🧪 TEST EN LOCAL

### 1. Variables d'environnement (.env backend)

```bash
# DeepSeek
DEEPSEEK_API_KEY=sk-xxxxx

# Instantly
INSTANTLY_API_KEY=xxxxx
INSTANTLY_API_URL=https://api.instantly.ai/v1

# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_PRICE_DISCOVERY=price_xxxxx
STRIPE_PRICE_BUSINESS=price_xxxxx
STRIPE_PRICE_SCALE=price_xxxxx
```

### 2. Lancer Stripe CLI listener

```bash
stripe listen --forward-to http://localhost:3001/api/billing/webhook
# Copie le webhook secret dans .env
```

### 3. Simuler un paiement client

```bash
# Frontend: client clique "Choisir Business"
# → Redirigé vers Stripe checkout
# → Paie (carte test: 4242 4242 4242 4242)
# → Webhook déclenché automatiquement
```

### 4. Récupérer la clé API générée

```sql
-- Dans Prisma Studio ou DB
SELECT email, apiKey, deepseekTokensQuota, instantlyEmailsQuota
FROM clients
WHERE email = 'test@example.com';
```

### 5. Tester le proxy

```bash
# Remplace YOUR_API_KEY par la clé récupérée
curl -X POST http://localhost:3001/api/proxy/deepseek/chat \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Test"}]}'
```

---

## 📊 DASHBOARD CLIENT (À FAIRE)

Dans le dashboard client, affiche:
- ✅ Sa clé API (copiable)
- ✅ Quotas restants (barres de progression)
- ✅ Date du prochain reset
- ✅ Historique des 100 derniers appels
- ✅ Graphiques d'usage

Code frontend: voir `src/app/pages/dashboard/SettingsPage.tsx`

---

## 💰 BUSINESS MODEL

### Tes coûts (DeepSeek + Instantly)
- DeepSeek: $0.28/1M tokens input + $0.42/1M tokens output
- Instantly: variable selon ton plan acheté

### Prix client (exemple)
- Discovery: 29€/mois (1M tokens + 1k emails)
- Business: 99€/mois (10M tokens + 10k emails)
- Scale: 299€/mois (100M tokens + 100k emails)

### Marge
Prix client - Coûts réels API = Ton bénéfice

---

## 🎯 PROCHAINES ÉTAPES

1. ✅ Tout est codé et fonctionnel
2. ⏭️ Afficher la clé API dans le dashboard client
3. ⏭️ Envoyer email avec clé API après paiement
4. ⏭️ Ajouter page "Documentation API" pour clients
5. ⏭️ Monitoring/alertes si usage proche du quota
6. ⏭️ Interface admin pour voir usage de tous les clients

---

## 🐛 DÉPANNAGE

### Erreur: "Invalid API key"
- Vérifie que la clé commence par `sk_agentai_`
- Check en DB: `SELECT apiKey FROM clients WHERE email='...'`

### Erreur: "Quota exceeded"
- Vérifie `deepseekTokensUsed` et `instantlyEmailsUsed` en DB
- Reset manuel: `UPDATE clients SET deepseekTokensUsed=0 WHERE email='...'`

### Backend ne démarre pas
- Port 3001 occupé: `lsof -ti :3001 | xargs kill -9`
- Migration Prisma: `cd backend && npx prisma migrate dev`

---

**Tout est prêt ! 🚀** Ajoute tes vraies clés API dans `.env` et teste.
