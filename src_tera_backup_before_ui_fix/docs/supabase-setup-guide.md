# Supabase Setup Guide for APU VOTE

## Quick Start (5 Minutes)

This guide will help you set up your Supabase backend for the APU VOTE blockchain e-voting platform.

---

## Prerequisites

- [ ] Supabase account (sign up at https://supabase.com)
- [ ] Node.js installed (v18 or higher)
- [ ] Supabase CLI installed: `npm install -g supabase`

---

## Step 1: Create Supabase Project

1. Go to https://app.supabase.com
2. Click **"New Project"**
3. Fill in project details:
   - **Name:** APU-VOTE-Production
   - **Database Password:** (Save this securely!)
   - **Region:** Choose nearest to your users
4. Click **"Create new project"** (takes ~2 minutes)

---

## Step 2: Get Your API Keys

1. In your project dashboard, go to **Settings** → **API**
2. Copy these values:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Create `.env` file in your project root:

```bash
# .env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# DO NOT expose service role key to frontend!
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

---

## Step 3: Run Database Migrations

### Option A: Using SQL Editor (Easiest)

1. Go to **SQL Editor** in Supabase Dashboard
2. Copy contents of `/supabase/migrations/001_initial_schema.sql`
3. Paste and click **"Run"**
4. Repeat for `002_row_level_security.sql`
5. Repeat for `003_seed_data.sql` (optional, for testing)

### Option B: Using Supabase CLI

```bash
# Initialize Supabase in your project
supabase init

# Link to your remote project
supabase link --project-ref your-project-id

# Push migrations to Supabase
supabase db push
```

---

## Step 4: Enable Email Authentication

### 4.1 Enable Email Provider

1. Go to **Authentication** → **Providers**
2. Click **Email**
3. Toggle **"Enable Email provider"** ON
4. Click **"Save"**

### 4.2 Configure Email Templates

1. Go to **Authentication** → **Email Templates**
2. Customize the **"Confirm signup"** template:

```html
<h2>Confirm Your APU VOTE Account</h2>

<p>Hi {{ .Email }},</p>

<p>Welcome to APU VOTE! Please verify your email address to activate your account.</p>

<p><a href="{{ .ConfirmationURL }}">Verify Email Address</a></p>

<p>This link will expire in 24 hours.</p>

<p>If you didn't sign up for APU VOTE, please ignore this email.</p>

<p>Best regards,<br>APU VOTE Team</p>
```

3. Click **"Save"**

### 4.3 Configure Site URL

1. Go to **Authentication** → **URL Configuration**
2. Set:
   - **Site URL:** `http://localhost:5173` (development) or `https://your-domain.com` (production)
   - **Redirect URLs:** Add both development and production URLs

```
http://localhost:5173/**
https://your-domain.com/**
```

---

## Step 5: Create Your First Admin User

### 5.1 Sign Up as Admin

1. In your React app, go to the signup page
2. Fill in the form with admin details:
   - **Full Name:** Admin User
   - **Email:** admin@mail.apu.edu.my
   - **TP Number:** TP999999
   - **Department:** School of Computing
   - **Year:** 4
   - **Password:** (Strong password)

3. Click **"Sign Up"**
4. Check email and verify account

### 5.2 Grant Admin Permissions

1. Go to Supabase Dashboard → **SQL Editor**
2. Find your user ID:

```sql
SELECT id, email, email_confirmed_at
FROM auth.users
WHERE email = 'admin@mail.apu.edu.my';
```

3. Copy the `id` (UUID)
4. Grant admin permissions:

```sql
INSERT INTO public.admins (user_id, role, permissions, is_active)
VALUES (
  'paste-user-id-here',
  'super_admin',
  ARRAY[
    'manage_elections',
    'manage_candidates',
    'manage_categories',
    'manage_users',
    'view_results',
    'publish_results',
    'system_settings',
    'super_admin'
  ]::admin_permission[],
  TRUE
);
```

5. Click **"Run"**
6. ✅ You now have admin access!

---

## Step 6: Test Email Verification Flow

### Development (Local)

If using local Supabase:

```bash
# Start local Supabase
supabase start

# Emails will be caught by Inbucket
# View them at: http://localhost:54324
```

### Production

1. Sign up a test user
2. Check email inbox (including spam)
3. Click verification link
4. Verify user is marked as verified:

```sql
SELECT id, email, is_verified
FROM public.users
WHERE email = 'test@example.com';
```

---

## Step 7: Configure Real-Time Subscriptions (Optional)

For live vote counts:

1. Go to **Database** → **Replication**
2. Enable replication for:
   - `public.votes`
   - `public.candidates`
   - `public.elections`

3. In your frontend:

```typescript
// Subscribe to vote changes
const subscription = supabase
  .channel('votes-channel')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'votes' },
    (payload) => {
      console.log('New vote cast:', payload);
      // Update UI with new vote
    }
  )
  .subscribe();
```

---

## Step 8: Update Frontend Environment Variables

Create `/utils/supabase/client.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

## Step 9: Test Database Connection

Create a test file:

```typescript
// test-connection.ts
import { supabase } from './utils/supabase/client';

async function testConnection() {
  // Test 1: Check connection
  const { data, error } = await supabase.from('elections').select('*');
  
  if (error) {
    console.error('❌ Connection failed:', error);
  } else {
    console.log('✅ Connection successful!');
    console.log('Elections:', data);
  }

  // Test 2: Check auth
  const { data: { user } } = await supabase.auth.getUser();
  console.log('Current user:', user);
}

testConnection();
```

Run:

```bash
npm run dev
```

---

## Step 10: Verify Row Level Security

Test RLS policies:

```typescript
// Test as anonymous user (should fail)
const { data, error } = await supabase
  .from('votes')
  .insert({
    user_id: 'some-id',
    candidate_id: 'some-id',
    category_id: 'some-id',
    election_id: 'some-id',
  });

// Expected: error.message = "new row violates row-level security policy"

// Test as authenticated verified user (should succeed)
await supabase.auth.signInWithPassword({
  email: 'verified@user.com',
  password: 'password',
});

// Now voting should work
```

---

## Common Issues & Solutions

### Issue 1: "Email not sending"

**Solution:**
- Check **Authentication** → **Settings** → Email provider is enabled
- Verify **Site URL** is correct
- Check spam folder
- For production, configure custom SMTP (optional)

### Issue 2: "RLS policy prevents insert"

**Solution:**
- Verify user is authenticated: `supabase.auth.getUser()`
- Check `is_verified = true` in users table
- Ensure election is active and within time range

### Issue 3: "Cannot update votes"

**Solution:**
- This is by design! Votes are immutable for security
- Only super admins can delete votes (emergency only)

### Issue 4: "User profile not created"

**Solution:**
- Check trigger `on_auth_user_created` exists:

```sql
SELECT tgname FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

- Manually create profile if needed:

```sql
INSERT INTO public.users (id, email, full_name, tp_number, department, year_of_study)
VALUES (
  'auth-user-id',
  'user@email.com',
  'Full Name',
  'TP123456',
  'School of Computing',
  2
);
```

---

## Production Checklist

Before going live:

- [ ] Run all migrations on production database
- [ ] Enable RLS on all tables
- [ ] Configure custom email domain (optional)
- [ ] Set production Site URL and Redirect URLs
- [ ] Create admin accounts with proper permissions
- [ ] Test signup → verification → login flow
- [ ] Test voting flow end-to-end
- [ ] Enable database backups (Supabase does this automatically)
- [ ] Set up monitoring alerts
- [ ] Test RLS policies with different user roles
- [ ] Verify visitor limits work correctly
- [ ] Test results locking/unlocking
- [ ] Document admin procedures

---

## Database Backup & Recovery

### Automatic Backups

Supabase automatically backs up your database daily (Pro plan and above).

### Manual Backup

```bash
# Using Supabase CLI
supabase db dump -f backup-$(date +%Y%m%d).sql

# Using pg_dump directly
pg_dump -h db.your-project-id.supabase.co \
  -U postgres \
  -d postgres \
  -f backup.sql
```

### Restore from Backup

```bash
# Using psql
psql -h db.your-project-id.supabase.co \
  -U postgres \
  -d postgres \
  -f backup.sql
```

---

## Monitoring & Analytics

### View Active Users

```sql
SELECT 
  DATE(created_at) as date,
  COUNT(*) as new_users
FROM public.users
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

### View Vote Activity

```sql
SELECT 
  DATE(voted_at) as date,
  COUNT(*) as votes_cast,
  COUNT(DISTINCT user_id) as unique_voters
FROM public.votes
GROUP BY DATE(voted_at)
ORDER BY date DESC;
```

### View Top Candidates

```sql
SELECT 
  c.candidate_name,
  cat.category_name,
  c.vote_count,
  ROUND(c.vote_count * 100.0 / NULLIF(SUM(c.vote_count) OVER (PARTITION BY c.category_id), 0), 2) as percentage
FROM public.candidates c
JOIN public.categories cat ON c.category_id = cat.id
WHERE c.is_approved = TRUE
ORDER BY cat.display_order, c.vote_count DESC;
```

---

## Performance Optimization

### Enable Connection Pooling

In production, use connection pooling:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    db: {
      schema: 'public',
    },
    auth: {
      persistSession: true,
    },
  }
);
```

### Index Optimization

Check slow queries:

```sql
-- View slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

---

## Security Best Practices

1. **Never expose Service Role Key** in frontend
2. **Always use RLS policies** - never disable them
3. **Validate inputs** in application layer
4. **Rate limit API calls** (use Supabase Edge Functions)
5. **Monitor for suspicious activity** (multiple votes, rapid requests)
6. **Use HTTPS only** in production
7. **Regularly update dependencies**
8. **Audit admin actions** (use audit_logs table)

---

## Support Resources

- **Supabase Docs:** https://supabase.com/docs
- **APU VOTE Schema:** `/docs/database-schema-documentation.md`
- **Community:** https://github.com/supabase/supabase/discussions
- **Status Page:** https://status.supabase.com

---

## Next Steps

1. ✅ Complete this setup guide
2. ✅ Integrate Supabase with your React frontend
3. ✅ Replace localStorage with Supabase queries
4. ✅ Test all features end-to-end
5. ✅ Deploy to production
6. ✅ Monitor and optimize

---

**Setup Guide Version:** 1.0  
**Last Updated:** 2025-11-20  
**Estimated Setup Time:** 15-30 minutes
