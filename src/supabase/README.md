# APU VOTE - Supabase Database Schema

## Overview

This directory contains the complete Supabase database schema for the APU VOTE Blockchain E-Voting Platform, including:

- ✅ User authentication with email verification
- ✅ Election management
- ✅ Category/position management (max 3)
- ✅ Candidate registration and approval
- ✅ Secure voting with blockchain integration
- ✅ Admin role-based access control
- ✅ Audit logging
- ✅ Row Level Security (RLS) policies

---

## 📁 File Structure

```
/supabase/
├── migrations/
│   ├── 001_initial_schema.sql      # Core database tables and triggers
│   ├── 002_row_level_security.sql  # RLS policies for data protection
│   └── 003_seed_data.sql           # Sample data for testing
└── README.md                        # This file
```

---

## 🗄️ Database Tables

| Table              | Purpose                                           | Key Features                          |
|--------------------|---------------------------------------------------|---------------------------------------|
| **users**          | Extended user profiles                            | Email verification, wallet address    |
| **elections**      | Election configurations                           | Visitor limits, time-based activation |
| **categories**     | Voting positions (max 3)                          | Active/inactive toggle                |
| **candidates**     | Registered candidates                             | Admin approval required               |
| **votes**          | Individual vote records                           | Immutable, blockchain-verified        |
| **admins**         | System administrators                             | Granular permissions                  |
| **audit_logs**     | Audit trail                                       | Immutable log of all actions          |
| **system_settings**| Global configuration                              | Key-value JSON store                  |

---

## 🔐 Security Features

### Row Level Security (RLS)

All tables have RLS enabled with policies that ensure:

- ✅ Users can only view/edit their own data
- ✅ Votes are **immutable** after submission
- ✅ Only verified users can vote
- ✅ Only approved candidates are visible to voters
- ✅ Admins have controlled access based on permissions
- ✅ Audit logs cannot be modified or deleted

### Authentication Flow

```
Signup → Email Verification → Profile Creation → Login → Vote
```

1. User signs up with email + password
2. Supabase Auth sends verification email
3. User clicks verification link
4. `is_verified` flag set to TRUE
5. User can now cast votes

---

## 🚀 Quick Start

### 1. Setup Supabase Project

```bash
# Create new project at https://supabase.com
# Copy your project URL and keys
```

### 2. Run Migrations

**Option A: SQL Editor (Recommended)**
1. Open Supabase Dashboard → SQL Editor
2. Copy and run each migration file in order:
   - `001_initial_schema.sql`
   - `002_row_level_security.sql`
   - `003_seed_data.sql` (optional)

**Option B: Supabase CLI**
```bash
supabase init
supabase link --project-ref your-project-id
supabase db push
```

### 3. Configure Environment Variables

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Enable Email Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure **Site URL** and **Redirect URLs**
4. Customize email templates (optional)

### 5. Create Admin User

```sql
-- 1. Sign up via your app
-- 2. Get user ID from auth.users
-- 3. Run this SQL:

INSERT INTO public.admins (user_id, role, permissions, is_active)
VALUES (
  'your-user-id-here',
  'super_admin',
  ARRAY[
    'manage_elections', 'manage_candidates', 'manage_categories',
    'manage_users', 'view_results', 'publish_results',
    'system_settings', 'super_admin'
  ]::admin_permission[],
  TRUE
);
```

---

## 📊 Entity Relationships

```
auth.users (Supabase Auth)
    ↓ 1:1
public.users ←→ public.admins (1:0..1)
    ↓ 1:N
public.candidates
    ↓ 1:N              ↓ 1:N
public.votes    public.elections
                    ↓ 1:N
               public.categories
```

### Key Relationships

- **1 User** → **0 or 1 Admin** (admin role is optional)
- **1 Election** → **Max 3 Categories**
- **1 Category** → **Multiple Candidates**
- **1 User** → **1 Vote per Category per Election** (unique constraint)
- **1 Candidate** → **Multiple Votes**

---

## 🔑 Admin Permissions

| Permission           | Description                           |
|---------------------|---------------------------------------|
| `manage_elections`  | Create and edit elections             |
| `manage_candidates` | Approve/reject candidate applications |
| `manage_categories` | Create/edit voting categories         |
| `manage_users`      | View and manage user accounts         |
| `view_results`      | View election results                 |
| `publish_results`   | Publish results publicly              |
| `system_settings`   | Modify system configuration           |
| `super_admin`       | Full system access (bypass all RLS)   |

---

## 🎯 Key Features

### 1. Email Verification

- Automatic email sent on signup
- Users cannot vote until verified
- Status synced from `auth.users.email_confirmed_at`

### 2. Visitor Limits

- Set `max_voters` per election
- Auto-incremented `current_voters` on vote cast
- Prevents voting when limit reached

### 3. Category Management

- Maximum 3 categories per election (enforced by constraint)
- Active/inactive toggle
- Dynamic display order

### 4. Vote Immutability

- No UPDATE policy on votes table
- DELETE only allowed for super admins
- Blockchain transaction hash stored for verification

### 5. Auto-Sync Vote Counts

- Triggers automatically update `candidates.vote_count`
- No manual counting needed
- Real-time accuracy

### 6. Audit Trail

- All important actions logged
- Immutable audit_logs table
- Includes IP address, user agent, and action details

---

## 📈 Performance Optimization

### Indexes

All foreign keys and frequently queried columns are indexed:

- `users`: email, tp_number, wallet_address, role, is_verified
- `elections`: is_active, dates, created_by
- `categories`: election_id, is_active
- `candidates`: user_id, category_id, election_id, is_approved, vote_count
- `votes`: All foreign keys, blockchain_tx_hash, voted_at
- `audit_logs`: user_id, action, created_at, entity

### Query Optimization

- Use `vote_count` cache instead of COUNT(*) aggregates
- Composite indexes on join columns
- Partitioning for audit_logs (if high volume)

---

## 🧪 Testing Queries

### View Active Elections

```sql
SELECT title, start_time, end_time, current_voters, max_voters
FROM public.elections
WHERE is_active = TRUE;
```

### View Vote Counts

```sql
SELECT 
  c.candidate_name,
  cat.category_name,
  c.vote_count
FROM public.candidates c
JOIN public.categories cat ON c.category_id = cat.id
ORDER BY cat.display_order, c.vote_count DESC;
```

### Check User Verification Status

```sql
SELECT full_name, email, is_verified, wallet_address
FROM public.users
WHERE tp_number = 'TP123456';
```

---

## 🐛 Troubleshooting

### Issue: Votes not incrementing

**Solution:** Check if triggers are enabled:
```sql
SELECT tgname, tgenabled 
FROM pg_trigger 
WHERE tgname IN ('on_vote_cast', 'on_vote_deleted');
```

### Issue: User profile not created on signup

**Solution:** Verify trigger exists:
```sql
SELECT tgname FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

### Issue: RLS preventing inserts

**Solution:** Check user is verified:
```sql
SELECT is_verified FROM public.users WHERE id = auth.uid();
```

---

## 📚 Documentation

- **Full Schema Docs:** `/docs/database-schema-documentation.md`
- **Setup Guide:** `/docs/supabase-setup-guide.md`
- **Supabase Docs:** https://supabase.com/docs

---

## 🔒 Security Notes

1. **Never expose `SUPABASE_SERVICE_ROLE_KEY`** in frontend code
2. **Always use RLS policies** - never disable them in production
3. **Validate all inputs** before database operations
4. **Monitor audit logs** for suspicious activity
5. **Backup database regularly** (automatic in Supabase)
6. **Use HTTPS only** in production

---

## 📝 Migration History

| Version | File                          | Description                        |
|---------|-------------------------------|------------------------------------|
| 001     | `001_initial_schema.sql`      | Core tables, indexes, triggers     |
| 002     | `002_row_level_security.sql`  | RLS policies and helper functions  |
| 003     | `003_seed_data.sql`           | Sample data for testing            |

---

## 🤝 Contributing

When adding new migrations:

1. Create new file: `00X_description.sql`
2. Add comment header explaining changes
3. Test thoroughly in development
4. Update this README
5. Document in `/docs/database-schema-documentation.md`

---

## 📞 Support

For issues or questions:

1. Check `/docs/database-schema-documentation.md`
2. Review Supabase docs: https://supabase.com/docs
3. Check GitHub issues
4. Contact APU VOTE development team

---

**Schema Version:** 1.0  
**Last Updated:** 2025-11-20  
**Compatibility:** Supabase (Postgres 15+)  
**Status:** ✅ Production Ready
