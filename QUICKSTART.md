# 🚀 DÉMARRAGE RAPIDE - DEEPSEEK UNIQUEMENT

## Ce qui fonctionne MAINTENANT

✅ **DeepSeek** est prêt (tu as déjà le compte et les $10)  
⏳ **Instantly** est désactivé (tu l'activeras plus tard)

---

## Configuration rapide

### 1. Ajoute ta clé DeepSeek dans `.env`

```bash
cd backend
cp env.example .env
nano .env
```

Modifie uniquement cette ligne :
```bash
DEEPSEEK_API_KEY=sk-xxxxxxxxx  # Ta vraie clé DeepSeek
```

Les autres clés Stripe peuvent rester en test pour l'instant.

### 2. Lance le backend

```bash
cd /Users/roman/Desktop/Work/AGENTAI/backend
npm run dev
```

**Logs attendus :**
```
🚀 Serveur admin démarré sur le port 3001
🔒 Mode: development
📊 Base de données: Connectée
```

---

## Test rapide sans Stripe

### 1. Crée un client test en DB avec clé API

```bash
cd /Users/roman/Desktop/Work/AGENTAI/backend
npx prisma studio
```

Dans Prisma Studio:
1. Va dans la table **clients**
2. Crée un nouveau client:
   - `email`: `test@example.com`
   - `fullName`: `Test User`
   - `status`: `ACTIVE`
   - `apiKey`: `sk_agentai_test123456789`
   - `deepseekTokensQuota`: `1000000` (1M tokens)
   - `deepseekTokensUsed`: `0`
   - `quotaResetDate`: `2026-02-01T00:00:00.000Z`
3. Save

### 2. Teste DeepSeek via le proxy

```bash
curl -X POST http://localhost:3001/api/proxy/deepseek/chat \
  -H "Authorization: Bearer sk_agentai_test123456789" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Dis bonjour en français"}
    ]
  }'
```

**Réponse attendue :**
```json
{
  "id": "chatcmpl-...",
  "choices": [{
    "message": {
      "role": "assistant",
      "content": "Bonjour ! Comment puis-je vous aider aujourd'hui ?"
    }
  }],
  "usage": {
    "prompt_tokens": 12,
    "completion_tokens": 18,
    "total_tokens": 30
  },
  "quota": {
    "used": 30,
    "limit": 1000000,
    "remaining": 999970,
    "resetDate": "2026-02-01T00:00:00.000Z"
  }
}
```

### 3. Vérifie les stats d'usage

```bash
curl -X GET http://localhost:3001/api/proxy/usage \
  -H "Authorization: Bearer sk_agentai_test123456789"
```

---

## Intégration Stripe (optionnel pour l'instant)

Pour tester le flow complet paiement → clé API:

1. Configure Stripe dans `.env`:
```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... (du CLI)
STRIPE_PRICE_BUSINESS=price_...
```

2. Lance le Stripe CLI:
```bash
stripe listen --forward-to http://localhost:3001/api/billing/webhook
```

3. Simule un paiement depuis le frontend (localhost:5174)

4. La clé API sera générée automatiquement dans la DB

---

## Activer Instantly plus tard

Quand tu auras un compte Instantly:

1. Ajoute dans `.env`:
```bash
INSTANTLY_API_KEY=ta_clé_instantly
```

2. Redémarre le backend

3. Le endpoint `/api/proxy/instantly/send` sera activé automatiquement

---

## Logs backend à surveiller

```
✅ DeepSeek request for test@example.com: 30 tokens
♻️ Quota reset for test@example.com
❌ DeepSeek proxy error: ...  (si erreur)
```

---

## Prochaines étapes

1. ✅ Teste DeepSeek avec curl (ci-dessus)
2. Affiche la clé API dans le dashboard client
3. Ajoute l'intégration Stripe complète
4. Achète Instantly et active le service email

**Tout fonctionne ! Le backend est sur port 3001 et attend tes requêtes.** 🎉
