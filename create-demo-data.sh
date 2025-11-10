#!/bin/bash

API_URL="https://propflow-8k3o.onrender.com/api"

echo "🎨 Creating Demo Data for PropFlow..."
echo "======================================"
echo ""

# Create 5 Clients
echo "📋 Creating 5 Clients..."
echo ""

CLIENT1=$(curl -s -X POST "$API_URL/clients" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Dimitris",
    "last_name": "Papadopoulos",
    "email": "dimitris.p@example.com",
    "phone": "+30 210 123 4567",
    "nationality": "Greek",
    "passport_number": "GR1234567"
  }')
echo "✅ Client 1: Dimitris Papadopoulos"

CLIENT2=$(curl -s -X POST "$API_URL/clients" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Maria",
    "last_name": "Georgiou",
    "email": "maria.g@example.com",
    "phone": "+30 210 234 5678",
    "nationality": "Greek",
    "passport_number": "GR2345678"
  }')
echo "✅ Client 2: Maria Georgiou"

CLIENT3=$(curl -s -X POST "$API_URL/clients" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Anderson",
    "email": "john.anderson@example.com",
    "phone": "+44 20 7123 4567",
    "nationality": "British",
    "passport_number": "GB9876543"
  }')
echo "✅ Client 3: John Anderson"

CLIENT4=$(curl -s -X POST "$API_URL/clients" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Sofia",
    "last_name": "Petrov",
    "email": "sofia.petrov@example.com",
    "phone": "+7 495 123 4567",
    "nationality": "Russian",
    "passport_number": "RU5432109"
  }')
echo "✅ Client 4: Sofia Petrov"

CLIENT5=$(curl -s -X POST "$API_URL/clients" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Ahmed",
    "last_name": "Al-Rashid",
    "email": "ahmed.rashid@example.com",
    "phone": "+971 4 123 4567",
    "nationality": "Emirati",
    "passport_number": "AE6789012"
  }')
echo "✅ Client 5: Ahmed Al-Rashid"

# Extract client IDs
CLIENT1_ID=$(echo $CLIENT1 | grep -o '"id":[0-9]*' | grep -o '[0-9]*' | head -1)
CLIENT2_ID=$(echo $CLIENT2 | grep -o '"id":[0-9]*' | grep -o '[0-9]*' | head -1)
CLIENT3_ID=$(echo $CLIENT3 | grep -o '"id":[0-9]*' | grep -o '[0-9]*' | head -1)
CLIENT4_ID=$(echo $CLIENT4 | grep -o '"id":[0-9]*' | grep -o '[0-9]*' | head -1)
CLIENT5_ID=$(echo $CLIENT5 | grep -o '"id":[0-9]*' | grep -o '[0-9]*' | head -1)

echo ""
echo "🏠 Creating 5 Properties..."
echo ""

PROP1=$(curl -s -X POST "$API_URL/properties" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Luxury Apartment in Kolonaki\",
    \"address\": \"Kolonaki Square, Athens 10673\",
    \"city\": \"Athens\",
    \"price\": 450000,
    \"description\": \"3-bedroom luxury apartment with Acropolis view, 150 sqm, fully renovated\",
    \"status\": \"available\",
    \"clientId\": $CLIENT1_ID
  }")
echo "✅ Property 1: Luxury Apartment in Kolonaki"

PROP2=$(curl -s -X POST "$API_URL/properties" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Beachfront Villa in Mykonos\",
    \"address\": \"Agios Ioannis Beach, Mykonos 84600\",
    \"city\": \"Mykonos\",
    \"price\": 1250000,
    \"description\": \"Stunning 5-bedroom villa with private pool and beach access, 300 sqm\",
    \"status\": \"available\",
    \"clientId\": $CLIENT4_ID
  }")
echo "✅ Property 2: Beachfront Villa in Mykonos"

PROP3=$(curl -s -X POST "$API_URL/properties" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Commercial Building in Syntagma\",
    \"address\": \"Syntagma Square, Athens 10563\",
    \"city\": \"Athens\",
    \"price\": 2500000,
    \"description\": \"Prime location commercial building, 8 floors, ideal for offices or hotel\",
    \"status\": \"reserved\",
    \"clientId\": $CLIENT5_ID
  }")
echo "✅ Property 3: Commercial Building in Syntagma"

PROP4=$(curl -s -X POST "$API_URL/properties" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Modern Penthouse in Glyfada\",
    \"address\": \"Marina Glyfada, Athens 16675\",
    \"city\": \"Athens\",
    \"price\": 850000,
    \"description\": \"4-bedroom penthouse with sea view, rooftop terrace, 200 sqm\",
    \"status\": \"available\",
    \"clientId\": $CLIENT2_ID
  }")
echo "✅ Property 4: Modern Penthouse in Glyfada"

PROP5=$(curl -s -X POST "$API_URL/properties" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Investment Apartment in Thessaloniki\",
    \"address\": \"Aristotelous Square, Thessaloniki 54624\",
    \"city\": \"Thessaloniki\",
    \"price\": 280000,
    \"description\": \"2-bedroom apartment in city center, high rental yield potential, 85 sqm\",
    \"status\": \"sold\",
    \"clientId\": $CLIENT3_ID
  }")
echo "✅ Property 5: Investment Apartment in Thessaloniki"

# Extract property IDs
PROP1_ID=$(echo $PROP1 | grep -o '"id":[0-9]*' | grep -o '[0-9]*' | head -1)
PROP2_ID=$(echo $PROP2 | grep -o '"id":[0-9]*' | grep -o '[0-9]*' | head -1)
PROP3_ID=$(echo $PROP3 | grep -o '"id":[0-9]*' | grep -o '[0-9]*' | head -1)
PROP4_ID=$(echo $PROP4 | grep -o '"id":[0-9]*' | grep -o '[0-9]*' | head -1)
PROP5_ID=$(echo $PROP5 | grep -o '"id":[0-9]*' | grep -o '[0-9]*' | head -1)

echo ""
echo "📅 Creating 5 Appointments..."
echo ""

curl -s -X POST "$API_URL/appointments" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Property Viewing - Kolonaki Apartment\",
    \"description\": \"First viewing with Dimitris for the Kolonaki luxury apartment\",
    \"startDate\": \"2025-11-15T10:00:00.000Z\",
    \"endDate\": \"2025-11-15T11:00:00.000Z\",
    \"status\": \"scheduled\",
    \"notes\": \"Client prefers morning viewings\",
    \"clientId\": $CLIENT1_ID,
    \"propertyId\": $PROP1_ID,
    \"assignedUserId\": 1
  }" > /dev/null
echo "✅ Appointment 1: Kolonaki Apartment Viewing (Nov 15)"

curl -s -X POST "$API_URL/appointments" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Villa Tour - Mykonos Beachfront\",
    \"description\": \"Showing beachfront villa to Sofia, includes pool and beach areas\",
    \"startDate\": \"2025-11-18T14:00:00.000Z\",
    \"endDate\": \"2025-11-18T16:00:00.000Z\",
    \"status\": \"confirmed\",
    \"notes\": \"Arrange boat transfer from port\",
    \"clientId\": $CLIENT4_ID,
    \"propertyId\": $PROP2_ID,
    \"assignedUserId\": 3
  }" > /dev/null
echo "✅ Appointment 2: Mykonos Villa Tour (Nov 18)"

curl -s -X POST "$API_URL/appointments" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Contract Signing - Syntagma Building\",
    \"description\": \"Final contract signing for commercial building purchase\",
    \"startDate\": \"2025-11-12T11:00:00.000Z\",
    \"endDate\": \"2025-11-12T13:00:00.000Z\",
    \"status\": \"confirmed\",
    \"notes\": \"Lawyer and notary will be present\",
    \"clientId\": $CLIENT5_ID,
    \"propertyId\": $PROP3_ID,
    \"assignedUserId\": 1
  }" > /dev/null
echo "✅ Appointment 3: Contract Signing (Nov 12)"

curl -s -X POST "$API_URL/appointments" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Second Viewing - Glyfada Penthouse\",
    \"description\": \"Follow-up viewing with Maria, focus on terrace and amenities\",
    \"startDate\": \"2025-11-20T15:30:00.000Z\",
    \"endDate\": \"2025-11-20T17:00:00.000Z\",
    \"status\": \"scheduled\",
    \"notes\": \"Client bringing architect for consultation\",
    \"clientId\": $CLIENT2_ID,
    \"propertyId\": $PROP4_ID,
    \"assignedUserId\": 3
  }" > /dev/null
echo "✅ Appointment 4: Glyfada Penthouse Viewing (Nov 20)"

curl -s -X POST "$API_URL/appointments" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Completion Meeting - Thessaloniki Sale\",
    \"description\": \"Final handover and key collection for completed sale\",
    \"startDate\": \"2025-11-08T09:00:00.000Z\",
    \"endDate\": \"2025-11-08T10:30:00.000Z\",
    \"status\": \"completed\",
    \"notes\": \"Sale completed successfully, all documents signed\",
    \"clientId\": $CLIENT3_ID,
    \"propertyId\": $PROP5_ID,
    \"assignedUserId\": 1
  }" > /dev/null
echo "✅ Appointment 5: Completion Meeting (Nov 8 - Completed)"

echo ""
echo "======================================"
echo "✅ Demo Data Created Successfully!"
echo "======================================"
echo ""
echo "📊 Summary:"
echo "  • 5 Clients created"
echo "  • 5 Properties created (Available: 2, Reserved: 1, Sold: 1)"
echo "  • 5 Appointments created (Scheduled: 2, Confirmed: 2, Completed: 1)"
echo ""
echo "🎉 Your PropFlow demo is ready to explore!"
