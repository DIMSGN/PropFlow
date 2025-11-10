#!/bin/bash
set -e

echo "==> CleverCloud Post-Build Hook Started"
echo "==> Current directory: $(pwd)"
echo "==> Installing backend dependencies..."

cd backend
npm install --production
echo "==> Backend dependencies installed!"

echo "==> Checking installed packages:"
ls -la node_modules | head -20

echo "==> Post-build completed successfully!"
