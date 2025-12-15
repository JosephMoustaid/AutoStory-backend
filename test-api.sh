#!/bin/bash

# AutoStory Backend API Test Script
# Run this script to test the API endpoints

BASE_URL="http://localhost:5000/api/v1"
TOKEN=""

echo "🚀 AutoStory Backend API Tests"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Health Check
echo -e "${YELLOW}Test 1: Server Health Check${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" ${BASE_URL}/../)
if [ $response -eq 200 ]; then
    echo -e "${GREEN}✓ Server is running${NC}"
else
    echo -e "${RED}✗ Server not responding (Status: $response)${NC}"
    exit 1
fi
echo ""

# Test 2: Register User
echo -e "${YELLOW}Test 2: Register New User${NC}"
register_response=$(curl -s -X POST ${BASE_URL}/auth/register \
    -H "Content-Type: application/json" \
    -d '{
        "name": "Test User",
        "email": "test@autostory.com",
        "password": "test123456",
        "role": "author"
    }')

if echo "$register_response" | grep -q "token"; then
    TOKEN=$(echo "$register_response" | grep -o '"token":"[^"]*' | sed 's/"token":"//')
    echo -e "${GREEN}✓ User registered successfully${NC}"
    echo "Token: ${TOKEN:0:20}..."
else
    echo -e "${YELLOW}⚠ User might already exist (trying login)${NC}"
fi
echo ""

# Test 3: Login
echo -e "${YELLOW}Test 3: User Login${NC}"
login_response=$(curl -s -X POST ${BASE_URL}/auth/login \
    -H "Content-Type: application/json" \
    -d '{
        "email": "test@autostory.com",
        "password": "test123456"
    }')

if echo "$login_response" | grep -q "token"; then
    TOKEN=$(echo "$login_response" | grep -o '"token":"[^"]*' | sed 's/"token":"//')
    echo -e "${GREEN}✓ Login successful${NC}"
    echo "Token: ${TOKEN:0:20}..."
else
    echo -e "${RED}✗ Login failed${NC}"
    echo "$login_response"
    exit 1
fi
echo ""

# Test 4: Get Current User
echo -e "${YELLOW}Test 4: Get Current User${NC}"
me_response=$(curl -s -X GET ${BASE_URL}/auth/me \
    -H "Authorization: Bearer ${TOKEN}")

if echo "$me_response" | grep -q "email"; then
    echo -e "${GREEN}✓ User retrieved successfully${NC}"
    echo "$me_response" | grep -o '"name":"[^"]*' | sed 's/"name":"/Name: /'
else
    echo -e "${RED}✗ Failed to get user${NC}"
fi
echo ""

# Test 5: Create Vehicle
echo -e "${YELLOW}Test 5: Create Vehicle${NC}"
vehicle_response=$(curl -s -X POST ${BASE_URL}/vehicles \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer ${TOKEN}" \
    -d '{
        "make": "Tesla",
        "model": "Model S",
        "year": 2024,
        "type": "electric",
        "specifications": {
            "engine": {
                "type": "Dual Motor All-Wheel Drive",
                "horsepower": 670,
                "torque": 850
            },
            "performance": {
                "acceleration_0_100": 3.1,
                "topSpeed": 250
            },
            "battery": {
                "capacity": 100,
                "range": 652,
                "chargingTime": {
                    "fast": 15,
                    "normal": 480
                },
                "batteryType": "Lithium-ion"
            },
            "efficiency": {
                "energyConsumption": 18.5,
                "range": 652
            },
            "safety": {
                "rating": 5,
                "features": ["Automatic Emergency Braking", "Blind Spot Warning", "Lane Departure Warning"],
                "airbags": 8,
                "abs": true,
                "esc": true
            },
            "adas": {
                "features": ["Autopilot", "Full Self-Driving Capability", "Navigate on Autopilot"],
                "adaptiveCruise": true,
                "laneKeeping": true,
                "autonomyLevel": 2
            },
            "transmission": {
                "type": "Single-Speed Automatic",
                "driveType": "AWD"
            },
            "dimensions": {
                "length": 5021,
                "width": 1987,
                "height": 1431,
                "wheelbase": 2960,
                "weight": 2162,
                "trunkCapacity": 744
            },
            "technology": {
                "infotainmentSystem": "Tesla OS",
                "screenSize": 17,
                "connectivity": ["4G LTE", "WiFi", "Bluetooth 5.0"],
                "voiceControl": true,
                "smartphoneIntegration": true
            }
        }
    }')

VEHICLE_ID=""
if echo "$vehicle_response" | grep -q '"_id"'; then
    VEHICLE_ID=$(echo "$vehicle_response" | grep -o '"_id":"[^"]*' | head -1 | sed 's/"_id":"//')
    echo -e "${GREEN}✓ Vehicle created successfully${NC}"
    echo "Vehicle ID: $VEHICLE_ID"
else
    echo -e "${RED}✗ Failed to create vehicle${NC}"
    echo "$vehicle_response"
fi
echo ""

# Test 6: Get All Vehicles
echo -e "${YELLOW}Test 6: Get All Vehicles${NC}"
vehicles_response=$(curl -s -X GET ${BASE_URL}/vehicles)

if echo "$vehicles_response" | grep -q "data"; then
    count=$(echo "$vehicles_response" | grep -o '"count":[0-9]*' | sed 's/"count"://')
    echo -e "${GREEN}✓ Vehicles retrieved successfully${NC}"
    echo "Total vehicles: $count"
else
    echo -e "${RED}✗ Failed to get vehicles${NC}"
fi
echo ""

# Test 7: Generate AI Story
if [ ! -z "$VEHICLE_ID" ]; then
    echo -e "${YELLOW}Test 7: Generate AI Vehicle Story${NC}"
    story_response=$(curl -s -X POST ${BASE_URL}/stories/generate \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer ${TOKEN}" \
        -d "{
            \"vehicleId\": \"$VEHICLE_ID\",
            \"tone\": \"professional\",
            \"targetAudience\": \"automotive enthusiasts\",
            \"keyFocus\": [\"performance\", \"technology\", \"safety\"]
        }")

    STORY_ID=""
    if echo "$story_response" | grep -q '"_id"'; then
        STORY_ID=$(echo "$story_response" | grep -o '"_id":"[^"]*' | head -1 | sed 's/"_id":"//')
        echo -e "${GREEN}✓ Story generated successfully${NC}"
        echo "Story ID: $STORY_ID"
        
        # Show first chapter title
        title=$(echo "$story_response" | grep -o '"title":"[^"]*' | head -2 | tail -1 | sed 's/"title":"//')
        echo "First chapter: $title"
    else
        echo -e "${YELLOW}⚠ Story generation may take time (check HuggingFace API)${NC}"
        echo "$story_response" | head -c 200
    fi
    echo ""
    
    # Test 8: Get Story
    if [ ! -z "$STORY_ID" ]; then
        echo -e "${YELLOW}Test 8: Get Story Details${NC}"
        get_story_response=$(curl -s -X GET ${BASE_URL}/stories/${STORY_ID})
        
        if echo "$get_story_response" | grep -q "chapters"; then
            chapter_count=$(echo "$get_story_response" | grep -o '"chapters":\[' | wc -l)
            echo -e "${GREEN}✓ Story retrieved successfully${NC}"
            echo "Chapters in story: $chapter_count"
        else
            echo -e "${RED}✗ Failed to get story${NC}"
        fi
        echo ""
    fi
fi

echo ""
echo "================================"
echo -e "${GREEN}✓ API Tests Completed!${NC}"
echo ""
echo "📝 Available endpoints:"
echo "   Auth:    POST /api/v1/auth/register"
echo "            POST /api/v1/auth/login"
echo "            GET  /api/v1/auth/me"
echo "   Vehicles: POST /api/v1/vehicles"
echo "            GET  /api/v1/vehicles"
echo "            GET  /api/v1/vehicles/:id"
echo "            POST /api/v1/vehicles/parse"
echo "            POST /api/v1/vehicles/compare"
echo "   Stories: POST /api/v1/stories/generate"
echo "            GET  /api/v1/stories"
echo "            GET  /api/v1/stories/:id"
echo "            GET  /api/v1/stories/:id/export/:format"
echo ""
