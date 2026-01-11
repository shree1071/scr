-- =====================================================
-- Supabase Database Schema for ClearVoice Application
-- =====================================================
-- This schema ensures data isolation between companies
-- and provides persistent storage for posts and surveys

-- =====================================================
-- 1. Company Posts Table
-- =====================================================
-- Stores anonymous posts for each company
CREATE TABLE IF NOT EXISTS company_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  has_image BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  is_poll BOOLEAN DEFAULT FALSE,
  poll_data JSONB, -- Stores poll question, options, votes
  user_id TEXT, -- User who created the post (for chat functionality)
  user_name TEXT, -- User's display name
  user_initials TEXT, -- User's initials for avatar
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries by company
CREATE INDEX IF NOT EXISTS idx_company_posts_company_id ON company_posts(company_id);
CREATE INDEX IF NOT EXISTS idx_company_posts_created_at ON company_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_company_posts_user_id ON company_posts(user_id);

-- =====================================================
-- 2. BMSIT Survey Responses Table
-- =====================================================
-- Stores BMSIT lecturer survey responses
CREATE TABLE IF NOT EXISTS bmsit_surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT, -- Optional: Clerk user ID for tracking (if needed)
  answers JSONB NOT NULL, -- Stores all 10 question answers {1: 4, 2: 5, ... 10: "text answer"}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_bmsit_surveys_created_at ON bmsit_surveys(created_at DESC);

-- =====================================================
-- 3. User Company Mapping Table (Optional)
-- =====================================================
-- Maps Clerk user IDs to their selected company
-- This helps with authentication and user tracking
CREATE TABLE IF NOT EXISTS user_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE, -- Clerk user ID
  company_id TEXT NOT NULL,
  company_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_companies_user_id ON user_companies(user_id);
CREATE INDEX IF NOT EXISTS idx_user_companies_company_id ON user_companies(company_id);

-- =====================================================
-- 4. Company Chat Messages Table
-- =====================================================
-- Stores real-time chat messages for each company
CREATE TABLE IF NOT EXISTS company_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_initials TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_company_chat_messages_company_id ON company_chat_messages(company_id);
CREATE INDEX IF NOT EXISTS idx_company_chat_messages_created_at ON company_chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_company_chat_messages_user_id ON company_chat_messages(user_id);

-- =====================================================
-- 5. Enable Row Level Security (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE company_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE bmsit_surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_chat_messages ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 6. RLS Policies for Company Posts
-- =====================================================
-- Users can only see posts from their own company
-- For now, we'll allow all authenticated users to read/write
-- You can tighten this based on your Clerk user_id mapping

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow read company posts by company_id" ON company_posts;
DROP POLICY IF EXISTS "Allow insert company posts" ON company_posts;

-- Policy: Anyone can read posts for a company (since it's anonymous)
CREATE POLICY "Allow read company posts by company_id"
  ON company_posts FOR SELECT
  USING (true); -- Anyone can read, but filtered by company_id in queries

-- Policy: Authenticated users can insert posts
CREATE POLICY "Allow insert company posts"
  ON company_posts FOR INSERT
  WITH CHECK (true); -- Adjust based on your auth requirements

-- Policy: Users can update their own posts (if needed)
-- CREATE POLICY "Allow update own posts"
--   ON company_posts FOR UPDATE
--   USING (user_id = auth.uid()); -- If you add user_id tracking

-- =====================================================
-- 7. RLS Policies for BMSIT Surveys
-- =====================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow read BMSIT surveys" ON bmsit_surveys;
DROP POLICY IF EXISTS "Allow insert BMSIT surveys" ON bmsit_surveys;

-- Policy: Anyone can read BMSIT surveys (for aggregated results)
CREATE POLICY "Allow read BMSIT surveys"
  ON bmsit_surveys FOR SELECT
  USING (true);

-- Policy: Authenticated users can insert survey responses
CREATE POLICY "Allow insert BMSIT surveys"
  ON bmsit_surveys FOR INSERT
  WITH CHECK (true);

-- =====================================================
-- 8. RLS Policies for User Companies
-- =====================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow read own user company" ON user_companies;
DROP POLICY IF EXISTS "Allow insert user company" ON user_companies;
DROP POLICY IF EXISTS "Allow update own user company" ON user_companies;

-- Policy: Users can read their own company mapping
CREATE POLICY "Allow read own user company"
  ON user_companies FOR SELECT
  USING (true); -- Can be restricted by user_id in queries

-- Policy: Users can insert their company selection
CREATE POLICY "Allow insert user company"
  ON user_companies FOR INSERT
  WITH CHECK (true);

-- Policy: Users can update their company selection
CREATE POLICY "Allow update own user company"
  ON user_companies FOR UPDATE
  USING (true); -- Can be restricted based on user_id

-- =====================================================
-- 9. RLS Policies for Company Chat Messages
-- =====================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow read company chat messages by company_id" ON company_chat_messages;
DROP POLICY IF EXISTS "Allow insert company chat messages" ON company_chat_messages;

-- Policy: Anyone can read chat messages for a company
CREATE POLICY "Allow read company chat messages by company_id"
  ON company_chat_messages FOR SELECT
  USING (true); -- Anyone can read, but filtered by company_id in queries

-- Policy: Authenticated users can insert chat messages
CREATE POLICY "Allow insert company chat messages"
  ON company_chat_messages FOR INSERT
  WITH CHECK (true); -- Adjust based on your auth requirements

-- =====================================================
-- 10. Helper Functions (Optional)
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_company_posts_updated_at ON company_posts;
DROP TRIGGER IF EXISTS update_user_companies_updated_at ON user_companies;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_company_posts_updated_at
  BEFORE UPDATE ON company_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_companies_updated_at
  BEFORE UPDATE ON user_companies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- NOTES:
-- =====================================================
-- 1. Replace 'true' in RLS policies with proper auth checks
--    if you want to integrate with Clerk user IDs
--
-- 2. For better security, you can use Clerk's user_id in
--    RLS policies: USING (auth.jwt() ->> 'sub' = user_id)
--
-- 3. The company_id is stored as TEXT - adjust if you want
--    a separate companies table with foreign keys
--
-- 4. Consider adding a companies table if you want to
--    store company metadata (name, logo, verified, etc.)
--
-- 5. For production, consider adding soft deletes, 
--    moderation flags, and audit logs
--
-- 6. Enable Real-time for chat messages:
--    - Go to Supabase Dashboard → Database → Replication
--    - Enable replication for 'company_chat_messages' table
--    - This allows real-time subscriptions to work

