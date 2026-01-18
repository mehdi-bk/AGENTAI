# OAuth Setup Guide - Google & Azure/Outlook

**MBK: Complete OAuth configuration guide for Google and Microsoft Azure authentication**

This guide covers setting up OAuth authentication with Google and Microsoft Azure (Outlook) for your LeadFlow application.

---

## 📋 Table of Contents

1. [Google OAuth Setup](#google-oauth-setup)
2. [Azure/Outlook OAuth Setup](#azureoutlook-oauth-setup)
3. [Supabase Configuration](#supabase-configuration)
4. [Troubleshooting OAuth Issues](#troubleshooting-oauth-issues)
5. [Account Management Fixes](#account-management-fixes)
6. [Onboarding Fixes](#onboarding-fixes)

---

## 🔵 Google OAuth Setup

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Configure OAuth consent screen first (if not done):
   - **User Type**: External (for public use)
   - **App name**: LeadFlow
   - **User support email**: Your email
   - **Developer contact**: Your email
   - **Scopes**: Add `email`, `profile`, `openid`
   - **Test users**: Add test emails (for testing phase)

6. Create OAuth Client ID:
   - **Application type**: Web application
   - **Name**: LeadFlow Web Client
   - **Authorized JavaScript origins**:
     ```
     http://localhost:5173
     https://your-domain.com
     ```
   - **Authorized redirect URIs**:
     ```
     https://your-project-id.supabase.co/auth/v1/callback
     http://localhost:5173/auth/callback
     https://your-domain.com/auth/callback
     ```

7. **Save the credentials**:
   - **Client ID**: `xxxxx.apps.googleusercontent.com`
   - **Client Secret**: `xxxxx` (keep this secure!)

### Step 2: Configure in Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers**
3. Find **Google** and click to configure
4. Enable Google provider
5. Enter your credentials:
   - **Client ID (for OAuth)**: Paste your Google Client ID
   - **Client Secret (for OAuth)**: Paste your Google Client Secret
6. Click **Save**

### Step 3: Update Redirect URLs

In Supabase **Authentication** → **URL Configuration**:

**Redirect URLs** (add these):
```
http://localhost:5173/auth/callback
https://your-domain.com/auth/callback
```

---

## 🔷 Azure/Outlook OAuth Setup

### Step 1: Register Application in Azure Portal

1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to **Azure Active Directory** → **App registrations**
3. Click **New registration**
4. Fill in the details:
   - **Name**: LeadFlow
   - **Supported account types**: 
     - Choose based on your needs:
       - "Accounts in any organizational directory and personal Microsoft accounts" (recommended)
   - **Redirect URI**:
     - Type: **Web**
     - URI: `https://your-project-id.supabase.co/auth/v1/callback`
5. Click **Register**

### Step 2: Configure API Permissions

1. In your app registration, go to **API permissions**
2. Click **Add a permission**
3. Select **Microsoft Graph**
4. Choose **Delegated permissions**
5. Add these permissions:
   - `email`
   - `openid`
   - `profile`
   - `offline_access`
   - `User.Read`
6. Click **Add permissions**
7. **Important**: Click **Grant admin consent** if you're an admin

### Step 3: Create Client Secret

1. Go to **Certificates & secrets**
2. Click **New client secret**
3. Add description: "LeadFlow OAuth Secret"
4. Choose expiration (recommended: 24 months)
5. Click **Add**
6. **IMPORTANT**: Copy the secret value immediately (you won't see it again!)
   - Save it securely

### Step 4: Get Application (Client) ID

1. In **Overview** of your app registration
2. Copy the **Application (client) ID**
3. Copy the **Directory (tenant) ID** (optional, for single-tenant)

### Step 5: Configure in Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers**
3. Find **Azure** and click to configure
4. Enable Azure provider
5. Enter your credentials:
   - **Client ID (for OAuth)**: Your Azure Application (client) ID
   - **Client Secret (for OAuth)**: Your Azure client secret
   - **Tenant ID** (optional): Leave empty for multi-tenant, or enter your tenant ID
6. Click **Save**

### Step 6: Update Redirect URLs

In Supabase **Authentication** → **URL Configuration**:

**Redirect URLs** (add these):
```
http://localhost:5173/auth/callback
https://your-domain.com/auth/callback
```

---

## ⚙️ Supabase Configuration

### Required Settings

1. **Authentication** → **URL Configuration**:
   - **Site URL**: `http://localhost:5173` (dev) or `https://your-domain.com` (prod)
   - **Redirect URLs**: Add all callback URLs

2. **Authentication** → **Providers**:
   - Enable **Email** (for OTP login)
   - Enable **Google** (with credentials)
   - Enable **Azure** (with credentials)

3. **Authentication** → **Settings**:
   - **Enable email confirmations**: ✅ (recommended)
   - **Enable email change confirmations**: ✅ (recommended)

### Environment Variables

Make sure your `.env.local` has:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_URL=http://localhost:5173
```

---

## 🔧 Troubleshooting OAuth Issues

### Issue: "Redirect URI mismatch"

**Solution:**
- Verify redirect URIs match exactly in:
  1. Google Cloud Console / Azure Portal
  2. Supabase Authentication → URL Configuration
  3. Your application code (check `authService.ts`)

**Common mistakes:**
- Trailing slashes (`/` vs no `/`)
- `http` vs `https`
- Missing `/auth/callback` path

### Issue: "Invalid client" or "Client ID not found"

**Solution:**
- Double-check Client ID in Supabase matches Google/Azure
- Ensure OAuth provider is enabled in Supabase
- Verify credentials are copied correctly (no extra spaces)

### Issue: OAuth redirects but user not logged in

**Solution:**
1. Check browser console for errors
2. Verify `AuthCallbackPage` is handling the callback correctly
3. Check Supabase Auth logs in dashboard
4. Ensure session is being stored properly

### Issue: "Access denied" or "Consent required"

**Solution:**
- For Google: Add test users in OAuth consent screen (testing phase)
- For Azure: Grant admin consent for API permissions
- Check scopes are correctly configured

### Issue: Multiple accounts issue

**Solution:**
The code includes `prompt: 'select_account'` to force account selection. If users are still having issues:

1. Clear browser cookies for the domain
2. Use incognito/private mode to test
3. Check that `signOut({ scope: 'global' })` is called before OAuth

---

## 👤 Account Management Fixes

### Problem: Users can't manage their OAuth accounts

**Solution implemented in code:**

The `AuthCallbackPage` component handles OAuth callbacks properly:

```typescript
// In AuthCallbackPage.tsx
// The component waits for Supabase to complete OAuth authentication
// Then redirects to dashboard or onboarding
```

**If issues persist:**

1. Check that `AuthCallbackPage` route is configured:
   ```typescript
   <Route path="/auth/callback" element={<AuthCallbackPage />} />
   ```

2. Verify redirect URL in OAuth providers matches:
   ```
   http://localhost:5173/auth/callback
   ```

3. Check Supabase logs for authentication errors

### Problem: OAuth users not completing onboarding

**Solution:**

The `OnboardingRoute` component checks if user has completed onboarding:

```typescript
// Users redirected to /onboarding if metadata missing
// After completing onboarding, they can access dashboard
```

**To fix manually:**

1. Go to Supabase → Authentication → Users
2. Find the user
3. Check `user_metadata` - should have:
   - `fullName`
   - `company` (optional)
   - `industry` (optional)
4. If missing, user will be redirected to onboarding

---

## 🚀 Onboarding Fixes

### Problem: OAuth users skip onboarding

**Solution implemented:**

The `OnboardingRoute` wrapper checks user metadata:

```typescript
// If user_metadata.fullName is missing
// User is redirected to /onboarding
```

**Manual fix:**

If a user bypassed onboarding, you can:

1. **Option 1**: Delete user and have them sign up again
2. **Option 2**: Manually add metadata in Supabase:
   ```sql
   UPDATE auth.users
   SET raw_user_meta_data = jsonb_build_object(
     'fullName', 'User Name',
     'company', 'Company Name',
     'industry', 'Industry'
   )
   WHERE id = 'user-uuid-here';
   ```

### Problem: Onboarding form not submitting

**Check:**

1. Verify `OnboardingPage` component is working
2. Check browser console for errors
3. Verify Supabase connection
4. Check that `updateUser` function in `authService.ts` is working

---

## ✅ Testing OAuth

### Test Google OAuth

1. Start your dev server: `npm run dev`
2. Go to `/login` or `/signup`
3. Click "Continue with Google"
4. Select a Google account
5. Should redirect to `/auth/callback`
6. Then redirect to `/dashboard` or `/onboarding`

### Test Azure/Outlook OAuth

1. Start your dev server: `npm run dev`
2. Go to `/login` or `/signup`
3. Click "Continue with Outlook"
4. Sign in with Microsoft account
5. Should redirect to `/auth/callback`
6. Then redirect to `/dashboard` or `/onboarding`

### Verify in Supabase

1. Go to **Authentication** → **Users**
2. You should see the new user
3. Check **Identity** tab - should show Google/Azure provider
4. Check **Metadata** - should have user information

---

## 🔒 Security Best Practices

1. **Never commit secrets**:
   - Google Client Secret
   - Azure Client Secret
   - Supabase Service Role Key

2. **Use environment variables**:
   - Store secrets in `.env.local` (not committed)
   - Use `.env.example` for template (without real values)

3. **Restrict redirect URIs**:
   - Only add production URLs in production
   - Remove test URLs before going live

4. **Rotate secrets regularly**:
   - Update OAuth secrets every 6-12 months
   - Update Supabase keys if compromised

5. **Monitor OAuth usage**:
   - Check Supabase Auth logs regularly
   - Monitor for suspicious activity
   - Set up alerts for failed authentications

---

## 📝 Quick Checklist

**Google OAuth:**
- [ ] Google Cloud project created
- [ ] OAuth consent screen configured
- [ ] OAuth client ID created
- [ ] Redirect URIs added in Google Console
- [ ] Credentials added to Supabase
- [ ] Google provider enabled in Supabase

**Azure OAuth:**
- [ ] Azure app registration created
- [ ] API permissions added (email, profile, openid)
- [ ] Client secret created
- [ ] Redirect URI added in Azure
- [ ] Credentials added to Supabase
- [ ] Azure provider enabled in Supabase

**General:**
- [ ] Redirect URLs configured in Supabase
- [ ] Environment variables set
- [ ] OAuth tested successfully
- [ ] Onboarding flow works for OAuth users
- [ ] Account management works

---

## 🆘 Need Help?

If you encounter issues:

1. Check Supabase **Authentication** → **Logs** for errors
2. Check browser console for JavaScript errors
3. Verify all redirect URIs match exactly
4. Test in incognito mode to rule out cookie issues
5. Check that OAuth providers are enabled in Supabase

---

**MBK: OAuth setup guide complete - All authentication methods configured**

Last updated: January 2025
