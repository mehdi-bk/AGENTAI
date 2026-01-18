-- ============================================
-- USER PROFILES TABLE
-- 
-- Stores additional user profile data linked to Supabase Auth
-- MBK: User profiles table - DO NOT store passwords here!
-- ============================================

-- ============================================
-- IMPORTANT: Passwords are already in auth.users
-- ============================================
-- Supabase Auth already stores:
-- - email (in auth.users.email)
-- - password hash (in auth.users.encrypted_password)
-- - user metadata (in auth.users.raw_user_meta_data)
--
-- NEVER store passwords in plain text!
-- Use this table for additional profile data only.

-- ============================================
-- USER PROFILES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL, -- Denormalized for easy querying
  full_name VARCHAR(255),
  username VARCHAR(100) UNIQUE, -- Optional username
  avatar_url TEXT,
  phone VARCHAR(20), -- Phone number (required during signup)
  company VARCHAR(255),
  bio TEXT,
  preferences JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON public.user_profiles(username);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Policy: Users can view their own profile
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can view other users' public profiles (optional)
-- Uncomment if you want users to see each other's profiles
/*
CREATE POLICY "Users can view public profiles"
  ON public.user_profiles FOR SELECT
  USING (true); -- Allow all authenticated users to view
*/

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own profile
CREATE POLICY "Users can delete their own profile"
  ON public.user_profiles FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- FUNCTION: Auto-update updated_at
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_user_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_user_profiles_updated_at();

-- ============================================
-- FUNCTION: Auto-create profile on user signup
-- ============================================
-- This automatically creates a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, full_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- VIEW: User data with auth info
-- ============================================
-- This view combines auth.users and user_profiles
-- Use this to query user data easily

CREATE OR REPLACE VIEW public.user_data AS
SELECT 
  u.id as auth_user_id,
  u.email,
  u.email_confirmed_at,
  u.created_at as auth_created_at,
  u.last_sign_in_at,
  p.id as profile_id,
  p.full_name,
  p.username,
  p.avatar_url,
  p.phone,
  p.company,
  p.bio,
  p.preferences,
  p.metadata,
  p.created_at as profile_created_at,
  p.updated_at as profile_updated_at
FROM auth.users u
LEFT JOIN public.user_profiles p ON u.id = p.user_id;

-- Grant access to the view
GRANT SELECT ON public.user_data TO authenticated;

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON TABLE public.user_profiles IS 'Stores additional user profile data linked to Supabase Auth';
COMMENT ON COLUMN public.user_profiles.user_id IS 'References auth.users(id) - the Supabase auth user';
COMMENT ON COLUMN public.user_profiles.email IS 'Denormalized email from auth.users for easy querying';
COMMENT ON COLUMN public.user_profiles.username IS 'Optional username (different from email)';
COMMENT ON COLUMN public.user_profiles.preferences IS 'User preferences stored as JSON';
COMMENT ON COLUMN public.user_profiles.metadata IS 'Additional metadata stored as JSON';

-- ============================================
-- NOTES:
-- ============================================
-- 1. Passwords are stored in auth.users (encrypted)
-- 2. This table stores ADDITIONAL profile data only
-- 3. Email is denormalized for easier querying
-- 4. Profile is auto-created when user signs up
-- 5. Use the user_data view to query combined data
-- 6. RLS policies ensure users can only see/edit their own data
