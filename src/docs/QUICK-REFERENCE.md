# APU VOTE - Quick Reference Card

## 🚀 Quick Start (5 Minutes)

```bash
# 1. Create Supabase project at https://supabase.com
# 2. Copy SQL from /supabase/migrations/ and run in SQL Editor
# 3. Configure email auth in Dashboard
# 4. Create admin user
# 5. Done! ✅
```

---

## 📁 File Locations

| What You Need | Where to Find It |
|---------------|------------------|
| **SQL Migrations** | `/supabase/migrations/*.sql` |
| **Full Documentation** | `/docs/database-schema-documentation.md` |
| **Setup Guide** | `/docs/supabase-setup-guide.md` |
| **ERD Diagram** | `/docs/ERD-diagram.txt` |
| **Quick Start** | `/supabase/README.md` |

---

## 🗄️ Tables Cheat Sheet

| Table | Purpose | Key Fields |
|-------|---------|------------|
| **users** | User profiles | `email`, `tp_number`, `wallet_address`, `is_verified` |
| **elections** | Elections | `title`, `start_time`, `end_time`, `max_voters` |
| **categories** | Positions (max 3) | `category_name`, `is_active`, `max_votes` |
| **candidates** | Candidates | `candidate_name`, `party`, `is_approved`, `vote_count` |
| **votes** | Vote records | `user_id`, `candidate_id`, `blockchain_tx_hash` |
| **admins** | Admins | `user_id`, `permissions`, `role` |

---

## 🔐 Permission Quick Check

```sql
-- Is user verified?
SELECT is_verified FROM public.users WHERE id = auth.uid();

-- Is user admin?
SELECT is_active FROM public.admins WHERE user_id = auth.uid();

-- Can user vote in category?
SELECT NOT EXISTS (
  SELECT 1 FROM public.votes 
  WHERE user_id = auth.uid() 
  AND category_id = 'category-id'
  AND election_id = 'election-id'
);
```

---

## 📧 Email Verification Flow

```
1. User signs up
   ↓
2. Supabase sends email
   ↓
3. User clicks link
   ↓
4. is_verified = TRUE
   ↓
5. User can vote ✅
```

**Configure:** Dashboard → Authentication → Providers → Email

---

## 🎯 Common Queries

### Get Active Elections

```sql
SELECT * FROM public.elections 
WHERE is_active = TRUE 
AND NOW() BETWEEN start_time AND end_time;
```

### Get User's Votes

```sql
SELECT v.*, c.candidate_name, cat.category_name
FROM public.votes v
JOIN public.candidates c ON v.candidate_id = c.id
JOIN public.categories cat ON v.category_id = cat.id
WHERE v.user_id = auth.uid();
```

### Get Election Results

```sql
SELECT 
  c.candidate_name,
  c.vote_count,
  cat.category_name
FROM public.candidates c
JOIN public.categories cat ON c.category_id = cat.id
WHERE c.election_id = 'election-id'
ORDER BY cat.display_order, c.vote_count DESC;
```

### Check Vote Count

```sql
SELECT category_name, COUNT(v.id) as total_votes
FROM public.categories cat
LEFT JOIN public.votes v ON v.category_id = cat.id
WHERE cat.election_id = 'election-id'
GROUP BY cat.category_name;
```

---

## 🔑 Environment Variables

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **Never expose `SUPABASE_SERVICE_ROLE_KEY` to frontend!**

---

## 👨‍💼 Create Admin User

```sql
-- 1. Sign up via app first
-- 2. Get user ID
SELECT id FROM auth.users WHERE email = 'admin@mail.apu.edu.my';

-- 3. Grant admin access
INSERT INTO public.admins (user_id, role, permissions, is_active)
VALUES (
  'user-id-from-step-2',
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

---

## 🗳️ Vote Flow in Frontend

```typescript
// 1. Check user is verified
const { data: user } = await supabase
  .from('users')
  .select('is_verified')
  .eq('id', userId)
  .single();

if (!user.is_verified) {
  return { error: 'Please verify your email first' };
}

// 2. Check hasn't voted in this category
const { data: existingVote } = await supabase
  .from('votes')
  .select('id')
  .eq('user_id', userId)
  .eq('category_id', categoryId)
  .eq('election_id', electionId)
  .single();

if (existingVote) {
  return { error: 'You have already voted in this category' };
}

// 3. Cast vote (RLS will enforce all rules)
const { data, error } = await supabase
  .from('votes')
  .insert({
    user_id: userId,
    candidate_id: candidateId,
    category_id: categoryId,
    election_id: electionId,
    blockchain_tx_hash: txHash,
  });

if (!error) {
  // Vote successful! ✅
}
```

---

## 🚨 Troubleshooting

| Error | Solution |
|-------|----------|
| "Email not sending" | Check Auth → Providers → Email enabled |
| "RLS policy violation" | Check user is verified: `is_verified = TRUE` |
| "Vote already cast" | Unique constraint prevents double voting (by design) |
| "Cannot update vote" | Votes are immutable (by design) |
| "Profile not created" | Check trigger: `on_auth_user_created` |

---

## 📊 System Settings

```sql
-- View current settings
SELECT * FROM public.system_settings;

-- Update setting
UPDATE public.system_settings 
SET value = '5'::jsonb 
WHERE key = 'max_categories_per_election';
```

**Default Settings:**
- `max_categories_per_election` = 3
- `require_wallet_connection` = true
- `enable_email_verification` = true
- `results_locked` = false
- `visitor_limit_enabled` = false

---

## 🔒 Security Checklist

- [ ] RLS enabled on all tables
- [ ] Service role key not in frontend
- [ ] Email verification required
- [ ] Site URL configured
- [ ] Redirect URLs set
- [ ] Admin permissions assigned
- [ ] Test voting flow
- [ ] Verify RLS policies

---

## 📈 Performance Tips

1. ✅ Use `vote_count` cache instead of COUNT(*)
2. ✅ All foreign keys are indexed
3. ✅ Filter on indexed columns (`is_active`, `is_verified`)
4. ✅ Use `.select('*')` only when needed
5. ✅ Enable connection pooling in production

---

## 🎓 Learning Resources

- **Full Docs:** `/docs/database-schema-documentation.md`
- **Setup Guide:** `/docs/supabase-setup-guide.md`
- **Supabase Docs:** https://supabase.com/docs
- **RLS Guide:** https://supabase.com/docs/guides/auth/row-level-security

---

## 📞 Need Help?

1. Check `/docs/database-schema-documentation.md` (50+ pages)
2. Check `/docs/supabase-setup-guide.md` (step-by-step)
3. Search Supabase docs: https://supabase.com/docs
4. Ask in GitHub discussions

---

## ✅ Production Deployment Checklist

- [ ] Migrations run on production database
- [ ] Email authentication configured
- [ ] Custom domain set (optional)
- [ ] Admin accounts created
- [ ] RLS policies tested
- [ ] Database backups enabled
- [ ] Monitoring set up
- [ ] Rate limiting configured
- [ ] SSL certificates valid
- [ ] Environment variables set

---

## 🎯 Key Features

✅ Email verification required  
✅ One vote per category per user  
✅ Max 3 categories per election  
✅ Vote immutability enforced  
✅ Admin approval for candidates  
✅ Visitor limit control  
✅ Blockchain transaction tracking  
✅ Complete audit trail  
✅ Row-level security  
✅ Auto-sync vote counts  

---

**Quick Reference Version:** 1.0  
**Last Updated:** 2025-11-20  
**Print this page for easy access! 📄**
