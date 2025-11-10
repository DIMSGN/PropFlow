# Pre-Deployment Checklist

Before pushing to GitHub, verify these steps:

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

## � Post-Setup

- [ ] Test login with admin credentials
- [ ] Create a test client
- [ ] Create a test property
- [ ] Create a test appointment
- [ ] Upload a test document
- [ ] Verify all features work

## 🎉 Done!

Your app is now ready for development!

## 🐛 Troubleshooting

If something doesn't work:

1. **Check logs**: Review terminal output for errors
2. **Check environment variables**: Verify .env files are configured correctly
3. **Verify database connection**: Ensure MySQL is running and credentials are correct
4. **CORS issues**: Verify backend and frontend URLs are configured properly
5. **Build fails**: Check Node version (must be >= 18.0.0)

## 📚 Resources

- GitHub Docs: https://docs.github.com/
- Project Documentation: See SETUP.md for detailed guide

---

**Good luck with your development! 🚀**
