# Pre-Deployment Checklist

Before pushing to GitHub and deploying to CleverCloud, verify these steps:

## ✅ Git & GitHub Setup

- [ ] **Initialize Git** (if not already done):
  ```bash
  git init
  git add .
  git commit -m "Initial commit - PropFlow v1.0"
  ```

- [ ] **Create GitHub Repository**:
  - Go to https://github.com/new
  - Create repository named `PropFlow` (or your preferred name)
  - Don't initialize with README (you already have one)

- [ ] **Add Remote & Push**:
  ```bash
  git remote add origin https://github.com/YOUR_USERNAME/PropFlow.git
  git branch -M main
  git push -u origin main
  ```

## ✅ Environment Variables

- [ ] **Backend .env** exists and is configured (not pushed to GitHub)
- [ ] **Frontend .env** exists and is configured (not pushed to GitHub)
- [ ] **Both .env.example files** are created (will be pushed)

## ✅ Files to Verify

- [ ] `.gitignore` includes:
  - `node_modules/`
  - `.env` files
  - `TECHNICAL_REVIEW.md`
  - `backend/uploads/*` (except .gitkeep)

- [ ] `backend/uploads/.gitkeep` exists (keeps folder in git)

- [ ] No sensitive data in code:
  - No actual passwords
  - No API keys
  - No database credentials

## ✅ Documentation

- [ ] **README.md** - Updated with deployment info
- [ ] **SETUP.md** - Installation guide
- [ ] **API.md** - API documentation
- [ ] **DEPLOYMENT.md** - CleverCloud deployment guide
- [ ] **TECHNICAL_REVIEW.md** - Excluded from git (in .gitignore)

## ✅ Code Quality Check

- [ ] Remove any test/debug code you don't want public
- [ ] Check for console.log with sensitive data
- [ ] Verify all imports are correct
- [ ] Run a test build locally:
  ```bash
  cd frontend && npm run build
  cd ../backend && node server.js
  ```

## ✅ Database

- [ ] **Schema files** in `database/` folder
- [ ] Schema is up-to-date with your models
- [ ] Test data is NOT included (or clearly marked as sample data)

## 🚀 Ready to Deploy to CleverCloud

Once pushed to GitHub, follow these steps:

### 1. Install CleverCloud CLI
```bash
npm install -g clever-tools
clever login
```

### 2. Deploy Backend
```bash
cd backend

# Create application
clever create --type node propflow-backend --region par

# Add MySQL addon
clever addon create mysql-addon propflow-db --plan xs_sml --region par --link propflow-backend

# Set environment variables
clever env set NODE_ENV production
clever env set SYNC_DB false
clever env set FRONTEND_URL https://your-frontend-app.cleverapps.io

# Link and deploy
clever link propflow-backend
git push clever master
```

### 3. Import Database Schema
```bash
# Get MySQL credentials
clever env | grep MYSQL

# Connect and import
mysql -h <HOST> -u <USER> -p<PASSWORD> <DB> < ../database/clevercloud-schema.sql
```

### 4. Create Admin User
```bash
# Generate password hash
node -e "console.log(require('bcryptjs').hashSync('your_password', 10))"

# Insert user (connect to MySQL first)
INSERT INTO Users (full_name, email, password_hash, role, is_active, createdAt, updatedAt)
VALUES ('Admin', 'admin@yourdomain.com', '<hash>', 'admin', 1, NOW(), NOW());
```

### 5. Deploy Frontend
```bash
cd ../frontend

# Create application
clever create --type static propflow-frontend --region par

# Set environment
clever env set REACT_APP_API_URL https://propflow-backend.cleverapps.io
clever env set NODE_ENV production

# Link and deploy
clever link propflow-frontend
git push clever master
```

### 6. Test Deployment
```bash
# Backend health check
curl https://propflow-backend.cleverapps.io/health

# Open frontend
clever open --alias propflow-frontend
```

## 📝 Post-Deployment

- [ ] Test login with admin credentials
- [ ] Create a test client
- [ ] Create a test property
- [ ] Create a test appointment
- [ ] Upload a test document
- [ ] Verify all features work

## 🎉 Done!

Your app is now live! Share the URL:
- Frontend: `https://propflow-frontend.cleverapps.io`
- Backend: `https://propflow-backend.cleverapps.io`

## 🐛 Troubleshooting

If something doesn't work:

1. **Check logs**: `clever logs -f`
2. **Check environment variables**: `clever env`
3. **Verify database connection**: Check MySQL addon is linked
4. **CORS issues**: Verify FRONTEND_URL matches actual frontend URL
5. **Build fails**: Check Node version (must be >= 18.0.0)

## 📚 Resources

- CleverCloud Docs: https://www.clever-cloud.com/doc/
- GitHub Docs: https://docs.github.com/
- Project Documentation: See DEPLOYMENT.md for detailed guide

---

**Good luck with your deployment! 🚀**
