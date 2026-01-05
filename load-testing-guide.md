# Load Testing Guide

## Overview

This guide explains how to use the load testing system to test your e-voting application's capacity and performance under concurrent user load.

## Features

- **Capacity Testing Toggle**: Enable/disable capacity limits from Admin Dashboard
- **Automated Load Testing**: Use Artillery to simulate hundreds of concurrent users
- **Cross-Device Testing**: Test from multiple devices on the same network

---

## 1. Enabling Capacity Testing Mode

### Via Admin Dashboard

1. Login to Admin Dashboard
2. Navigate to **Settings** tab
3. Scroll to **"Enable Capacity Testing Mode"**
4. Toggle the switch to **ON**
5. Set **"Maximum Concurrent Users"** (e.g., 10)
6. The settings are saved automatically

**When Enabled:**

- New logins are blocked when the limit is reached
- Users see: "System is currently at maximum capacity. Please try again later."
- Existing logged-in users are unaffected

**When Disabled:**

- Normal login flow (no capacity restrictions)
- All users can login regardless of count

---

## 2. Installing Artillery

Artillery is a modern load testing toolkit for Node.js.

### Install Globally

```bash
npm install -g artillery
```

### Verify Installation

```bash
artillery --version
```

---

## 3. Configuring Load Tests

### Set Target URL

Create a `.artillery.env` file in the project root:

```bash
# Copy the example file
copy .artillery.env.example .artillery.env
```

Edit `.artillery.env`:

```env
# Use your network IP for cross-device testing
TARGET_URL=http://192.168.1.100:3001

# Or use localhost for same-machine testing
# TARGET_URL=http://localhost:3001
```

### Find Your Network IP

**Windows:**

```bash
ipconfig
# Look for "IPv4 Address" under your active network adapter
```

**Mac/Linux:**

```bash
ifconfig
# Look for "inet" address
```

---

## 4. Running Load Tests

### Basic Load Test

```bash
# Set environment variable and run
$env:TARGET_URL="http://localhost:3001"; artillery run load-test.yml
```

### With Custom Target

```bash
$env:TARGET_URL="http://192.168.1.100:3001"; artillery run load-test.yml
```

### Understanding the Output

Artillery will show:

- **Scenarios launched**: Total number of virtual users created
- **Scenarios completed**: Users that finished their flow
- **Requests completed**: Total HTTP requests sent
- **Response time (p95)**: 95% of requests completed within this time
- **Codes**: HTTP status codes (200 = success, 429 = capacity reached)

---

## 5. Test Scenarios

The `load-test.yml` includes 3 scenarios:

### Scenario 1: Login Flow (60% weight)

- Attempts to login with random credentials
- Tests capacity enforcement
- Expected: Mix of 200 (success) and 429 (capacity reached)

### Scenario 2: Browse Elections (30% weight)

- Fetches active elections
- Fetches categories
- Tests read-only endpoints

### Scenario 3: Check Registration (10% weight)

- Checks wallet registration status
- Tests database queries

---

## 6. Manual Cross-Device Testing

### Step 1: Find Your Network IP

```bash
ipconfig  # Windows
ifconfig  # Mac/Linux
```

Example: `192.168.1.100`

### Step 2: Update Frontend .env

Edit `.env` in the project root:

```env
VITE_API_URL=http://192.168.1.100:3001/api
```

### Step 3: Restart Servers

```bash
# Stop both servers (Ctrl+C)
# Restart frontend
npm run dev

# Restart backend (in server folder)
cd server
npm run dev
```

### Step 4: Test from Phone

1. Connect phone to **same WiFi network**
2. Open browser on phone
3. Navigate to: `http://192.168.1.100:3000`
4. Try to login

**If it doesn't work:**

- Check firewall settings (allow ports 3000 and 3001)
- Verify both devices are on same network
- Try `http://YOUR_IP:3000` instead

---

## 7. Testing Capacity Limits

### Test Plan

1. **Enable capacity testing** (set max to 5 users)
2. **Open 5 browser tabs** and login with different accounts
3. **Try 6th login** → Should see "System at maximum capacity"
4. **Logout from one tab**
5. **Try 6th login again** → Should now succeed

### Using Artillery

```bash
# Enable capacity testing in Admin Dashboard (max 10 users)

# Run load test
$env:TARGET_URL="http://localhost:3001"; artillery run load-test.yml

# Check results:
# - Some requests will succeed (200)
# - Some will be blocked (429 - capacity reached)
```

---

## 8. Interpreting Results

### Good Performance Indicators

✅ Response times under 500ms  
✅ No 500 errors (server crashes)  
✅ Capacity limits enforced correctly (429 errors when at capacity)  
✅ Existing users unaffected when capacity reached

### Warning Signs

⚠️ Response times over 1000ms  
⚠️ 500 errors (server errors)  
⚠️ Capacity limits not enforced  
⚠️ Server crashes under load

---

## 9. Troubleshooting

### "Connection refused" errors

**Problem:** Can't connect to server from phone/other device

**Solutions:**

1. Check firewall settings
2. Verify `VITE_API_URL` in `.env`
3. Restart both servers
4. Use network IP instead of localhost

### "Route not found" errors

**Problem:** API endpoints not found

**Solutions:**

1. Verify `VITE_API_URL` format: `http://IP:3001/api` (with `/api`)
2. Check backend server is running
3. Restart frontend server

### Capacity limits not working

**Problem:** Can login more users than the limit

**Solutions:**

1. Verify capacity testing is **enabled** in Admin Dashboard
2. Check database migration ran successfully
3. Restart backend server
4. Check server logs for errors

---

## 10. Best Practices

### For FYP Demonstration

1. **Set realistic limits**: 8-10 concurrent users for demo
2. **Document everything**: Screenshots of capacity errors
3. **Show Artillery results**: Include in report
4. **Test cross-device**: Demonstrate on laptop + phone
5. **Explain the feature**: Why capacity testing is important

### For Production

1. **Disable capacity testing** in production
2. **Monitor real usage**: Track actual concurrent users
3. **Set alerts**: Notify when approaching capacity
4. **Scale infrastructure**: Add servers if needed

---

## Quick Reference

```bash
# Install Artillery
npm install -g artillery

# Run load test
$env:TARGET_URL="http://localhost:3001"; artillery run load-test.yml

# Find your IP
ipconfig  # Windows

# Update .env
VITE_API_URL=http://YOUR_IP:3001/api

# Restart servers
npm run dev  # Frontend
cd server && npm run dev  # Backend
```

---

## Support

If you encounter issues:

1. Check server logs for errors
2. Verify database migration ran successfully
3. Ensure both servers are running
4. Check firewall settings
5. Verify network connectivity
