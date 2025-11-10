#!/bin/bash

echo "Testing login for admin@goldenvisa.gr..."
curl -X POST "https://propflow-8k3o.onrender.com/api/users/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@goldenvisa.gr","password":"password123"}'

echo -e "\n\n"

echo "Testing login for agent@goldenvisa.gr..."
curl -X POST "https://propflow-8k3o.onrender.com/api/users/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"agent@goldenvisa.gr","password":"password123"}'

echo -e "\n\nLogin tests complete!"
