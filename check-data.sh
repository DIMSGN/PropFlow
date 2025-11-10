#!/bin/bash

API_URL="https://propflow-8k3o.onrender.com/api"

echo "🔍 Checking Database Content..."
echo "================================"
echo ""

echo "👥 CLIENTS:"
curl -s "$API_URL/clients" | head -c 500
echo ""
echo ""

echo "🏠 PROPERTIES:"
curl -s "$API_URL/properties" | head -c 500
echo ""
echo ""

echo "📅 APPOINTMENTS:"
curl -s "$API_URL/appointments" | head -c 500
echo ""
echo ""

echo "================================"
