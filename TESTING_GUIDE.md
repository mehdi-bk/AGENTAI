# 🧪 Testing Guide - Client Sync & Dashboard Integration

**MBK: Complete testing guide for the new features**

---

## ✅ What Was Fixed

### 1. **Client Sync** ✅
- Created `/api/clients/sync` endpoint
- Automatically creates Client record when user completes onboarding
- Syncs on OAuth callback for existing users
- Client records now appear in admin panel

### 2. **API Endpoints Created** ✅
- `/api/client/dashboard/stats` - Dashboard statistics
- `/api/client/campaigns` - List/create campaigns
- `/api/client/campaigns/:id` - Get/update campaign
- `/api/client/activities` - Recent activities
- `/api/client/prospects` - Prospects (placeholder)
- `/api/client/meetings` - Meetings (placeholder)

### 3. **Frontend Integration** ✅
- Created `dashboardService.ts` for API calls
- Connected `DashboardHome.tsx` to real APIs
- Connected `CampaignsPage.tsx` to real APIs
- Removed all hardcoded demo data
- Added empty states and loading indicators

---

## 🧪 How to Test

### Step 1: Start the Backend

```bash
cd /Users/mehdibenkhadra/Documents/AIAGENT/AGENTAI/backend
npm start
# or
node server.js
```

The backend should start on `http://localhost:3001`

### Step 2: Start the Frontend

```bash
cd /Users/mehdibenkhadra/Documents/AIAGENT/AGENTAI
npm run dev
```

The frontend should start on `http://localhost:5173`

### Step 3: Test Client Sync

1. **Sign up a new user:**
   - Go to `http://localhost:5173/signup`
   - Enter an email (e.g., `test@example.com`)
   - Complete the OTP verification
   - Complete the onboarding form

2. **Verify in Admin Panel:**
   - Go to `http://localhost:5173/admin/login`
   - Login as admin
   - Navigate to "Clients" page
   - You should see the new user with:
     - Email: `test@example.com`
     - Status: `ACTIVE`
     - Subscription: `STARTER`
     - Credits: `0`

3. **Check Backend Database:**
   ```bash
   # Using Prisma Studio
   cd backend
   npx prisma studio
   ```
   - Navigate to `clients` table
   - Verify the new client record exists

### Step 4: Test Dashboard

1. **Login as the new client:**
   - Go to `http://localhost:5173/login`
   - Login with the email you used
   - You should be redirected to `/dashboard`

2. **Check Dashboard Stats:**
   - Dashboard should show:
     - Campagnes actives: `0`
     - Rendez-vous réservés: `0`
     - Taux de réponse: `0%`
     - Crédits disponibles: `0`
   - No errors should appear
   - Empty states should show properly

3. **Test Campaign Creation:**
   - Go to `/dashboard/campaigns`
   - Click "Create Campaign"
   - Fill in the form:
     - Name: "Test Campaign"
     - Target Industry: "SaaS"
     - Campaign Goal: "Book Meetings"
   - Click "Create Campaign"
   - The campaign should appear in the list

4. **Verify Campaign in Admin Panel:**
   - Go to admin panel
   - Navigate to the client's detail page
   - Check "Campaigns" section
   - The new campaign should be listed

### Step 5: Test API Directly (Optional)

You can test the API endpoints directly using curl or Postman:

```bash
# Get dashboard stats (replace EMAIL with actual client email)
curl -X GET "http://localhost:3001/api/client/dashboard/stats" \
  -H "X-Client-Email: test@example.com" \
  -H "Content-Type: application/json"

# List campaigns
curl -X GET "http://localhost:3001/api/client/campaigns" \
  -H "X-Client-Email: test@example.com" \
  -H "Content-Type: application/json"

# Create a campaign
curl -X POST "http://localhost:3001/api/client/campaigns" \
  -H "X-Client-Email: test@example.com" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Campaign",
    "status": "DRAFT",
    "goal": "meetings",
    "targetIndustry": "saas"
  }'
```

---

## 🔍 Troubleshooting

### Issue: Client not appearing in admin panel

**Check:**
1. Backend is running on port 3001
2. Database connection is working
3. Check backend logs for errors
4. Verify the sync endpoint was called (check network tab in browser)

**Fix:**
- Check if the sync endpoint returned success
- Verify the email matches exactly
- Check database directly with Prisma Studio

### Issue: Dashboard shows errors

**Check:**
1. Frontend can reach backend API
2. Client email is being sent in `X-Client-Email` header
3. Client record exists in database
4. Check browser console for errors

**Fix:**
- Verify `VITE_API_BASE_URL` in frontend `.env`
- Check CORS settings in backend
- Verify Supabase session is active

### Issue: Campaign creation fails

**Check:**
1. Client is authenticated
2. Client record exists
3. Backend logs for validation errors

**Fix:**
- Check form data is being sent correctly
- Verify campaign name is provided
- Check database constraints

---

## 📊 Expected Results

### After Signup:
- ✅ Client record created in PostgreSQL
- ✅ Client appears in admin panel
- ✅ Client can login and access dashboard

### Dashboard:
- ✅ Shows real stats (0 for new users)
- ✅ Shows empty states when no data
- ✅ No hardcoded demo data
- ✅ Loading states work properly

### Campaigns:
- ✅ Can create new campaigns
- ✅ Campaigns appear in list
- ✅ Campaigns visible in admin panel
- ✅ Campaign status can be updated

---

## 🚀 Next Steps

1. **Add Authentication:**
   - Currently using email header (not secure)
   - Should verify Supabase JWT token
   - Add proper authentication middleware

2. **Implement Prospects:**
   - Create prospects table
   - Add prospects API endpoints
   - Connect prospects page

3. **Implement Meetings:**
   - Create meetings table
   - Add meetings API endpoints
   - Connect meetings page

4. **Add Real Analytics:**
   - Track campaign performance
   - Calculate real response rates
   - Generate chart data

5. **Error Handling:**
   - Add error boundaries
   - Better error messages
   - Retry logic for failed requests

---

## 📝 Notes

- **Security:** The current implementation uses email header for client identification. In production, you should:
  - Verify Supabase JWT tokens
  - Add proper authentication middleware
  - Validate client ownership of resources

- **Performance:** Consider adding:
  - Caching for dashboard stats
  - Pagination for campaigns list
  - Optimistic updates for better UX

- **Testing:** Add:
  - Unit tests for API endpoints
  - Integration tests for client flow
  - E2E tests for complete user journey

---

**MBK: Testing guide complete - Ready for validation**

Last updated: January 2025
