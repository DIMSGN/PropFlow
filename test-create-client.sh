#!/bin/bash

# Test creating a client with the exact data from your screenshot
API_URL="https://propflow-8k3o.onrender.com/api"

echo "Testing client creation with data from screenshot..."
echo "=================================================="

# Login first to get token (if needed)
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/users/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@goldenvisa.gr",
    "password": "password123"
  }')

echo "Login response:"
echo "$LOGIN_RESPONSE" | jq '.'

# Extract token if auth is required
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token // empty')

echo ""
echo "Creating client (Δημήτρης Σιγανός)..."
echo "-----------------------------------"

# Create client with the data from screenshot
if [ -n "$TOKEN" ]; then
  CREATE_RESPONSE=$(curl -s -X POST "$API_URL/clients" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
      "first_name": "Δημήτρης",
      "last_name": "Σιγανός",
      "email": "stganos.dimitrios@gmail.com",
      "phone": "6988604395",
      "nationality": "gr",
      "passport_number": ""
    }')
else
  CREATE_RESPONSE=$(curl -s -X POST "$API_URL/clients" \
    -H "Content-Type: application/json" \
    -d '{
      "first_name": "Δημήτρης",
      "last_name": "Σιγανός",
      "email": "stganos.dimitrios@gmail.com",
      "phone": "6988604395",
      "nationality": "gr",
      "passport_number": ""
    }')
fi

echo "$CREATE_RESPONSE" | jq '.'

echo ""
echo "Test complete!"
