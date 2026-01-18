# 🔒 Security Hardening Checklist

**MBK: Critical security fixes for production deployment**

---

## 🚨 **CRITICAL FIXES (Do Immediately)**

### **1. Client API Authentication (HIGHEST PRIORITY)**

**Current Issue:** Client API uses `X-Client-Email` header - **INSECURE!**

**Fix:** Implement Supabase JWT verification

```javascript
// backend/middleware/verifySupabaseJWT.js
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const client = jwksClient({
  jwksUri: `${process.env.VITE_SUPABASE_URL}/.well-known/jwks.json`
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

const verifySupabaseJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Missing or invalid authorization header' 
      });
    }

    const token = authHeader.replace('Bearer ', '');
    
    jwt.verify(token, getKey, {
      audience: process.env.VITE_SUPABASE_ANON_KEY,
      issuer: `${process.env.VITE_SUPABASE_URL}/auth/v1`,
      algorithms: ['RS256']
    }, (err, decoded) => {
      if (err) {
        console.error('JWT verification error:', err);
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid or expired token' 
        });
      }

      req.user = decoded;
      req.user.email = decoded.email;
      next();
    });
  } catch (error) {
    console.error('Error verifying JWT:', error);
    res.status(401).json({ 
      success: false, 
      message: 'Authentication failed' 
    });
  }
};

module.exports = verifySupabaseJWT;
```

**Update routes:**
```javascript
// backend/routes/clientDashboard.js
const verifySupabaseJWT = require('../middleware/verifySupabaseJWT');

// Replace getClientFromRequest with:
router.use(verifySupabaseJWT);

// Then get email from req.user.email
const getClientFromRequest = async (req, res, next) => {
  try {
    const email = req.user.email; // From JWT
    
    const client = await prisma.client.findUnique({
      where: { email }
    });
    
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client introuvable'
      });
    }
    
    req.client = client;
    next();
  } catch (error) {
    console.error('Error getting client:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification du client'
    });
  }
};
```

**Update frontend:**
```typescript
// src/services/dashboardService.ts
const request = async (endpoint: string, options: RequestInit = {}) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // Use JWT token
      ...options.headers
    },
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('Request failed');
  }

  return response.json();
};
```

---

### **2. Generate Production Secrets**

**Never use development secrets in production!**

```bash
# Generate secure random secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Update `.env` with:**
```env
# Generate NEW secrets for production
JWT_SECRET=<64-char-random-hex>
JWT_REFRESH_SECRET=<64-char-random-hex>
SESSION_SECRET=<64-char-random-hex>
CSRF_SECRET=<64-char-random-hex>
```

---

### **3. HTTPS/SSL Enforcement**

**Backend:**
```javascript
// Force HTTPS in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}
```

**Frontend:**
- Deploy on Vercel/Netlify (automatic HTTPS)
- Configure redirect HTTP → HTTPS

---

### **4. Security Headers**

```javascript
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", process.env.VITE_SUPABASE_URL],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

---

### **5. Rate Limiting (Production)**

```javascript
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redis = require('redis');

const redisClient = redis.createClient({
  url: process.env.REDIS_URL
});

// General API rate limit
const apiLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later.'
});

// Strict rate limit for auth endpoints
const authLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
  }),
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 login attempts per 15 min
  message: 'Too many login attempts, please try again later.',
  skipSuccessfulRequests: true
});

// Apply to routes
app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/signup', authLimiter);
```

---

### **6. Input Validation & Sanitization**

```javascript
const { body, validationResult } = require('express-validator');
const validator = require('validator');

// Sanitize all string inputs
const sanitizeInput = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = validator.escape(req.body[key]);
      }
    });
  }
  next();
};

app.use(express.json());
app.use(sanitizeInput);

// Validate email
const validateEmail = [
  body('email').isEmail().normalizeEmail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
```

---

### **7. CORS Configuration (Production)**

```javascript
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',').map(o => o.trim()) || [];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400 // 24 hours
}));
```

**Production `.env`:**
```env
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

---

### **8. Database Security**

```javascript
// Use connection pooling
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL + '?connection_limit=10&pool_timeout=20'
    }
  }
});

// Always use parameterized queries (Prisma does this automatically ✅)
// Never use string concatenation for SQL queries
```

---

### **9. Error Handling (Don't Leak Info)**

```javascript
// Don't expose stack traces in production
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(isDevelopment && { stack: err.stack }) // Only in dev
  });
});
```

---

### **10. Session Security**

```javascript
// Secure session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
    httpOnly: true, // Prevent XSS
    sameSite: 'strict', // CSRF protection
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));
```

---

## ✅ **Security Checklist**

- [ ] Client API uses JWT authentication (not email header)
- [ ] Production secrets generated (not dev secrets)
- [ ] HTTPS enforced everywhere
- [ ] Security headers configured (Helmet)
- [ ] Rate limiting implemented (Redis-based)
- [ ] Input validation on all endpoints
- [ ] CORS configured for production domains only
- [ ] Database connections use SSL
- [ ] Error messages don't leak sensitive info
- [ ] Sessions are secure (httpOnly, secure, sameSite)
- [ ] Dependencies scanned for vulnerabilities
- [ ] Regular security audits scheduled

---

## 🔍 **Security Testing**

```bash
# Dependency scanning
npm audit
npm audit fix

# Use Snyk for deeper scanning
npm install -g snyk
snyk test

# OWASP ZAP for penetration testing
# Burp Suite for manual testing
```

---

**MBK: Security Hardening - Critical fixes for production**

Last updated: January 2025
