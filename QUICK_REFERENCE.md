# ⚡ Quick Reference Card

**MBK: Quick reference for common tasks**

## 🚀 Starting the Application

```bash
# Terminal 1 - Backend
cd AGENTAI/backend
npm run dev

# Terminal 2 - Frontend
cd AGENTAI
npm run dev
```

**Access:**
- Frontend: http://localhost:5173
- Admin Panel: http://localhost:5173/admin/login
- Backend API: http://localhost:3001
- Prisma Studio: `cd backend && npx prisma studio` → http://localhost:5555

---

## 🗄️ Database Commands

```bash
# Connect to database
psql -U leadflow_admin -d leadflow_db -h localhost

# Run migrations
cd backend
npx prisma migrate deploy
npx prisma generate

# Open Prisma Studio (GUI)
npx prisma studio
```

---

## 👤 Create Admin User

```bash
cd AGENTAI/backend
node scripts/create-admin.js <email> <password> <fullName> <role>

# Example:
node scripts/create-admin.js admin@example.com SecurePass123! "Admin Name" SUPER_ADMIN
```

**Roles:** `SUPER_ADMIN`, `ADMIN`, `SUPPORT`

---

## 🔧 Environment Files

**Backend:** `AGENTAI/backend/.env`
- Copy from `backend/env.example`
- Set `DATABASE_URL`
- Generate JWT secrets (min 32 chars)

**Frontend:** `AGENTAI/.env.local`
- Set `VITE_API_BASE_URL=http://localhost:3001/api`

---

## 🐛 Common Issues

**Backend won't start:**
- Check PostgreSQL is running
- Verify `.env` file exists
- Check `DATABASE_URL` is correct

**Frontend can't connect:**
- Verify backend is running on port 3001
- Check `VITE_API_BASE_URL` in `.env.local`
- Check CORS settings

**Database errors:**
- Run migrations: `npx prisma migrate deploy`
- Check database exists: `psql -U leadflow_admin -d leadflow_db`

---

## 📊 Database Tables

- `admins` - Admin users
- `clients` - Client users
- `invoices` - Invoices
- `refunds` - Refunds
- `promo_codes` - Promotion codes
- `campaigns` - Client campaigns

**View all:** `\dt` in psql or use Prisma Studio

---

## 📝 Important Files

- `SETUP_GUIDE.md` - Complete setup instructions
- `OAUTH_SETUP.md` - OAuth configuration (Google & Azure)
- `SUPABASE_SETUP.md` - Supabase configuration
- `backend/.env` - Backend configuration
- `backend/prisma/schema.prisma` - Database schema
- `.env.local` - Frontend configuration

---

**For detailed instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)**
