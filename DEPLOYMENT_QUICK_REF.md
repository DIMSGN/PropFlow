# 🚨 PropFlow Deployment - Quick Reference

## 🔑 Critical Environment Variables

### Backend (Render) - All Required!
```bash
NODE_ENV=production
PORT=10000
DB_HOST=<from-render-mysql-dashboard>
DB_PORT=3306
DB_NAME=propflow
DB_USER=<from-render-mysql-dashboard>
DB_PASSWORD=<from-render-mysql-dashboard>
DB_SSL=true
FRONTEND_URL=https://your-app.vercel.app
ALLOW_VERCEL_PREVIEWS=true
```

### Frontend (Vercel) - All Required!
```bash
REACT_APP_API_URL=https://your-backend.onrender.com
CI=false
```

---

## 📝 Deployment Order (IMPORTANT!)

**Follow this exact order:**

1. ✅ **Push code to GitHub** (main branch)
2. ✅ **Create Render MySQL database** → Get credentials
3. ✅ **Import schema to database** → Use mysql client
4. ✅ **Deploy backend to Render** → Add all env vars
5. ✅ **Test backend** → Visit `/health` endpoint
6. ✅ **Deploy frontend to Vercel** → Add env vars
7. ✅ **Update backend FRONTEND_URL** → Use Vercel URL
8. ✅ **Test full app** → Login, create data

---

## ⚡ Quick Commands

### Test Backend Health
```bash
curl https://your-backend.onrender.com/health
# Expected: {"status":"healthy","database":"connected"}
```

### Import Database Schema
```bash
mysql -h <host> -u <user> -p<password> propflow < database/schema.sql
```

### Check Git Status
```bash
git status
git add .
git commit -m "Ready for deployment"
git push origin main
```

---

## 🐛 Common Issues & Fixes

### Issue 1: CORS Error
**Error:** `blocked by CORS policy`
**Fix:** 
- Check `FRONTEND_URL` matches exactly (no trailing /)
- Set `ALLOW_VERCEL_PREVIEWS=true`
- Redeploy backend

### Issue 2: Database Not Connected
**Error:** `{"status":"unhealthy","error":"Database connection failed"}`
**Fix:**
- Verify all DB_* variables
- Set `DB_SSL=true`
- Check database is active in Render

### Issue 3: API URL Undefined
**Error:** `Cannot read property 'REACT_APP_API_URL'`
**Fix:**
- Must start with `REACT_APP_`
- Redeploy frontend after adding

### Issue 4: 503 Service Unavailable
**Cause:** Render free tier cold start (15min inactivity)
**Fix:** Wait 30-60 seconds, refresh

---

## 🔗 Important URLs

### Development
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- Health: http://localhost:3001/health

### Production
- Frontend: https://[your-app].vercel.app
- Backend: https://[your-backend].onrender.com
- Health: https://[your-backend].onrender.com/health

---

## ✅ Validation Checklist

Before marking deployment complete:

- [ ] Health endpoint returns healthy + connected
- [ ] Frontend loads without console errors
- [ ] No CORS errors in browser
- [ ] Login works
- [ ] Can create appointments/clients/properties
- [ ] Data persists after page refresh
- [ ] HTTPS works on both URLs

---

## 📞 Support Resources

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- Full Guide: See `DEPLOYMENT_GUIDE.md`

---

**Last Updated:** November 2025
