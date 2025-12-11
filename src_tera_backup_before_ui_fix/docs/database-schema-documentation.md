# APU VOTE - Database Schema Documentation

## Overview

This document describes the complete Supabase database schema for the APU VOTE Blockchain E-Voting Platform. The system supports authentication, email verification, elections management, candidate registration, and secure voting with blockchain integration.

---

## Entity Relationship Diagram (ERD)

```
┌─────────────────────┐
│   auth.users        │ (Supabase Auth)
│                     │
│ - id (PK)          │
│ - email            │
│ - encrypted_pwd    │
│ - email_confirmed  │
└──────────┬──────────┘
           │
           │ 1:1
           ▼
┌─────────────────────┐         ┌─────────────────────┐
│   public.users      │◄───────►│   public.admins     │
│                     │  1:0..1 │                     │
│ - id (PK, FK)      │         │ - id (PK)          │
│ - full_name        │         │ - user_id (FK)     │
│ - email            │         │ - permissions[]    │
│ - tp_number        │         │ - role             │
│ - wallet_address   │         └─────────────────────┘
│ - department       │
│ - year_of_study    │
│ - role             │
│ - is_verified      │
└──────────┬──────────┘
           │
           │ 1:N
           ▼
┌─────────────────────┐         ┌─────────────────────┐
│  public.elections   │◄────────│  public.categories  │
│                     │  1:N    │                     │
│ - id (PK)          │         │ - id (PK)          │
│ - title            │         │ - election_id (FK) │
│ - description      │         │ - category_name    │
│ - start_time       │         │ - max_votes        │
│ - end_time         │         │ - is_active        │
│ - is_active        │         └──────────┬──────────┘
│ - max_voters       │                    │
│ - current_voters   │                    │ 1:N
└────────────────────┘                    ▼
           │                    ┌─────────────────────┐
           │                    │  public.candidates  │
           │                    │                     │
           │                    │ - id (PK)          │
           │                    │ - user_id (FK)     │
           └───────────────────►│ - category_id (FK) │
                       N:1      │ - election_id (FK) │
                                │ - candidate_name   │
                                │ - party            │
                                │ - vote_count       │
                                │ - is_approved      │
                                └──────────┬──────────┘
                                           │
                                           │ 1:N
                                           ▼
                                ┌─────────────────────┐
                                │   public.votes      │
                                │                     │
                                │ - id (PK)          │
                                │ - user_id (FK)     │
                                │ - candidate_id (FK)│
                                │ - category_id (FK) │
                                │ - election_id (FK) │
                                │ - blockchain_tx    │
                                │ - voted_at         │
                                └─────────────────────┘
                                           │
                                           │
                                ┌─────────────────────┐
                                │  public.audit_logs  │
                                │                     │
                                │ - id (PK)          │
                                │ - user_id (FK)     │
                                │ - action           │
                                │ - entity_type      │
                                │ - details          │
                                └─────────────────────┘

                                ┌─────────────────────┐
                                │ public.system_      │
                                │      settings       │
                                │                     │
                                │ - key (PK)         │
                                │ - value (JSONB)    │
                                │ - description      │
                                └─────────────────────┘
```

---

## Table Descriptions

### 1. **public.users** (User Profiles)

Extended user profile information linked to Supabase Auth.

| Column           | Type              | Constraints                      | Description                                    |
|------------------|-------------------|----------------------------------|------------------------------------------------|
| id               | UUID              | PK, FK → auth.users(id)          | User ID from Supabase Auth                     |
| full_name        | VARCHAR(255)      | NOT NULL                         | User's full name                               |
| email            | VARCHAR(255)      | UNIQUE, NOT NULL                 | User's email address                           |
| tp_number        | VARCHAR(20)       | UNIQUE, NOT NULL, CHECK pattern  | APU Student ID (e.g., TP123456)                |
| wallet_address   | VARCHAR(42)       | UNIQUE, CHECK pattern            | Ethereum wallet address (0x...)                |
| department       | ENUM              | NOT NULL                         | Academic department                            |
| year_of_study    | INTEGER           | CHECK (1-4)                      | Current year of study                          |
| role             | ENUM              | DEFAULT 'voter'                  | User role: admin/voter/candidate               |
| is_verified      | BOOLEAN           | DEFAULT FALSE                    | Email verification status                      |
| is_active        | BOOLEAN           | DEFAULT TRUE                     | Account active status                          |
| created_at       | TIMESTAMPTZ       | DEFAULT NOW()                    | Account creation timestamp                     |
| updated_at       | TIMESTAMPTZ       | DEFAULT NOW()                    | Last update timestamp                          |

**Indexes:**
- `idx_users_email` on `email`
- `idx_users_tp_number` on `tp_number`
- `idx_users_wallet_address` on `wallet_address`
- `idx_users_role` on `role`
- `idx_users_is_verified` on `is_verified`

---

### 2. **public.elections** (Election Configurations)

Stores election schedules and configurations.

| Column           | Type              | Constraints                      | Description                                    |
|------------------|-------------------|----------------------------------|------------------------------------------------|
| id               | UUID              | PK, DEFAULT uuid_generate_v4()   | Election ID                                    |
| title            | VARCHAR(255)      | NOT NULL                         | Election title                                 |
| description      | TEXT              |                                  | Election description                           |
| start_time       | TIMESTAMPTZ       | NOT NULL                         | Election start date/time                       |
| end_time         | TIMESTAMPTZ       | NOT NULL, CHECK > start_time     | Election end date/time                         |
| is_active        | BOOLEAN           | DEFAULT FALSE                    | Whether election is currently active           |
| results_published| BOOLEAN           | DEFAULT FALSE                    | Whether results are published                  |
| max_voters       | INTEGER           | CHECK > 0                        | Maximum number of voters (visitor limit)       |
| current_voters   | INTEGER           | DEFAULT 0                        | Current number of voters                       |
| created_by       | UUID              | FK → users(id)                   | Admin who created the election                 |
| created_at       | TIMESTAMPTZ       | DEFAULT NOW()                    | Creation timestamp                             |
| updated_at       | TIMESTAMPTZ       | DEFAULT NOW()                    | Last update timestamp                          |

**Indexes:**
- `idx_elections_is_active` on `is_active`
- `idx_elections_dates` on `(start_time, end_time)`
- `idx_elections_created_by` on `created_by`

---

### 3. **public.categories** (Voting Categories/Positions)

Voting positions (e.g., President, Vice President, Secretary). **Maximum 3 per election**.

| Column           | Type              | Constraints                      | Description                                    |
|------------------|-------------------|----------------------------------|------------------------------------------------|
| id               | UUID              | PK, DEFAULT uuid_generate_v4()   | Category ID                                    |
| election_id      | UUID              | FK → elections(id), NOT NULL     | Parent election                                |
| category_name    | VARCHAR(100)      | NOT NULL, UNIQUE per election    | Position name                                  |
| description      | TEXT              |                                  | Position description                           |
| max_votes        | INTEGER           | DEFAULT 1, CHECK >= 1            | Max votes per user in this category            |
| display_order    | INTEGER           | DEFAULT 0                        | Sort order for display                         |
| is_active        | BOOLEAN           | DEFAULT TRUE                     | Whether category is active                     |
| created_at       | TIMESTAMPTZ       | DEFAULT NOW()                    | Creation timestamp                             |
| updated_at       | TIMESTAMPTZ       | DEFAULT NOW()                    | Last update timestamp                          |

**Constraints:**
- UNIQUE(election_id, category_name)
- CHECK: Max 3 categories per election

**Indexes:**
- `idx_categories_election_id` on `election_id`
- `idx_categories_is_active` on `is_active`

---

### 4. **public.candidates** (Election Candidates)

Candidates registered for election positions.

| Column           | Type              | Constraints                      | Description                                    |
|------------------|-------------------|----------------------------------|------------------------------------------------|
| id               | UUID              | PK, DEFAULT uuid_generate_v4()   | Candidate ID                                   |
| user_id          | UUID              | FK → users(id), NOT NULL         | Candidate's user account                       |
| category_id      | UUID              | FK → categories(id), NOT NULL    | Position running for                           |
| election_id      | UUID              | FK → elections(id), NOT NULL     | Parent election                                |
| candidate_name   | VARCHAR(255)      | NOT NULL                         | Display name                                   |
| party            | VARCHAR(100)      |                                  | Political party/affiliation                    |
| manifesto        | TEXT              |                                  | Campaign manifesto                             |
| photo_url        | TEXT              |                                  | Candidate photo URL                            |
| vote_count       | INTEGER           | DEFAULT 0, CHECK >= 0            | Total votes received (cached)                  |
| is_approved      | BOOLEAN           | DEFAULT FALSE                    | Admin approval status                          |
| created_at       | TIMESTAMPTZ       | DEFAULT NOW()                    | Registration timestamp                         |
| updated_at       | TIMESTAMPTZ       | DEFAULT NOW()                    | Last update timestamp                          |

**Constraints:**
- UNIQUE(user_id, category_id, election_id) - One candidacy per category per election

**Indexes:**
- `idx_candidates_user_id` on `user_id`
- `idx_candidates_category_id` on `category_id`
- `idx_candidates_election_id` on `election_id`
- `idx_candidates_is_approved` on `is_approved`
- `idx_candidates_vote_count` on `vote_count DESC`

---

### 5. **public.votes** (Vote Records)

Individual vote records with blockchain verification. **Immutable after insertion**.

| Column              | Type              | Constraints                      | Description                                    |
|---------------------|-------------------|----------------------------------|------------------------------------------------|
| id                  | UUID              | PK, DEFAULT uuid_generate_v4()   | Vote ID                                        |
| user_id             | UUID              | FK → users(id), NOT NULL         | Voter's user ID                                |
| candidate_id        | UUID              | FK → candidates(id), NOT NULL    | Selected candidate                             |
| category_id         | UUID              | FK → categories(id), NOT NULL    | Voting category                                |
| election_id         | UUID              | FK → elections(id), NOT NULL     | Parent election                                |
| blockchain_tx_hash  | VARCHAR(66)       | CHECK pattern                    | Ethereum transaction hash                      |
| blockchain_verified | BOOLEAN           | DEFAULT FALSE                    | Blockchain verification status                 |
| voted_at            | TIMESTAMPTZ       | DEFAULT NOW()                    | Vote timestamp                                 |

**Constraints:**
- UNIQUE(user_id, category_id, election_id) - **One vote per user per category per election**
- CHECK: Transaction hash format `^0x[a-fA-F0-9]{64}$`

**Indexes:**
- `idx_votes_user_id` on `user_id`
- `idx_votes_candidate_id` on `candidate_id`
- `idx_votes_category_id` on `category_id`
- `idx_votes_election_id` on `election_id`
- `idx_votes_voted_at` on `voted_at`
- `idx_votes_blockchain_tx_hash` on `blockchain_tx_hash`

---

### 6. **public.admins** (System Administrators)

Admin users with granular permissions.

| Column           | Type              | Constraints                      | Description                                    |
|------------------|-------------------|----------------------------------|------------------------------------------------|
| id               | UUID              | PK, DEFAULT uuid_generate_v4()   | Admin record ID                                |
| user_id          | UUID              | FK → users(id), UNIQUE, NOT NULL | Associated user account                        |
| role             | VARCHAR(50)       | DEFAULT 'election_admin'         | Admin role name                                |
| permissions      | ENUM[]            | DEFAULT ['manage_elections']     | Array of permission flags                      |
| assigned_by      | UUID              | FK → users(id)                   | Admin who granted permissions                  |
| assigned_at      | TIMESTAMPTZ       | DEFAULT NOW()                    | Permission grant timestamp                     |
| is_active        | BOOLEAN           | DEFAULT TRUE                     | Whether admin access is active                 |
| created_at       | TIMESTAMPTZ       | DEFAULT NOW()                    | Record creation timestamp                      |
| updated_at       | TIMESTAMPTZ       | DEFAULT NOW()                    | Last update timestamp                          |

**Admin Permissions ENUM:**
- `manage_elections` - Create/edit elections
- `manage_candidates` - Approve/manage candidates
- `manage_categories` - Create/edit categories
- `manage_users` - Manage user accounts
- `view_results` - View election results
- `publish_results` - Publish results publicly
- `system_settings` - Modify system settings
- `super_admin` - Full system access

**Indexes:**
- `idx_admins_user_id` on `user_id`
- `idx_admins_is_active` on `is_active`

---

### 7. **public.audit_logs** (Audit Trail)

Immutable audit trail for all important system actions.

| Column           | Type              | Constraints                      | Description                                    |
|------------------|-------------------|----------------------------------|------------------------------------------------|
| id               | UUID              | PK, DEFAULT uuid_generate_v4()   | Log entry ID                                   |
| user_id          | UUID              | FK → users(id)                   | User who performed action                      |
| action           | ENUM              | NOT NULL                         | Action type                                    |
| entity_type      | VARCHAR(50)       |                                  | Affected entity type                           |
| entity_id        | UUID              |                                  | Affected entity ID                             |
| details          | JSONB             |                                  | Additional context data                        |
| ip_address       | INET              |                                  | User's IP address                              |
| user_agent       | TEXT              |                                  | User's browser/client info                     |
| created_at       | TIMESTAMPTZ       | DEFAULT NOW()                    | Action timestamp                               |

**Audit Action ENUM:**
- `user_registered`
- `user_verified`
- `election_created`
- `election_started`
- `election_ended`
- `candidate_registered`
- `candidate_approved`
- `vote_cast`
- `results_published`
- `admin_action`

**Indexes:**
- `idx_audit_logs_user_id` on `user_id`
- `idx_audit_logs_action` on `action`
- `idx_audit_logs_created_at` on `created_at DESC`
- `idx_audit_logs_entity` on `(entity_type, entity_id)`

---

### 8. **public.system_settings** (System Configuration)

Global system configuration key-value store.

| Column           | Type              | Constraints                      | Description                                    |
|------------------|-------------------|----------------------------------|------------------------------------------------|
| key              | VARCHAR(100)      | PK                               | Setting key                                    |
| value            | JSONB             | NOT NULL                         | Setting value (flexible JSON)                  |
| description      | TEXT              |                                  | Setting description                            |
| updated_by       | UUID              | FK → users(id)                   | Admin who last updated                         |
| updated_at       | TIMESTAMPTZ       | DEFAULT NOW()                    | Last update timestamp                          |

**Default Settings:**
- `max_categories_per_election` = 3
- `require_wallet_connection` = true
- `enable_email_verification` = true
- `results_locked` = false
- `visitor_limit_enabled` = false
- `default_visitor_limit` = 1000

---

## Authentication Flow

### 1. **User Signup Process**

```
User fills signup form → Supabase Auth creates auth.users record
  ↓
Email verification email sent automatically
  ↓
Trigger: handle_new_user() creates public.users profile
  ↓
User clicks verification link in email
  ↓
auth.users.email_confirmed_at set to NOW()
  ↓
Trigger: sync_user_email_verification() updates public.users.is_verified = TRUE
  ↓
User can now access voting system
```

### 2. **Email Verification**

- **Automatic**: Supabase Auth sends verification email on signup
- **Required**: Users cannot vote until `is_verified = TRUE`
- **Synced**: `auth.users.email_confirmed_at` → `public.users.is_verified`
- **Enforced**: RLS policies check `is_verified` before allowing votes

### 3. **Login Flow**

```
User enters email + password → Supabase Auth validates
  ↓
JWT token issued with user.id
  ↓
Frontend stores session token
  ↓
All API calls include Authorization: Bearer <token>
  ↓
RLS policies use auth.uid() to enforce permissions
```

---

## Row Level Security (RLS) Summary

### **Security Principles**

1. ✅ **Users can only view/edit their own profile**
2. ✅ **Votes are immutable** (cannot be updated or deleted)
3. ✅ **Only verified users can vote**
4. ✅ **Admins can manage elections, categories, candidates**
5. ✅ **Super admins have full control**
6. ✅ **Audit logs are immutable**
7. ✅ **Public can view active elections and approved candidates**

### **Key RLS Policies**

| Table          | SELECT                    | INSERT                     | UPDATE                    | DELETE                    |
|----------------|---------------------------|----------------------------|---------------------------|---------------------------|
| users          | Own + Admins              | Self on signup             | Own (limited) + Admins    | Admins only               |
| elections      | Public                    | Admins                     | Admins                    | Admins                    |
| categories     | Public (active) + Admins  | Admins                     | Admins                    | Admins                    |
| candidates     | Approved + Own + Admins   | Verified voters            | Own + Admins              | Admins                    |
| votes          | Own + Admins              | Verified voters (1x)       | **BLOCKED**               | Super admins only         |
| admins         | Admins                    | Super admins               | Super admins              | Super admins              |
| audit_logs     | Admins                    | System                     | **BLOCKED**               | **BLOCKED**               |
| system_settings| Public                    | **BLOCKED**                | Admins                    | **BLOCKED**               |

---

## Database Triggers

### **Auto-Update Triggers**

1. **update_updated_at_column()** - Auto-update `updated_at` on all tables
2. **handle_new_user()** - Auto-create user profile on auth signup
3. **sync_user_email_verification()** - Sync email verification status
4. **increment_candidate_votes()** - Auto-increment vote count on vote cast
5. **decrement_candidate_votes()** - Auto-decrement vote count on vote deletion

---

## Performance Optimization

### **Indexing Strategy**

✅ **Primary Keys**: All tables have UUID primary keys with indexes
✅ **Foreign Keys**: All foreign keys are indexed
✅ **Filter Columns**: Indexed on commonly filtered columns (is_active, is_verified, etc.)
✅ **Sort Columns**: Indexed on commonly sorted columns (vote_count DESC, created_at DESC)
✅ **Unique Constraints**: Enforced with unique indexes

### **Query Optimization**

- Use `vote_count` cache instead of COUNT(*) aggregates
- Composite indexes on frequently joined columns
- JSONB indexes on audit log details if needed
- Partition audit_logs by date if volume is high

---

## Setup Instructions

### **1. Run Migrations**

```bash
# In your Supabase project directory
supabase migration new initial_schema
supabase migration new row_level_security
supabase migration new seed_data

# Apply migrations
supabase db push
```

### **2. Enable Email Auth**

In Supabase Dashboard:
1. Go to **Authentication** → **Settings**
2. Enable **Email** provider
3. Configure **Email Templates** for verification
4. Set **Site URL** and **Redirect URLs**

### **3. Create First Admin**

```sql
-- 1. Create user in Auth Dashboard or via signup
-- 2. Get the user ID from auth.users
-- 3. Run this SQL:

INSERT INTO public.admins (user_id, role, permissions, is_active)
VALUES (
  'YOUR-USER-UUID-HERE',
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

### **4. Test Email Verification**

```bash
# Local development
supabase start
supabase functions serve

# Check Inbucket for verification emails
# http://localhost:54324
```

---

## API Integration Examples

### **Check if User Can Vote**

```typescript
// Frontend: Check eligibility
const { data: user } = await supabase
  .from('users')
  .select('is_verified, is_active, wallet_address')
  .eq('id', userId)
  .single();

if (!user.is_verified) {
  return { error: 'Please verify your email first' };
}

if (!user.wallet_address) {
  return { error: 'Please connect your MetaMask wallet' };
}
```

### **Cast a Vote**

```typescript
// Frontend: Cast vote with RLS protection
const { data, error } = await supabase
  .from('votes')
  .insert({
    user_id: userId,
    candidate_id: candidateId,
    category_id: categoryId,
    election_id: electionId,
    blockchain_tx_hash: txHash,
  });

// RLS automatically checks:
// - User is verified
// - Election is active and within time range
// - User hasn't voted in this category yet
// - Visitor limit not exceeded
```

### **Get Election Results**

```typescript
// Frontend: Get results (respects results_locked setting)
const { data: results } = await supabase
  .from('candidates')
  .select(`
    *,
    category:categories(category_name),
    votes:votes(count)
  `)
  .eq('election_id', electionId)
  .eq('is_approved', true)
  .order('vote_count', { ascending: false });
```

---

## Security Best Practices

1. ✅ **Never disable RLS** on production tables
2. ✅ **Always use JWT tokens** for authentication
3. ✅ **Validate inputs** in application layer
4. ✅ **Log all admin actions** to audit_logs
5. ✅ **Regularly backup database**
6. ✅ **Monitor suspicious voting patterns**
7. ✅ **Rate limit API endpoints**
8. ✅ **Use prepared statements** to prevent SQL injection

---

## Backup & Recovery

```bash
# Backup database
supabase db dump -f backup.sql

# Restore database
psql -d postgres://... -f backup.sql

# Backup specific table
pg_dump -t public.votes -f votes_backup.sql
```

---

## Monitoring Queries

### **Active Elections**

```sql
SELECT title, start_time, end_time, current_voters, max_voters
FROM public.elections
WHERE is_active = TRUE;
```

### **Vote Count by Category**

```sql
SELECT 
  c.category_name,
  COUNT(v.id) as total_votes,
  COUNT(DISTINCT v.user_id) as unique_voters
FROM public.categories c
LEFT JOIN public.votes v ON v.category_id = c.id
GROUP BY c.category_name;
```

### **Top Candidates**

```sql
SELECT 
  ca.candidate_name,
  ca.party,
  ca.vote_count,
  ct.category_name
FROM public.candidates ca
JOIN public.categories ct ON ca.category_id = ct.id
ORDER BY ca.vote_count DESC
LIMIT 10;
```

---

## Support & Troubleshooting

### **Common Issues**

1. **"User cannot vote"** → Check `is_verified` status
2. **"Email not received"** → Check spam folder, verify SMTP settings
3. **"RLS policy violation"** → Check user permissions and admin status
4. **"Vote count mismatch"** → Triggers may not have fired, manual sync needed

### **Manual Vote Count Sync**

```sql
UPDATE public.candidates ca
SET vote_count = (
  SELECT COUNT(*) 
  FROM public.votes v 
  WHERE v.candidate_id = ca.id
);
```

---

## Next Steps

1. ✅ Run migrations in Supabase
2. ✅ Configure email authentication
3. ✅ Create admin user
4. ✅ Test signup/verification flow
5. ✅ Integrate with frontend React app
6. ✅ Deploy to production
7. ✅ Monitor and optimize

---

**Documentation Version:** 1.0  
**Last Updated:** 2025-11-20  
**Author:** APU VOTE Development Team
