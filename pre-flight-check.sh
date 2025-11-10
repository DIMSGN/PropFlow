#!/bin/bash

# PropFlow Deployment Pre-Flight Check
# Run this script before deploying to verify everything is ready

echo "🚀 PropFlow Deployment Pre-Flight Check"
echo "========================================"
echo ""

# Check if we're in the right directory
if [ ! -f "backend/server.js" ] || [ ! -f "frontend/package.json" ]; then
    echo "❌ ERROR: Must run from PropFlow root directory"
    exit 1
fi

echo "✅ Directory structure correct"

# Check Git
if ! command -v git &> /dev/null; then
    echo "❌ Git not installed"
    exit 1
fi
echo "✅ Git installed"

# Check if git repo initialized
if [ ! -d ".git" ]; then
    echo "⚠️  WARNING: Git not initialized. Run: git init"
else
    echo "✅ Git repository initialized"
fi

# Check for .env files in repo (should NOT exist)
if git ls-files | grep -q "\.env$"; then
    echo "❌ ERROR: .env files are tracked by Git! Add to .gitignore"
    exit 1
fi
echo "✅ No .env files in Git"

# Check if .gitignore exists
if [ ! -f ".gitignore" ]; then
    echo "⚠️  WARNING: .gitignore missing"
else
    echo "✅ .gitignore exists"
fi

# Check backend files
echo ""
echo "Backend Checks:"
echo "---------------"

if [ -f "backend/render.yaml" ]; then
    echo "✅ backend/render.yaml exists"
else
    echo "❌ backend/render.yaml missing"
fi

if [ -f "backend/.env.example" ]; then
    echo "✅ backend/.env.example exists"
else
    echo "❌ backend/.env.example missing"
fi

if [ -f "backend/package.json" ]; then
    if grep -q '"start": "node server.js"' backend/package.json; then
        echo "✅ backend start script correct"
    else
        echo "❌ backend start script incorrect"
    fi
else
    echo "❌ backend/package.json missing"
fi

# Check frontend files
echo ""
echo "Frontend Checks:"
echo "----------------"

if [ -f "frontend/vercel.json" ]; then
    echo "✅ frontend/vercel.json exists"
else
    echo "❌ frontend/vercel.json missing"
fi

if [ -f "frontend/.env.example" ]; then
    echo "✅ frontend/.env.example exists"
else
    echo "❌ frontend/.env.example missing"
fi

if [ -f "frontend/package.json" ]; then
    if grep -q '"build": "react-scripts build"' frontend/package.json; then
        echo "✅ frontend build script correct"
    else
        echo "⚠️  frontend build script may need review"
    fi
else
    echo "❌ frontend/package.json missing"
fi

# Check documentation
echo ""
echo "Documentation Checks:"
echo "---------------------"

DOCS=("DEPLOYMENT_GUIDE.md" "DEPLOYMENT_QUICK_REF.md" "DEPLOYMENT_SUMMARY.md" "VALIDATION_REPORT.md")

for doc in "${DOCS[@]}"; do
    if [ -f "$doc" ]; then
        echo "✅ $doc exists"
    else
        echo "❌ $doc missing"
    fi
done

# Check database schema
echo ""
echo "Database Checks:"
echo "----------------"

if [ -f "database/schema.sql" ]; then
    echo "✅ database/schema.sql exists"
else
    echo "⚠️  database/schema.sql missing - you'll need this!"
fi

# Final summary
echo ""
echo "========================================"
echo "Pre-Flight Check Complete!"
echo ""
echo "Next Steps:"
echo "1. Read DEPLOYMENT_GUIDE.md"
echo "2. Create GitHub repository"
echo "3. Sign up for Render & Vercel"
echo "4. Follow deployment steps"
echo ""
echo "Good luck! 🚀"
