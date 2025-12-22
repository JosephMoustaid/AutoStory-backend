#!/bin/bash

echo "🚗 Testing AutoStory Backend - Story Generation with Mock Mode"
echo "================================================================"
echo ""

BASE_URL="http://localhost:5000/api/v1"

# Test 1: Health check
echo "1️⃣  Testing health endpoint..."
HEALTH=$(curl -s "$BASE_URL/health")
echo "   Response: $HEALTH"
echo ""

# Test 2: Login to get token
echo "2️⃣  Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token // empty')

if [ -z "$TOKEN" ] || [ "$TOKEN" == "null" ]; then
  echo "   ⚠️  Login failed, registering new user..."
  REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Test User",
      "email": "test@example.com",
      "password": "password123"
    }')
  
  TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.token // empty')
  echo "   ✅ Registered and got token"
else
  echo "   ✅ Logged in successfully"
fi

if [ -z "$TOKEN" ] || [ "$TOKEN" == "null" ]; then
  echo "   ❌ Failed to get authentication token"
  exit 1
fi

echo "   Token: ${TOKEN:0:20}..."
echo ""

# Test 3: Create or get vehicle
echo "3️⃣  Creating test vehicle..."
VEHICLE_RESPONSE=$(curl -s -X POST "$BASE_URL/vehicles" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "year": 2024,
    "make": "Tesla",
    "model": "Model S Plaid",
    "specifications": {
      "engine": {
        "type": "Tri-Motor Electric",
        "horsepower": 1020,
        "torque": 1420
      },
      "transmission": {
        "type": "Single-Speed Automatic"
      },
      "performance": {
        "acceleration": "0-60 mph in 1.99s",
        "topSpeed": 200,
        "range": 396
      }
    }
  }')

VEHICLE_ID=$(echo $VEHICLE_RESPONSE | jq -r '.data._id // .data.id // empty')

if [ -z "$VEHICLE_ID" ] || [ "$VEHICLE_ID" == "null" ]; then
  echo "   ⚠️  Vehicle creation failed, trying to get existing vehicles..."
  VEHICLES=$(curl -s "$BASE_URL/vehicles" -H "Authorization: Bearer $TOKEN")
  VEHICLE_ID=$(echo $VEHICLES | jq -r '.data[0]._id // .data[0].id // empty')
fi

if [ -z "$VEHICLE_ID" ] || [ "$VEHICLE_ID" == "null" ]; then
  echo "   ❌ Failed to get vehicle ID"
  exit 1
fi

echo "   ✅ Vehicle ID: $VEHICLE_ID"
echo ""

# Test 4: Generate story (THE MAIN TEST)
echo "4️⃣  Generating story with MOCK MODE..."
echo "   This should use placeholder AI-generated content..."
echo ""

STORY_RESPONSE=$(curl -s -X POST "$BASE_URL/stories/generate" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"vehicleId\": \"$VEHICLE_ID\",
    \"chapters\": [\"overview\", \"performance\", \"technology\"],
    \"tone\": \"enthusiastic\",
    \"language\": \"en\"
  }")

echo "$STORY_RESPONSE" | jq '.'
echo ""

# Check if story was generated
SUCCESS=$(echo $STORY_RESPONSE | jq -r '.success // false')
TITLE=$(echo $STORY_RESPONSE | jq -r '.data.title // empty')

if [ "$SUCCESS" == "true" ] && [ ! -z "$TITLE" ]; then
  echo "✅ SUCCESS! Story generated with mock mode"
  echo "   Title: $TITLE"
  echo ""
  echo "   Chapters generated:"
  echo "$STORY_RESPONSE" | jq -r '.data.chapters[] | "   - \(.title): \(.content[0:80])..."'
  echo ""
  echo "🎉 All tests passed! Mock mode is working perfectly!"
else
  echo "❌ Story generation failed"
  echo "   Error: $(echo $STORY_RESPONSE | jq -r '.error // .message // "Unknown error"')"
  exit 1
fi
