# 🔧 ADMIN DASHBOARD FIX & DATABASE RESTORATION GUIDE

## Problem: Blank Admin Dashboard Page

The blank page when accessing admin dashboard is likely caused by one of these issues:

### Possible Causes:
1. **Missing admin user in database**
2. **Missing required database tables**
3. **Session/authentication issue**
4. **API endpoint errors (500/404)**

---

## 🚀 QUICK FIX STEPS

### Step 1: Restore Your Database

Run this command in your PostgreSQL database:

```bash
# If using Docker PostgreSQL:
docker exec -i <your-postgres-container> psql -U postgres -d evoting < database/restore-database.sql

# If using local PostgreSQL:
psql -U postgres -d evoting -f database/restore-database.sql
```

**Or manually:**
1. Open pgAdmin or your PostgreSQL client
2. Connect to the `evoting` database
3. Open and execute: `database/restore-database.sql`

This will:
- ✅ Recreate all missing tables
- ✅ Add indexes for performance
- ✅ Create default admin user
- ✅ Add system settings

### Step 2: Test Admin Login

**Default Admin Credentials:**
- Email: `admin@apu.edu.my`
- Password: `Admin@123`
- Wallet: `0x30D336E13fac19C61c116431d44adbD98c386d5d`

**Login Steps:**
1. Go to Login page
2. Enter email: `admin@apu.edu.my`
3. Enter password: `Admin@123`
4. Click "Sign In"

---

## 🔍 TROUBLESHOOTING

### If Admin Dashboard is Still Blank:

#### 1. Check Browser Console (F12)
Look for errors like:
- ❌ `Failed to fetch`
- ❌ `500 Internal Server Error`
- ❌ `Unauthorized`
- ❌ `Cannot read property of undefined`

#### 2. Check Backend Server is Running
```bash
cd server
npm run dev
```

Should see:
```
✅ Database connected successfully
🚀 Server running on http://localhost:3001
```

#### 3. Check Database Connection
```bash
# Test if tables exist
psql -U postgres -d evoting -c "\dt"
```

Should see tables: `admins`, `voters`, `elections`, `categories`, `candidates`, etc.

#### 4. Verify Admin User Exists
```sql
SELECT email, role, is_active FROM admins WHERE email = 'admin@apu.edu.my';
```

Should return:
```
email              | role        | is_active
-------------------+-------------+-----------
admin@apu.edu.my   | super_admin | true
```

---

## 📝 Manual Admin Creation (If needed)

If the SQL script didn't create the admin, run this manually:

```sql
-- Delete old admin if exists
DELETE FROM admins WHERE email = 'admin@apu.edu.my';

-- Create new admin
INSERT INTO admins (
  user_id,
  email,
  password_hash,
  wallet_address,
  role,
  permissions,
  is_active
) VALUES (
  'admin001',
  'admin@apu.edu.my',
  '$2b$10$EIXvC6dN8Z5zYf5K4fJ4LOGqGqN8yqHqZ.H4sVQxN3fN8F2Z0Y8gK',
  '0x30D336E13fac19C61c116431d44adbD98c386d5d',
  'super_admin',
  ARRAY['all'],
  true
);
```

Password hash is for: `Admin@123`

---

## 🐛 DEBUG ADMIN DASHBOARD

If still seeing blank page, check these files for errors:

### 1. Check AdminDashboard.tsx
- Open: `src/components/AdminDashboard.tsx`
- Look for console errors
- Check if `useEffect` hooks are running

### 2. Check AuthGuard.tsx
- Open: `src/components/AuthGuard.tsx`
- Verify it's not blocking admin access
- Check `isAdmin()` function

### 3. Check Backend API Routes
```bash
# Test admin endpoint
curl http://localhost:3001/api/admin/voters

# Test elections endpoint
curl http://localhost:3001/api/elections/active
```

---

## ✅ VERIFICATION CHECKLIST

- [ ] Database restored (all tables exist)
- [ ] Admin user created in `admins` table
- [ ] Backend server running on port 3001
- [ ] Database connection successful
- [ ] Can login with admin@apu.edu.my / Admin@123
- [ ] No console errors (F12 in browser)
- [ ] Admin dashboard loads without blank page

---

## 🔐 SECURITY NOTES

⚠️ **IMPORTANT:** The default password `Admin@123` should be changed immediately after first login!

To change admin password, use this SQL:

```sql
-- Update admin password
-- New password: YourNewPassword
-- Replace the hash with bcrypt hash of your new password
UPDATE admins 
SET password_hash = '$2b$10$YOUR_NEW_BCRYPT_HASH_HERE'
WHERE email = 'admin@apu.edu.my';
```

Generate new bcrypt hash in Node.js:
```javascript
const bcrypt = require('bcrypt');
const hash = await bcrypt.hash('YourNewPassword', 10);
console.log(hash);
```

---

## 📞 STILL NEED HELP?

If admin dashboard is still blank after these steps:

1. **Check browser console** (F12 → Console tab)
2. **Copy any error messages**
3. **Check server logs** in terminal
4. **Take screenshot of blank page**
5. **Share the error details**

Most common fix: Just run the restore-database.sql script!
