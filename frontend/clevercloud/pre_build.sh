#!/bin/bash

echo "==> Frontend Pre-Build Hook Started"
echo "==> Current directory: $(pwd)"

# Fix permissions for node_modules binaries
echo "==> Fixing permissions..."
find node_modules/.bin -type f -exec chmod +x {} \; 2>/dev/null || true

echo "==> Pre-build completed!"
