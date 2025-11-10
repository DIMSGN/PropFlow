# ✅ PropFlow Deployment - Master Checklist

**Use this checklist to track your deployment progress.**

---

## 📋 PRE-DEPLOYMENT (Before You Start)

### Account Setup
- [ ] Created GitHub account
- [ ] Created Render account (https://render.com)
- [ ] Created Vercel account (https://vercel.com)

### Documentation Review
- [ ] Read `DEPLOYMENT_README.md` (5 min)
- [ ] Read `DEPLOYMENT_GUIDE.md` Parts 1-2 (15 min)
- [ ] Bookmarked `DEPLOYMENT_QUICK_REF.md` for reference

### Local Setup Verification
- [ ] Run `bash pre-flight-check.sh` - all checks pass
- [ ] Backend `.env.example` reviewed
- [ ] Frontend `.env.example` reviewed
- [ ] Database `schema.sql` file exists

---

## 🗂️ PART 1: GitHub Repository

- [ ] Git initialized in project
- [ ] `.gitignore` file exists
- [ ] Verified no `.env` files are tracked
- [ ] Created repository on GitHub
- [ ] Pushed code to `main` branch
- [ ] Verified all files are on GitHub

**Checkpoint:** Visit your GitHub repo - all code should be visible

---

## 🗄️ PART 2: Database (Render MySQL)

### Create Database
- [ ] Logged into Render dashboard
- [ ] Clicked "New +" → "MySQL"
- [ ] Named database: `propflow-db`
- [ ] Selected region (same you'll use for backend)
- [ ] Selected **Free** plan
- [ ] Clicked "Create Database"
- [ ] Waited for provisioning (2-3 minutes)

### Save Credentials
Copy these from Render dashboard and save securely:

- [ ] **DB_HOST:** `______________________________`
- [ ] **DB_PORT:** `3306`
- [ ] **DB_NAME:** `propflow`
- [ ] **DB_USER:** `______________________________`
- [ ] **DB_PASSWORD:** `______________________________`

### Import Schema
- [ ] Installed MySQL client locally
- [ ] Connected to Render database
- [ ] Imported `database/schema.sql`
- [ ] Verified tables created: `SHOW TABLES;`
- [ ] Should see: users, clients, properties, appointments, documents

**Checkpoint:** Run `SHOW TABLES;` - should list 5+ tables

---

## ⚙️ PART 3: Backend (Render Web Service)

### Create Web Service
- [ ] Clicked "New +" → "Web Service"
- [ ] Connected GitHub account
- [ ] Selected `propflow` repository
- [ ] Selected `main` branch

### Configure Service
- [ ] **Name:** `propflow-backend`
- [ ] **Region:** Same as database
- [ ] **Root Directory:** `backend`
- [ ] **Runtime:** Node
- [ ] **Build Command:** `npm install`
- [ ] **Start Command:** `npm start`
- [ ] **Plan:** Free

### Add Environment Variables
Click "Advanced" → Add these variables:

- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `10000`
- [ ] `DB_HOST` = (from Part 2)
- [ ] `DB_PORT` = `3306`
- [ ] `DB_NAME` = `propflow`
- [ ] `DB_USER` = (from Part 2)
- [ ] `DB_PASSWORD` = (from Part 2)
- [ ] `DB_SSL` = `true`
- [ ] `DB_POOL_MAX` = `5`
- [ ] `DB_POOL_MIN` = `1`
- [ ] `FRONTEND_URL` = `https://temp.vercel.app` (will update later)
- [ ] `ALLOW_VERCEL_PREVIEWS` = `true`

### Deploy & Test
- [ ] Clicked "Create Web Service"
- [ ] Waited for deployment (3-5 minutes)
- [ ] **Backend URL:** `______________________________`
- [ ] Visited: `https://your-backend.onrender.com/health`
- [ ] Got response: `{"status":"healthy","database":"connected"}`

**Checkpoint:** Health check must return status "healthy"

---

## 🎨 PART 4: Frontend (Vercel)

### Import Project
- [ ] Logged into Vercel dashboard
- [ ] Clicked "Add New..." → "Project"
- [ ] Imported `propflow` GitHub repository
- [ ] Selected repository to import

### Configure Build
- [ ] **Framework:** Create React App (auto-detected)
- [ ] **Root Directory:** `frontend`
- [ ] **Build Command:** `npm run build`
- [ ] **Output Directory:** `build`
- [ ] **Install Command:** `npm install`

### Add Environment Variables
- [ ] `REACT_APP_API_URL` = (your backend URL from Part 3)
- [ ] `CI` = `false`

### Deploy & Save URL
- [ ] Clicked "Deploy"
- [ ] Waited for build (2-3 minutes)
- [ ] **Frontend URL:** `______________________________`
- [ ] Visited frontend URL
- [ ] Page loads (might have API errors - OK for now)

**Checkpoint:** Frontend should load (even if API fails)

---

## 🔗 PART 5: Connect Frontend & Backend

### Update Backend CORS
- [ ] Went back to Render dashboard
- [ ] Opened backend service
- [ ] Clicked "Environment" tab
- [ ] Found `FRONTEND_URL` variable
- [ ] Updated to actual Vercel URL (from Part 4)
- [ ] Saved changes
- [ ] Waited for auto-redeploy (2 minutes)

**Checkpoint:** Backend redeployed with new FRONTEND_URL

---

## 🧪 PART 6: Testing

### Backend Tests
- [ ] Visited: `https://your-backend.onrender.com/health`
- [ ] Status: `"healthy"`
- [ ] Database: `"connected"`
- [ ] No errors in response

### Frontend Tests
- [ ] Opened frontend: `https://your-app.vercel.app`
- [ ] Opened browser DevTools (F12)
- [ ] **Console tab:** No CORS errors
- [ ] **Network tab:** API calls succeed (or 401 auth error - OK)
- [ ] Page renders without crashing

### Integration Tests
- [ ] Opened login page
- [ ] Attempted login (might fail - no users yet - OK)
- [ ] No CORS errors appear
- [ ] API calls reach backend (check Network tab)

**Checkpoint:** No CORS errors. API calls reach backend.

---

## 👤 PART 7: Create Admin User

Choose one method:

### Method A: SQL (Recommended)
- [ ] Connected to Render MySQL
- [ ] Ran INSERT statement for admin user
- [ ] Verified: `SELECT * FROM users;`

### Method B: API
- [ ] Used curl/Postman to call `/api/users/register`
- [ ] Created admin user via API
- [ ] Got success response

### Test Login
- [ ] Visited frontend login page
- [ ] Entered admin credentials
- [ ] Successfully logged in
- [ ] Redirected to dashboard

**Checkpoint:** Can log in with admin account

---

## ✅ PART 8: Final Verification

### Feature Tests
- [ ] **Login:** Works with admin account
- [ ] **Dashboard:** Loads without errors
- [ ] **Clients:** Can create a test client
- [ ] **Properties:** Can create a test property
- [ ] **Appointments:** Can create a test appointment
- [ ] **Data Persistence:** Refresh page - data still there

### Technical Checks
- [ ] Frontend URL uses HTTPS ✓
- [ ] Backend URL uses HTTPS ✓
- [ ] No console errors ✓
- [ ] No CORS errors ✓
- [ ] Health endpoint healthy ✓
- [ ] Database connected ✓

### Security
- [ ] Changed admin password from default
- [ ] No .env files in GitHub repo
- [ ] Environment variables secure in Render/Vercel
- [ ] All credentials saved securely

**Checkpoint:** All features work end-to-end

---

## 🎉 POST-DEPLOYMENT

### Optional but Recommended
- [ ] Set up UptimeRobot to keep backend warm
- [ ] Configured custom domain (optional)
- [ ] Set up error monitoring (optional)
- [ ] Created additional user accounts
- [ ] Imported initial data (if any)

### Documentation
- [ ] Saved all URLs securely
- [ ] Documented admin credentials
- [ ] Bookmarked Render dashboard
- [ ] Bookmarked Vercel dashboard

### Share Your Success!
- [ ] App is live at: `______________________________`
- [ ] Tested with real users
- [ ] Collected feedback
- [ ] Celebrated! 🎊

---

## 📊 Deployment Status

**Date Started:** _______________  
**Date Completed:** _______________  
**Total Time:** _______________ minutes

**Services Created:**
- ✅ Render MySQL Database
- ✅ Render Web Service (Backend)
- ✅ Vercel App (Frontend)

**URLs:**
- Frontend: _______________________________________________
- Backend: _______________________________________________
- Health: _______________________________________________

**Total Cost:** $0/month 💰

---

## 🆘 If You Get Stuck

**Current Step:** _______________

**Issue:** _______________________________________________

**Where to Look:**
1. `DEPLOYMENT_GUIDE.md` Part 7 (Troubleshooting)
2. `DEPLOYMENT_QUICK_REF.md` (Common Issues)
3. Service logs in Render/Vercel dashboards
4. Browser console (F12)

**Common Solutions:**
- CORS Error → Check FRONTEND_URL matches exactly
- DB Error → Verify DB_SSL=true and credentials
- Build Error → Check CI=false in Vercel
- 504 Error → Wait 60s for cold start

---

## 🎯 Success!

When all items are checked above, your PropFlow app is:

✅ **Deployed** - Live on the internet  
✅ **Secure** - HTTPS everywhere  
✅ **Free** - $0/month forever  
✅ **Scalable** - Can handle growth  
✅ **Backed up** - Database auto-backups  
✅ **Production-ready** - Fully functional  

**Congratulations!** 🎉🚀

---

*Print this checklist and check off items as you complete them.*  
*Estimated total time: 30-60 minutes*
