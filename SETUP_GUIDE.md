# 🚀 Complete Setup Guide - LeadFlow Admin Panel

**MBK: Complete setup documentation for LeadFlow admin panel and client database**

This guide will help you set up the entire project from scratch on a new computer, including the backend, frontend, and database configuration.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Database Setup](#database-setup)
4. [Backend Setup](#backend-setup)
5. [Frontend Setup](#frontend-setup)
6. [Environment Variables](#environment-variables)
7. [Running the Application](#running-the-application)
8. [Database Administration](#database-administration)
9. [Creating Admin Users](#creating-admin-users)
10. [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

Before starting, ensure you have the following installed:

### Required Software

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version` and `npm --version`

2. **PostgreSQL** (v14 or higher)
   - **macOS**: `brew install postgresql@14`
   - **Windows**: Download from https://www.postgresql.org/download/windows/
   - **Linux**: `sudo apt-get install postgresql postgresql-contrib`
   - Verify installation: `psql --version`

3. **Git** (for cloning the repository)
   - Verify installation: `git --version`

### Optional but Recommended

- **PostgreSQL GUI Tool** (for easier database management):
  - **pgAdmin**: https://www.pgadmin.org/
  - **DBeaver**: https://dbeaver.io/
  - **TablePlus**: https://tableplus.com/

---

## 📁 Project Structure

```
AGENTAI/
├── backend/                 # Backend API server
│   ├── prisma/             # Database schema and migrations
│   ├── routes/             # API routes
│   ├── middleware/         # Security middleware
│   ├── scripts/           # Utility scripts
│   └── server.js          # Main server file
├── src/                    # Frontend React application
│   ├── app/               # React components and pages
│   ├── services/          # API service layers
│   └── contexts/          # React contexts
├── package.json           # Frontend dependencies
└── SETUP_GUIDE.md        # This file
```

---

## 🗄️ Database Setup

### Step 1: Install and Start PostgreSQL

**macOS (using Homebrew):**
```bash
# Install PostgreSQL
brew install postgresql@14

# Start PostgreSQL service
brew services start postgresql@14
```

**Linux:**
```bash
# Install PostgreSQL
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**Windows:**
- Install PostgreSQL using the installer from the official website
- PostgreSQL service should start automatically

### Step 2: Create Database and User

Open a terminal and connect to PostgreSQL:

```bash
# Connect to PostgreSQL as the default user
psql postgres
```

Once connected, run these SQL commands:

```sql
-- Create a new database user (replace 'your_password' with a strong password)
CREATE USER leadflow_admin WITH PASSWORD 'your_strong_password_here';

-- Create the database
CREATE DATABASE leadflow_db OWNER leadflow_admin;

-- Grant all privileges
GRANT ALL PRIVILEGES ON DATABASE leadflow_db TO leadflow_admin;

-- Connect to the new database
\c leadflow_db

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO leadflow_admin;

-- Exit psql
\q
```

### Step 3: Verify Database Connection

Test the connection:

```bash
# Connect to your database
psql -U leadflow_admin -d leadflow_db -h localhost

# If prompted for password, enter the password you set
# You should see: leadflow_db=>
# Type \q to exit
```

**Note:** Save your database credentials securely. You'll need them for the `.env` file.

---

## 🔙 Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd AGENTAI/backend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Express.js (web framework)
- Prisma (database ORM)
- JWT (authentication)
- Security middleware (helmet, cors, etc.)

### Step 3: Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
# Copy the example file
cp env.example .env
```

Edit the `.env` file with your actual values:

```env
# Server Configuration
NODE_ENV=development
PORT=3001
API_BASE_URL=http://localhost:3001

# Database Configuration
# Format: postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME
DATABASE_URL=postgresql://leadflow_admin:your_strong_password_here@localhost:5432/leadflow_db?schema=public

# JWT Configuration (IMPORTANT: Generate strong random secrets)
JWT_SECRET=your-super-secret-jwt-key-change-this-min-32-chars-random-string-here
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-min-32-chars-random-string-here
JWT_REFRESH_EXPIRES_IN=7d

# Bcrypt Configuration
BCRYPT_ROUNDS=12

# Session Configuration
SESSION_SECRET=your-super-secret-session-key-change-this-min-32-chars-random-string-here
SESSION_MAX_AGE=900000

# CSRF Configuration
CSRF_SECRET=your-super-secret-csrf-key-change-this-min-32-chars-random-string-here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=5

# 2FA Configuration
TOTP_ISSUER=LeadFlow Admin Panel

# Security Headers
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:3000
IP_WHITELIST_ENABLED=false
IP_WHITELIST=127.0.0.1,::1

# Brute Force Protection
BRUTE_FORCE_MAX_ATTEMPTS=5
BRUTE_FORCE_BLOCK_DURATION_MS=3600000

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/admin.log

# Email Configuration (Optional - for invoice emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@leadflow.com
```

**⚠️ IMPORTANT:** 
- Replace `your_strong_password_here` with your actual database password
- Generate strong random strings for all `*_SECRET` variables (minimum 32 characters)
- You can generate secrets using: `openssl rand -hex 32`

### Step 4: Run Database Migrations

Prisma will create all the database tables based on the schema:

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations to create database tables
npx prisma migrate deploy

# (Optional) View database in Prisma Studio
npx prisma studio
```

This will create all the necessary tables:
- `admins` - Admin users
- `admin_sessions` - Admin sessions
- `clients` - Client users
- `invoices` - Invoices
- `refunds` - Refunds
- `promo_codes` - Promotion codes
- `campaigns` - Client campaigns
- And more...

### Step 5: Create Logs Directory

```bash
mkdir -p logs
```

### Step 6: Test Backend Server

```bash
# Start the server in development mode
npm run dev

# Or start in production mode
npm start
```

You should see:
```
🚀 Serveur admin démarré sur le port 3001
🔒 Mode: development
📊 Base de données: Connectée
```

The backend API will be available at: `http://localhost:3001`

---

## 🎨 Frontend Setup

### Step 1: Navigate to Root Directory

```bash
cd AGENTAI
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all React dependencies including:
- React & React DOM
- React Router
- UI components (Radix UI)
- Tailwind CSS
- TypeScript

### Step 3: Configure Environment Variables

Create a `.env.local` file in the root `AGENTAI/` directory:

```bash
# Create .env.local file
touch .env.local
```

Add the following content:

```env
# API Base URL (Backend server)
VITE_API_BASE_URL=http://localhost:3001/api

# Supabase Configuration (if using Supabase for client auth)
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**Note:** The `VITE_` prefix is required for Vite to expose these variables to the frontend.

### Step 4: Test Frontend Server

```bash
# Start the development server
npm run dev
```

You should see:
```
  VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

The frontend will be available at: `http://localhost:5173`

---

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd AGENTAI/backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd AGENTAI
npm run dev
```

### Production Mode

**Build Frontend:**
```bash
cd AGENTAI
npm run build
```

**Start Backend:**
```bash
cd AGENTAI/backend
npm start
```

---

## 🗄️ Database Administration

### Accessing the Database

#### Using Command Line (psql)

```bash
# Connect to database
psql -U leadflow_admin -d leadflow_db -h localhost

# List all tables
\dt

# View table structure
\d table_name

# Run SQL queries
SELECT * FROM admins;
SELECT * FROM clients;

# Exit
\q
```

#### Using pgAdmin

1. Open pgAdmin
2. Add new server:
   - Name: LeadFlow Local
   - Host: localhost
   - Port: 5432
   - Database: leadflow_db
   - Username: leadflow_admin
   - Password: (your password)

#### Using Prisma Studio

```bash
cd AGENTAI/backend
npx prisma studio
```

This opens a web interface at `http://localhost:5555` where you can:
- View all tables
- Edit records
- Add new records
- Delete records

### Database Tables Overview

**Admin Tables:**
- `admins` - Admin user accounts
- `admin_sessions` - Active admin sessions
- `audit_logs` - Admin action logs
- `admin_actions` - Admin action tracking

**Client Tables:**
- `clients` - Client user accounts
- `campaigns` - Client campaigns
- `credit_transactions` - Credit purchase/usage history
- `login_history` - Client login history

**Business Tables:**
- `invoices` - Client invoices
- `refunds` - Refund requests
- `promo_codes` - Promotion codes
- `promo_code_usages` - Promo code usage tracking

**Security Tables:**
- `brute_force_attempts` - Failed login attempts tracking

### Common Database Queries

```sql
-- View all admins
SELECT id, email, fullName, role, isActive, createdAt FROM admins;

-- View all clients
SELECT id, email, fullName, company, subscriptionType, status, credits, createdAt FROM clients;

-- View recent invoices
SELECT id, invoiceNumber, amount, status, dueDate, createdAt 
FROM invoices 
ORDER BY createdAt DESC 
LIMIT 10;

-- View pending refunds
SELECT id, amount, reason, status, createdAt 
FROM refunds 
WHERE status = 'PENDING';

-- View active promo codes
SELECT code, discountType, discountValue, startDate, endDate, isActive 
FROM promo_codes 
WHERE isActive = true;
```

---

## 👤 Creating Admin Users

### Method 1: Using the Script (Recommended)

```bash
cd AGENTAI/backend
node scripts/create-admin.js
```

Follow the prompts to:
- Enter admin email
- Enter admin password
- Enter full name
- Select role (SUPER_ADMIN, ADMIN, or SUPPORT)

### Method 2: Using Prisma Studio

1. Start Prisma Studio: `npx prisma studio`
2. Navigate to `admins` table
3. Click "Add record"
4. Fill in the fields:
   - `email`: admin@example.com
   - `passwordHash`: (You need to hash the password first - see Method 3)
   - `fullName`: Admin Name
   - `role`: SUPER_ADMIN
   - `isActive`: true
5. Click "Save 1 change"

### Method 3: Using SQL (Manual)

First, hash a password using Node.js:

```bash
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('your_password', 12).then(hash => console.log(hash));"
```

Then insert into database:

```sql
INSERT INTO admins (id, email, "passwordHash", "fullName", role, "isActive", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'admin@example.com',
  '$2b$12$YOUR_HASHED_PASSWORD_HERE',
  'Admin Name',
  'SUPER_ADMIN',
  true,
  NOW(),
  NOW()
);
```

### Admin Roles

- **SUPER_ADMIN**: Full access to all features
- **ADMIN**: Standard admin access
- **SUPPORT**: Limited access for support tasks

---

## 🔐 Accessing the Admin Panel

1. **Start both servers** (backend and frontend)
2. **Navigate to:** `http://localhost:5173/admin/login`
3. **Login with your admin credentials**
4. **You'll have access to:**
   - Dashboard with statistics
   - Client management
   - Invoice management
   - Refund management
   - Promo code management

---

## 🐛 Troubleshooting

### Backend Issues

**Problem: Database connection error**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution:**
- Ensure PostgreSQL is running: `brew services list` (macOS) or `sudo systemctl status postgresql` (Linux)
- Check DATABASE_URL in `.env` file
- Verify database exists: `psql -U leadflow_admin -d leadflow_db -h localhost`

**Problem: Prisma migration errors**
```
Error: P3005: Database schema is not empty
```
**Solution:**
```bash
# Reset database (WARNING: This deletes all data)
npx prisma migrate reset

# Or apply migrations manually
npx prisma migrate deploy
```

**Problem: Port 3001 already in use**
```
Error: listen EADDRINUSE: address already in use :::3001
```
**Solution:**
```bash
# Find process using port 3001
lsof -i :3001

# Kill the process
kill -9 <PID>

# Or change PORT in .env file
```

### Frontend Issues

**Problem: Cannot connect to backend API**
```
Failed to fetch
```
**Solution:**
- Verify backend is running on port 3001
- Check `VITE_API_BASE_URL` in `.env.local`
- Check CORS settings in backend `server.js`
- Ensure backend allows your frontend origin

**Problem: Module not found errors**
```
Error: Cannot find module '@/app/...'
```
**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Verify tsconfig.json has correct path aliases
```

**Problem: White screen on load**
```
Blank page
```
**Solution:**
- Check browser console for errors
- Verify `main.tsx` and `App.tsx` are correct
- Check that React is properly installed: `npm list react react-dom`

### Database Issues

**Problem: Cannot connect to PostgreSQL**
```
psql: error: connection to server at "localhost" (127.0.0.1), port 5432 failed
```
**Solution:**
- Start PostgreSQL service
- Check PostgreSQL is listening: `netstat -an | grep 5432`
- Verify user and password in DATABASE_URL

**Problem: Permission denied errors**
```
ERROR: permission denied for table...
```
**Solution:**
```sql
-- Grant necessary permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO leadflow_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO leadflow_admin;
```

---

## 📝 Important Notes

### Security

- **Never commit `.env` files** to version control
- **Use strong passwords** for database and JWT secrets
- **Change default secrets** in production
- **Enable 2FA** for admin accounts in production
- **Regularly update dependencies**: `npm audit` and `npm update`

### Backup

**Backup Database:**
```bash
# Create backup
pg_dump -U leadflow_admin -d leadflow_db > backup_$(date +%Y%m%d).sql

# Restore backup
psql -U leadflow_admin -d leadflow_db < backup_20240117.sql
```

### Updates

**Update Prisma Schema:**
```bash
cd AGENTAI/backend
# Edit schema.prisma
npx prisma migrate dev --name your_migration_name
npx prisma generate
```

**Update Dependencies:**
```bash
# Backend
cd AGENTAI/backend
npm update

# Frontend
cd AGENTAI
npm update
```

---

## 📞 Support

If you encounter issues not covered in this guide:

1. Check the browser console for frontend errors
2. Check backend logs in `backend/logs/admin.log`
3. Verify all environment variables are set correctly
4. Ensure all services (PostgreSQL, Node.js) are running
5. Review the Prisma schema for database structure

---

## ✅ Quick Setup Checklist

- [ ] Node.js installed (v18+)
- [ ] PostgreSQL installed and running
- [ ] Database created (`leadflow_db`)
- [ ] Database user created (`leadflow_admin`)
- [ ] Backend `.env` file configured
- [ ] Backend dependencies installed
- [ ] Database migrations run
- [ ] Frontend `.env.local` file configured
- [ ] Frontend dependencies installed
- [ ] Admin user created
- [ ] Backend server running (port 3001)
- [ ] Frontend server running (port 5173)
- [ ] Can access admin panel at `/admin/login`

---

**MBK: Setup guide complete - All systems ready for development**

Last updated: January 2025
