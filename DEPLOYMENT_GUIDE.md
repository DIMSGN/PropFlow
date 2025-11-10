# 🚀 PropFlow - Free Deployment Guide

## Complete Step-by-Step Guide for Deploying to Vercel + Render

**Stack:**
- 🎨 Frontend: Vercel (Free Plan)
- ⚙️ Backend: Render Web Service (Free Plan)
- 🗄️ Database: Render MySQL (Free Plan)

**Total Cost: $0/month** ✨

---

## 📋 Prerequisites

Before starting, make sure you have:

1. ✅ GitHub account
2. ✅ Vercel account (sign up at https://vercel.com)
3. ✅ Render account (sign up at https://render.com)
4. ✅ Your code pushed to GitHub
5. ✅ Git installed locally

---

## 🗂️ PART 1: Prepare Your Code

### Step 1.1: Create GitHub Repository

```bash
# Navigate to your project root
cd c:/Users/dimit/Desktop/PropFlow

# Initialize git (if not already done)
git init

# Create .gitignore if not exists
```

Create a `.gitignore` file in the root:

```
# Dependencies
node_modules/
*/node_modules/

# Environment variables
.env
.env.local
.env.production
backend/.env
frontend/.env

# Build outputs
frontend/build/
frontend/dist/
backend/dist/

# Logs
*.log
npm-debug.log*

# OS files
.DS_Store
Thumbs.db

# Uploads (don't commit user uploads)
backend/uploads/*
!backend/uploads/.gitkeep
```

```bash
# Add all files
git add .

# Commit
git commit -m "Initial commit - Ready for deployment"

# Create repo on GitHub (go to github.com/new)
# Then push:
git remote add origin https://github.com/YOUR_USERNAME/propflow.git
git branch -M main
git push -u origin main
```

---

## 🗄️ PART 2: Deploy Database (Render MySQL)

### Step 2.1: Create MySQL Database on Render

1. Go to https://dashboard.render.com
2. Click **"New +"** → Select **"MySQL"**
3. Configure:
   - **Name:** `propflow-db`
   - **Database:** `propflow`
   - **User:** (auto-generated, you'll see it)
   - **Region:** Choose closest to you (e.g., Frankfurt, Oregon)
   - **MySQL Version:** 8.0
   - **Plan:** **Free**

4. Click **"Create Database"**

5. ⏳ Wait 2-3 minutes for database to provision

### Step 2.2: Get Database Credentials

Once created, you'll see:

```
Internal Database URL: mysql://user:password@hostname:3306/propflow
External Database URL: mysql://user:password@external-hostname:3306/propflow
```

**Note down these values:**
- **Host:** (e.g., `dpg-xxxxx-a.oregon-postgres.render.com`)
- **Port:** `3306`
- **Database:** `propflow`
- **Username:** (shown in dashboard)
- **Password:** (shown in dashboard)

### Step 2.3: Initialize Database Schema

You have two options:

#### Option A: Use Render Web Shell (Recommended)

1. In Render MySQL dashboard, click **"Connect"** → **"External Connection"**
2. Copy the connection command
3. Install MySQL client locally:
   ```bash
   # Windows (use Chocolatey)
   choco install mysql
   
   # Or download from https://dev.mysql.com/downloads/mysql/
   ```

4. Connect and import schema:
   ```bash
   # Connect to database
   mysql -h <your-host>.render.com -u <username> -p<password> propflow
   
   # Import schema
   source c:/Users/dimit/Desktop/PropFlow/database/schema.sql
   ```

#### Option B: Use MySQL Workbench (GUI)

1. Download MySQL Workbench: https://dev.mysql.com/downloads/workbench/
2. Create new connection with Render credentials
3. Open `database/schema.sql`
4. Execute the script

---

## ⚙️ PART 3: Deploy Backend (Render Web Service)

### Step 3.1: Create Web Service on Render

1. Go to https://dashboard.render.com
2. Click **"New +"** → Select **"Web Service"**
3. Connect your GitHub repository
4. Select the **`propflow`** repository

### Step 3.2: Configure Web Service

Fill in the following:

- **Name:** `propflow-backend`
- **Region:** **Same as your database** (e.g., Frankfurt)
- **Branch:** `main`
- **Root Directory:** `backend`
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Plan:** **Free**

### Step 3.3: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these one by one:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `DB_HOST` | (paste from Step 2.2) |
| `DB_PORT` | `3306` |
| `DB_NAME` | `propflow` |
| `DB_USER` | (paste from Step 2.2) |
| `DB_PASSWORD` | (paste from Step 2.2) |
| `DB_SSL` | `true` |
| `DB_POOL_MAX` | `5` |
| `DB_POOL_MIN` | `1` |
| `FRONTEND_URL` | `https://temp-placeholder.vercel.app` ← **We'll update this later** |
| `ALLOW_VERCEL_PREVIEWS` | `true` |

### Step 3.4: Deploy Backend

1. Click **"Create Web Service"**
2. ⏳ Wait 3-5 minutes for deployment
3. You'll get a URL like: `https://propflow-backend.onrender.com`

### Step 3.5: Test Backend

1. Visit: `https://your-backend.onrender.com/health`
2. You should see:
   ```json
   {
     "status": "healthy",
     "database": "connected",
     "timestamp": "2025-11-10T..."
   }
   ```

✅ **If you see this, backend is working!**

❌ **If you see errors:**
- Check environment variables are correct
- Check database credentials
- View logs in Render dashboard

---

## 🎨 PART 4: Deploy Frontend (Vercel)

### Step 4.1: Import Project to Vercel

1. Go to https://vercel.com/dashboard
2. Click **"Add New..." → "Project"**
3. Import your GitHub repository: `propflow`
4. Click on the repository to import it

### Step 4.2: Configure Frontend Build

Vercel should auto-detect React, but verify:

- **Framework Preset:** `Create React App`
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `build`
- **Install Command:** `npm install`

### Step 4.3: Add Environment Variables

Click **"Environment Variables"**, add:

| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | `https://propflow-backend.onrender.com` ← **Use your actual backend URL from Step 3.4** |
| `CI` | `false` |

### Step 4.4: Deploy Frontend

1. Click **"Deploy"**
2. ⏳ Wait 2-3 minutes for build
3. You'll get a URL like: `https://propflow-abc123.vercel.app`

---

## 🔗 PART 5: Connect Frontend & Backend

### Step 5.1: Update Backend CORS

1. Go back to Render dashboard
2. Open your **backend service** (`propflow-backend`)
3. Go to **"Environment"** tab
4. Find `FRONTEND_URL` variable
5. Update value to your Vercel URL: `https://propflow-abc123.vercel.app`
6. Click **"Save Changes"**
7. Backend will auto-redeploy (takes ~2 minutes)

### Step 5.2: Test Full Application

1. Visit your Vercel URL: `https://propflow-abc123.vercel.app`
2. Try logging in
3. Check if data loads from backend

**Common test endpoints:**
- Frontend: `https://your-app.vercel.app`
- Backend API: `https://your-backend.onrender.com/api/users`
- Health check: `https://your-backend.onrender.com/health`

---

## ✅ PART 6: Verification Checklist

### Backend Checks

```bash
# Test health endpoint
curl https://your-backend.onrender.com/health

# Expected response:
# {"status":"healthy","database":"connected",...}

# Test API endpoint
curl https://your-backend.onrender.com/api/users

# Should return users array or authentication error (not CORS error)
```

### Frontend Checks

1. ✅ Open browser DevTools (F12)
2. ✅ Go to your Vercel app
3. ✅ Check Console - should see no CORS errors
4. ✅ Check Network tab - API calls should succeed
5. ✅ Try login/logout
6. ✅ Try creating an appointment

### Database Checks

```bash
# Connect to database
mysql -h <your-host>.render.com -u <username> -p<password> propflow

# Check tables exist
SHOW TABLES;

# Should show: users, clients, properties, appointments, documents

# Check users
SELECT * FROM users LIMIT 5;
```

---

## 🔧 PART 7: Troubleshooting

### Problem 1: CORS Errors in Browser

**Symptoms:**
```
Access to fetch at 'https://backend.onrender.com/api/...' from origin 'https://app.vercel.app' 
has been blocked by CORS policy
```

**Solution:**
1. Check `FRONTEND_URL` in Render backend environment variables
2. Make sure it exactly matches your Vercel URL (no trailing slash)
3. Verify `ALLOW_VERCEL_PREVIEWS=true` is set
4. Redeploy backend after changes

### Problem 2: Database Connection Failed

**Symptoms:**
```json
{"status":"unhealthy","error":"Database connection failed"}
```

**Solution:**
1. Verify all DB credentials in Render environment variables
2. Check `DB_SSL=true` is set
3. Test connection manually:
   ```bash
   mysql -h <host> -u <user> -p<password> propflow
   ```
4. Check Render database is running (not suspended)

### Problem 3: Backend Not Responding / 503 Error

**Cause:** Render free tier spins down after 15 minutes of inactivity

**Solution:** 
- First request may take 30-60 seconds to wake up (this is normal)
- Consider using a service like UptimeRobot to ping every 14 minutes (free)
- Or accept the cold start delay

### Problem 4: Frontend Shows "Cannot read API_URL"

**Symptoms:**
```
Uncaught TypeError: Cannot read property 'REACT_APP_API_URL' of undefined
```

**Solution:**
1. Environment variables in Vercel **must** start with `REACT_APP_`
2. Check spelling: `REACT_APP_API_URL` (not `REACT_APP_API_BASE_URL`)
3. Redeploy frontend after adding env vars

### Problem 5: Build Fails - "Treating warnings as errors"

**Symptoms:**
```
Treating warnings as errors because process.env.CI = true
```

**Solution:**
1. Add `CI=false` to Vercel environment variables
2. Or fix the ESLint warnings in code
3. Redeploy

### Problem 6: MySQL Schema Not Found

**Solution:**
1. Make sure you imported the schema (Part 2.3)
2. Verify you're using the correct database name
3. Check tables exist:
   ```sql
   USE propflow;
   SHOW TABLES;
   ```

---

## 🎯 PART 8: Post-Deployment Setup

### Create Initial Admin User

Connect to your database and run:

```sql
USE propflow;

-- Insert admin user (password: admin123 - CHANGE THIS!)
INSERT INTO users (username, email, password, role, firstName, lastName)
VALUES (
  'admin',
  'admin@propflow.com',
  '$2a$10$rQZ5YZh5ZqZXZ3Z0Z8Z0ZeZ0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z',
  'admin',
  'Admin',
  'User'
);
```

**Or** use your backend API:

```bash
curl -X POST https://your-backend.onrender.com/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@propflow.com",
    "password": "Admin123!",
    "role": "admin",
    "firstName": "Admin",
    "lastName": "User"
  }'
```

### Set Up Custom Domain (Optional)

#### Vercel Custom Domain:
1. Go to Vercel project settings
2. Domains → Add domain
3. Follow DNS instructions

#### Render Custom Domain:
1. Go to backend service settings
2. Custom Domain → Add custom domain
3. Add CNAME record to your DNS

---

## 📊 Monitoring & Maintenance

### Free Tier Limitations

**Render Free Tier:**
- ✅ 750 hours/month (enough for 1 service 24/7)
- ⚠️ Spins down after 15 minutes of inactivity
- ⚠️ 90-second cold start
- ✅ 512 MB RAM
- ✅ Free SSL certificate

**Vercel Free Tier:**
- ✅ 100 GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ No cold starts
- ✅ Global CDN

**Render MySQL Free Tier:**
- ✅ 1 GB storage
- ✅ Automatically backed up
- ⚠️ Expires after 90 days of inactivity

### Keep Services Active

To prevent Render services from spinning down, use:

**Option 1: UptimeRobot (Free)**
1. Sign up at https://uptimerobot.com
2. Add monitor:
   - URL: `https://your-backend.onrender.com/health`
   - Interval: 5 minutes
3. This keeps backend warm

**Option 2: GitHub Actions (Free)**

Create `.github/workflows/keep-alive.yml`:

```yaml
name: Keep Render Alive
on:
  schedule:
    - cron: '*/14 * * * *'  # Every 14 minutes
jobs:
  keep-alive:
    runs-on: ubuntu-latest
    steps:
      - name: Ping backend
        run: curl https://your-backend.onrender.com/health
```

### Monitor Logs

**Render Logs:**
1. Go to service dashboard
2. Click "Logs" tab
3. See real-time logs

**Vercel Logs:**
1. Go to project dashboard
2. Click "Deployments"
3. Click specific deployment → View logs

---

## 🚀 Deployment Updates

### Update Backend Code

```bash
# Make changes to backend code
git add backend/
git commit -m "Updated backend logic"
git push origin main

# Render auto-deploys from main branch
# Wait 2-3 minutes for deployment
```

### Update Frontend Code

```bash
# Make changes to frontend code
git add frontend/
git commit -m "Updated frontend UI"
git push origin main

# Vercel auto-deploys from main branch
# Wait 1-2 minutes for deployment
```

### Update Database Schema

```bash
# Connect to production database
mysql -h <host> -u <user> -p<password> propflow

# Run migration
SOURCE path/to/migration.sql;

# Or use Sequelize migrations (recommended)
```

---

## 📝 Environment Variables Quick Reference

### Backend (Render)

```bash
NODE_ENV=production
PORT=10000
DB_HOST=dpg-xxxxx.render.com
DB_PORT=3306
DB_NAME=propflow
DB_USER=propflow_user
DB_PASSWORD=xxxxxxxxxxxxx
DB_SSL=true
DB_POOL_MAX=5
DB_POOL_MIN=1
FRONTEND_URL=https://your-app.vercel.app
ALLOW_VERCEL_PREVIEWS=true
```

### Frontend (Vercel)

```bash
REACT_APP_API_URL=https://your-backend.onrender.com
CI=false
```

---

## 🎉 Success Criteria

Your deployment is successful when:

1. ✅ Backend health check returns `{"status":"healthy","database":"connected"}`
2. ✅ Frontend loads without errors in browser console
3. ✅ Login works and returns JWT token
4. ✅ API calls from frontend to backend succeed
5. ✅ No CORS errors in browser console
6. ✅ Data persists in database between sessions
7. ✅ HTTPS works on both frontend and backend

---

## 💰 Cost Breakdown

| Service | Plan | Cost |
|---------|------|------|
| Render Web Service | Free | $0/month |
| Render MySQL | Free | $0/month |
| Vercel Hosting | Free | $0/month |
| GitHub Repository | Free | $0/month |
| **TOTAL** | | **$0/month** |

---

## 🆘 Getting Help

If you encounter issues:

1. **Check Render Logs:** Look for error messages
2. **Check Vercel Logs:** Check build and runtime logs
3. **Check Browser Console:** Look for CORS or network errors
4. **Test Health Endpoint:** `curl https://backend.onrender.com/health`
5. **Verify Environment Variables:** Double-check all values
6. **Check Database Connection:** Test MySQL connection manually

---

## 🔐 Security Reminders

1. ✅ Never commit `.env` files
2. ✅ Change default admin password immediately
3. ✅ Use strong database passwords
4. ✅ Keep dependencies updated (`npm audit fix`)
5. ✅ Enable 2FA on GitHub, Vercel, and Render accounts
6. ✅ Rotate database credentials periodically

---

**Congratulations! Your PropFlow app is now deployed 100% free!** 🎊

Need help? Check the troubleshooting section or review the logs in Render/Vercel dashboards.
