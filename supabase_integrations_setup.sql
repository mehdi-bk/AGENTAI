-- Table pour stocker les intégrations des utilisateurs
CREATE TABLE IF NOT EXISTS integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_integrations_user_id ON integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_integrations_provider ON integrations(provider);

-- Table pour la gestion d'équipe
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'member')),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'inactive')),
  invited_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, email)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_team_members_org_id ON team_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_email ON team_members(email);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour integrations
DROP TRIGGER IF EXISTS update_integrations_updated_at ON integrations;
CREATE TRIGGER update_integrations_updated_at
  BEFORE UPDATE ON integrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger pour team_members
DROP TRIGGER IF EXISTS update_team_members_updated_at ON team_members;
CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON team_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Politiques de sécurité RLS (Row Level Security)

-- Activer RLS
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Politiques pour integrations
DROP POLICY IF EXISTS "Users can view their own integrations" ON integrations;
CREATE POLICY "Users can view their own integrations"
  ON integrations FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own integrations" ON integrations;
CREATE POLICY "Users can insert their own integrations"
  ON integrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own integrations" ON integrations;
CREATE POLICY "Users can update their own integrations"
  ON integrations FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own integrations" ON integrations;
CREATE POLICY "Users can delete their own integrations"
  ON integrations FOR DELETE
  USING (auth.uid() = user_id);

-- Politiques pour team_members
DROP POLICY IF EXISTS "Users can view their organization members" ON team_members;
CREATE POLICY "Users can view their organization members"
  ON team_members FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM team_members WHERE user_id = auth.uid()
    )
    OR organization_id = auth.uid()
  );

DROP POLICY IF EXISTS "Admins can insert team members" ON team_members;
CREATE POLICY "Admins can insert team members"
  ON team_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM team_members AS tm
      WHERE tm.user_id = auth.uid() 
      AND tm.organization_id = organization_id 
      AND tm.role = 'admin'
    )
    OR organization_id = auth.uid()
  );

DROP POLICY IF EXISTS "Admins can update team members" ON team_members;
CREATE POLICY "Admins can update team members"
  ON team_members FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE user_id = auth.uid() 
      AND organization_id = team_members.organization_id 
      AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can delete team members" ON team_members;
CREATE POLICY "Admins can delete team members"
  ON team_members FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE user_id = auth.uid() 
      AND organization_id = team_members.organization_id 
      AND role = 'admin'
    )
  );

-- Commentaires pour documentation
COMMENT ON TABLE integrations IS 'Stocke les intégrations OAuth des utilisateurs (Google Calendar, Gmail, etc.)';
COMMENT ON TABLE team_members IS 'Gère les membres de l''équipe pour chaque organisation';
COMMENT ON COLUMN integrations.provider IS 'Nom du fournisseur (google_calendar, gmail, slack, etc.)';
COMMENT ON COLUMN integrations.access_token IS 'Token d''accès OAuth (chiffré en production)';
COMMENT ON COLUMN integrations.refresh_token IS 'Token de rafraîchissement OAuth';
COMMENT ON COLUMN team_members.role IS 'Rôle du membre (admin ou member)';
COMMENT ON COLUMN team_members.status IS 'Statut du membre (active, pending, inactive)';
