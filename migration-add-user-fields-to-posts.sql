-- Migration: Add user fields to company_posts table
-- Run this if you already have the company_posts table created
-- This adds user_id, user_name, and user_initials columns

ALTER TABLE company_posts 
ADD COLUMN IF NOT EXISTS user_id TEXT,
ADD COLUMN IF NOT EXISTS user_name TEXT,
ADD COLUMN IF NOT EXISTS user_initials TEXT;

-- Create index for faster queries by user
CREATE INDEX IF NOT EXISTS idx_company_posts_user_id ON company_posts(user_id);

