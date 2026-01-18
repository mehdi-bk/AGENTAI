-- ============================================
-- SUPABASE TABLE SETUP
-- 
-- SQL script to create tables in Supabase
-- MBK: Supabase table creation with RLS policies
-- ============================================

-- ============================================
-- OPTION 1: Clients Sync Table (Recommended)
-- ============================================
-- This table can be used to sync client data between Supabase auth and your backend
-- Or store client-specific data that needs to be in Supabase

CREATE TABLE IF NOT EXISTS public.clients_sync (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supabase_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255),
  company VARCHAR(255),
  backend_client_id VARCHAR(255), -- ID from your PostgreSQL backend
  synced_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_clients_sync_user_id ON public.clients_sync(supabase_user_id);
CREATE INDEX IF NOT EXISTS idx_clients_sync_email ON public.clients_sync(email);
CREATE INDEX IF NOT EXISTS idx_clients_sync_backend_id ON public.clients_sync(backend_client_id);

-- Enable RLS
ALTER TABLE public.clients_sync ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only see their own data
CREATE POLICY "Users can view their own client data"
  ON public.clients_sync FOR SELECT
  USING (auth.uid() = supabase_user_id);

-- Users can insert their own data
CREATE POLICY "Users can insert their own client data"
  ON public.clients_sync FOR INSERT
  WITH CHECK (auth.uid() = supabase_user_id);

-- Users can update their own data
CREATE POLICY "Users can update their own client data"
  ON public.clients_sync FOR UPDATE
  USING (auth.uid() = supabase_user_id);

-- ============================================
-- OPTION 2: Generic Table Template
-- ============================================
-- Use this if you need a different table

/*
CREATE TABLE IF NOT EXISTS public.your_table_name (
  id BIGSERIAL PRIMARY KEY,
  -- Add your columns here
  name VARCHAR(255),
  description TEXT,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes (add as needed)
CREATE INDEX IF NOT EXISTS idx_your_table_name_status ON public.your_table_name(status);

-- Enable RLS
ALTER TABLE public.your_table_name ENABLE ROW LEVEL SECURITY;

-- RLS Policies (customize based on your needs)
CREATE POLICY "Enable read access for authenticated users"
  ON public.your_table_name FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users"
  ON public.your_table_name FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users"
  ON public.your_table_name FOR UPDATE
  USING (auth.role() = 'authenticated');
*/

-- ============================================
-- HELPER FUNCTION: Auto-update updated_at
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to clients_sync
CREATE TRIGGER update_clients_sync_updated_at
  BEFORE UPDATE ON public.clients_sync
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- NOTES:
-- ============================================
-- 1. Use UUID for id if you want to reference auth.users
-- 2. Use BIGSERIAL (int8) for id if you don't need auth references
-- 3. Always enable RLS for security
-- 4. Create policies based on your access needs
-- 5. Add indexes for frequently queried columns
