#!/bin/bash

# Create Admin User
echo "Creating admin user..."
curl -X POST "https://propflow-8k3o.onrender.com/api/users" \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Admin User","email":"admin@goldenvisa.gr","password":"password123","role":"admin"}'

echo -e "\n\n"

# Create Agent User
echo "Creating agent user..."
curl -X POST "https://propflow-8k3o.onrender.com/api/users" \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Agent User","email":"agent@goldenvisa.gr","password":"password123","role":"agent"}'

echo -e "\n\nDemo users created!"
