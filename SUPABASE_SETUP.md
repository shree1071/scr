# Supabase Database Setup Guide

This guide will help you set up the database tables in Supabase for the ClearVoice application.

## Why Use Supabase Tables?

**Current Setup (localStorage):**
- ❌ Data only stored in browser (lost on clear cache)
- ❌ Not accessible across devices
- ❌ Limited storage capacity
- ❌ No real-time features
- ❌ No data backup

**With Supabase:**
- ✅ Persistent server-side storage
- ✅ Accessible from any device
- ✅ Unlimited storage capacity
- ✅ Real-time subscriptions
- ✅ Automatic backups
- ✅ Better security with RLS policies

## Step-by-Step Setup

### 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in your project details
5. Wait for the project to be created

### 2. Get Your Database Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy your:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (for client-side access)

### 3. Update Environment Variables

Create a `.env.local` file in your project root:

```bash
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_CLERK_PUBLISHABLE_KEY=your-clerk-key  # Already have this
```

### 4. Run the SQL Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the entire contents of `supabase-schema.sql`
4. Click **Run** (or press Ctrl+Enter)
5. Verify that all tables are created successfully

### 5. Verify Tables Created

Go to **Table Editor** in Supabase dashboard. You should see:
- ✅ `company_posts`
- ✅ `bmsit_surveys`
- ✅ `user_companies`

## Table Structure Overview

### 1. `company_posts`
Stores anonymous posts for each company.
- **Key Field:** `company_id` - isolates posts by company
- **Features:** Supports text posts, images, polls
- **Isolation:** Each company only sees their own posts

### 2. `bmsit_surveys`
Stores BMSIT lecturer survey responses.
- **Key Field:** `answers` (JSONB) - stores all 10 question answers
- **Features:** Aggregated results for analytics dashboard
- **Isolation:** All BMSIT surveys stored together (separate from companies)

### 3. `user_companies`
Maps users to their selected company (optional but recommended).
- **Key Field:** `user_id` - Clerk user ID
- **Features:** Track which company each user belongs to

## Row Level Security (RLS)

RLS policies are enabled to ensure:
- **Company Posts:** Users can only see posts from their company
- **BMSIT Surveys:** Survey data is accessible for aggregated results
- **Data Isolation:** Companies cannot see each other's data

**Note:** The current RLS policies allow broad access. For production, you should:
1. Integrate Clerk user IDs with Supabase
2. Add more restrictive policies based on user authentication
3. Use Supabase Auth or Clerk user IDs in policy checks

## Next Steps

After creating the tables:

1. **Update Storage Functions:** Modify `lib/storage.ts` to use Supabase instead of localStorage
2. **Test Data Isolation:** Verify companies can only see their own posts
3. **Test BMSIT Surveys:** Submit surveys and verify they appear in results
4. **Add Real-time:** Optionally add real-time subscriptions for live updates

## Troubleshooting

**Issue: RLS policies blocking queries**
- Check that RLS policies are correctly set
- Verify you're using the correct API key
- Check Supabase logs for error messages

**Issue: Data not showing up**
- Verify tables are created
- Check that data is being inserted correctly
- Review Supabase logs for errors

**Issue: Companies seeing each other's data**
- Verify RLS policies are active
- Check that queries filter by `company_id`
- Review policy conditions

## Production Considerations

1. **Add Indexes:** Additional indexes for performance
2. **Backup Strategy:** Set up automated backups
3. **Monitoring:** Enable Supabase monitoring and alerts
4. **Rate Limiting:** Implement rate limiting for API calls
5. **Soft Deletes:** Add `deleted_at` column for soft deletes
6. **Audit Logs:** Track all data changes for compliance

