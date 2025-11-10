# CleverCloud Deployment Guide

## Quick Setup

### Prerequisites
- CleverCloud account (free tier available)
- MySQL database addon
- Git installed locally

---

## 🚀 Backend Deployment

### 1. Create Backend Application

```bash
# Login to CleverCloud
clever login

# Create Node.js application
clever create --type node propflow-backend --region par
```

### 2. Add MySQL Addon

```bash
# Add MySQL addon (free tier: XS Small Space)
clever addon create mysql-addon propflow-db --plan xs_sml --region par --link propflow-backend
```

**CleverCloud will auto-inject these environment variables:**
- `MYSQL_ADDON_DB`
- `MYSQL_ADDON_USER`
- `MYSQL_ADDON_PASSWORD`
- `MYSQL_ADDON_HOST`
- `MYSQL_ADDON_PORT`

### 3. Configure Backend Environment

Set these in CleverCloud Console (or via CLI):

```bash
# Required
clever env set NODE_ENV production
clever env set SYNC_DB false
clever env set FRONTEND_URL https://your-frontend-app.cleverapps.io

# Optional
clever env set DB_POOL_MAX 20
clever env set DB_POOL_MIN 5
```

### 4. Import Database Schema

```bash
# Get MySQL credentials
clever env | grep MYSQL

# Connect to database
mysql -h <MYSQL_ADDON_HOST> -u <MYSQL_ADDON_USER> -p<MYSQL_ADDON_PASSWORD> <MYSQL_ADDON_DB>

# Import schema
source database/clevercloud-schema.sql
```

### 5. Deploy Backend

```bash
# Add clever remote
cd backend
clever link propflow-backend

# Deploy
git push clever master
```

Backend will be available at: `https://propflow-backend.cleverapps.io`

---

## 🎨 Frontend Deployment

### 1. Create Frontend Application

```bash
# Create static application
clever create --type static propflow-frontend --region par
```

### 2. Configure Frontend Build

The build scripts are already configured in `frontend/package.json`:
```json
{
  "scripts": {
    "build": "CI=false node node_modules/react-scripts/bin/react-scripts.js build"
  }
}
```

### 3. Set Frontend Environment

```bash
# Set backend API URL
clever env set REACT_APP_API_URL https://propflow-backend.cleverapps.io

# Set Node environment
clever env set NODE_ENV production
```

### 4. Deploy Frontend

```bash
cd frontend
clever link propflow-frontend

# Deploy
git push clever master
```

Frontend will be available at: `https://propflow-frontend.cleverapps.io`

---

## 📝 Post-Deployment

### 1. Create Admin User

Connect to your MySQL database and run:

```sql
INSERT INTO Users (full_name, email, password_hash, role, is_active, createdAt, updatedAt)
VALUES (
  'Admin User',
  'admin@yourdomain.com',
  '$2a$10$YourHashedPasswordHere',
  'admin',
  1,
  NOW(),
  NOW()
);
```

Generate password hash locally:
```bash
node -e "console.log(require('bcryptjs').hashSync('your_password', 10))"
```

### 2. Update CORS

Make sure `FRONTEND_URL` environment variable matches your actual frontend URL.

### 3. Test API

```bash
# Health check
curl https://propflow-backend.cleverapps.io/health

# Should return:
# {"status":"healthy","timestamp":"...","uptime":123,"environment":"production","database":"connected"}
```

---

## 🔧 Useful Commands

```bash
# View logs
clever logs

# Check environment variables
clever env

# Restart application
clever restart

# Open in browser
clever open

# Check application status
clever status

# SSH into container (debugging)
clever ssh
```

---

## 📊 Monitoring

### CleverCloud Console
- Access metrics at: https://console.clever-cloud.com/
- Monitor: CPU, RAM, Database connections, HTTP requests

### Application Logs
```bash
# Follow logs in real-time
clever logs -f

# Filter errors only
clever logs | grep ERROR
```

---

## ⚠️ Important Notes

1. **Database Sync is DISABLED** in production (SYNC_DB=false)
   - Schema changes must be done manually via SQL migrations

2. **Free Tier Limitations:**
   - Backend: Limited CPU/RAM (sleeps after 30 min inactivity)
   - Database: XS Small Space (256MB storage)
   - May experience cold starts

3. **Uploads Folder:**
   - Files uploaded via API are stored in container
   - **NOT PERSISTENT** - use cloud storage (AWS S3, Cloudinary) for production

4. **HTTPS is automatic** on CleverCloud
   - All `.cleverapps.io` domains have SSL certificates

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check logs
clever logs

# Common issues:
# - Missing environment variables
# - Database connection failed
# - Wrong Node version (needs >= 18.0.0)
```

### Database connection errors
```bash
# Verify MySQL addon is linked
clever addon

# Check database credentials
clever env | grep MYSQL

# Test connection manually
mysql -h <HOST> -u <USER> -p<PASSWORD> <DB>
```

### Frontend can't reach backend
```bash
# Verify REACT_APP_API_URL is set correctly
clever env | grep REACT_APP_API_URL

# Check CORS settings in backend
clever env | grep FRONTEND_URL

# Ensure backend is running
curl https://your-backend.cleverapps.io/health
```

### App goes to sleep (Free tier)
- Free tier apps sleep after 30 minutes of inactivity
- First request after sleep will be slow (cold start)
- Upgrade to paid tier for always-on applications

---

## 🚀 Quick Reference

```bash
# Full deployment from scratch
clever login
clever create --type node propflow-backend --region par
clever addon create mysql-addon propflow-db --plan xs_sml --link propflow-backend
clever env set NODE_ENV production
clever env set SYNC_DB false
clever env set FRONTEND_URL https://your-frontend.cleverapps.io
cd backend && git push clever master

clever create --type static propflow-frontend --region par
clever env set REACT_APP_API_URL https://your-backend.cleverapps.io
cd frontend && git push clever master
```

---

## 📧 Support

- CleverCloud Docs: https://www.clever-cloud.com/doc/
- CleverCloud Support: https://console.clever-cloud.com/
- Project Issues: Your GitHub repository

---

**Happy Deploying! 🎉**
