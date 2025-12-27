# 📖 AutoStory API v2.0 - Complete Reference

## Base URL
```
http://localhost:5000/api/v1
```

## Authentication
Some endpoints require Bearer token authentication:
```
Authorization: Bearer {your_jwt_token}
```

---

## 🏥 Health & Status

### Check API Health
```http
GET /health
```

**Response:**
```json
{
  "success": true,
  "message": "AutoStory API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 🤖 Gemini AI Endpoints

### 1. Generate Text
Generate AI text from a prompt.

```http
POST /gemini/generate
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "prompt": "Write about a classic sports car",
  "temperature": 0.7,
  "maxTokens": 500
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "text": "Generated text here...",
    "model": "gemini-2.0-flash-exp",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### 2. Chat with AI
Interactive conversation with AI.

```http
POST /gemini/chat
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "message": "What makes a good sports car?",
  "sessionId": "session_123",
  "history": [
    {
      "role": "user",
      "content": "Previous message"
    },
    {
      "role": "assistant",
      "content": "Previous response"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "AI response here...",
    "sessionId": "session_123",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### 3. Generate Car Story
Create AI story from car dataset.

```http
POST /gemini/car-story
Content-Type: application/json
```

**Body:**
```json
{
  "carId": "1",
  "tone": "enthusiastic",
  "length": "medium",
  "focus": "performance"
}
```

**Options:**
- `tone`: "enthusiastic", "technical", "casual"
- `length`: "short", "medium", "long"
- `focus`: "performance", "design", "technology", "general"

**Response:**
```json
{
  "success": true,
  "data": {
    "car": {
      "make": "AC",
      "model": "ACE",
      "year": 1993,
      "id": "1"
    },
    "story": "Generated story...",
    "options": {
      "tone": "enthusiastic",
      "length": "medium",
      "focus": "performance"
    }
  }
}
```

### 4. Compare Cars with AI
AI-powered comparison of multiple cars.

```http
POST /gemini/compare-cars
Content-Type: application/json
```

**Body:**
```json
{
  "carIds": ["1", "2", "3"],
  "criteria": ["performance", "efficiency", "design"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "cars": [
      {
        "id": "1",
        "make": "AC",
        "model": "ACE",
        "year": 1993,
        "horsepower": 354,
        "bodyType": "Cabriolet"
      }
    ],
    "comparison": "AI-generated comparison text...",
    "criteria": ["performance", "efficiency", "design"]
  }
}
```

### 5. Get Recommendations
AI-powered car recommendations.

```http
POST /gemini/recommend
Content-Type: application/json
```

**Body:**
```json
{
  "preferences": {
    "budget": "moderate",
    "useCase": "daily commute",
    "priorities": ["efficiency", "reliability"],
    "bodyType": "sedan"
  },
  "filters": {
    "yearFrom": 2000,
    "make": "Toyota"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "preferences": { },
    "availableCars": 10,
    "recommendation": "AI recommendation text...",
    "sampleCars": [ ]
  }
}
```

### 6. Explain Specifications
Explain technical specs in simple terms.

```http
POST /gemini/explain-specs
Content-Type: application/json
```

**Body:**
```json
{
  "carId": "1",
  "audienceLevel": "beginner"
}
```

**Options:**
- `audienceLevel`: "beginner", "general", "technical", "expert"

### 7. Generate Timeline
Historical evolution timeline.

```http
POST /gemini/timeline
Content-Type: application/json
```

**Body:**
```json
{
  "make": "Ford",
  "model": "Mustang"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "make": "Ford",
    "model": "Mustang",
    "years": {
      "from": 1965,
      "to": 2020
    },
    "carsFound": 150,
    "timeline": "Historical timeline narrative..."
  }
}
```

### 8. Analyze Image
Analyze car image with Vision AI.

```http
POST /gemini/analyze-image
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "imageData": "base64_encoded_image",
  "prompt": "Describe this car's design features"
}
```

### 9. Streaming Generation
Generate text with streaming.

```http
POST /gemini/stream
Authorization: Bearer {token}
Content-Type: application/json
```

Returns Server-Sent Events (SSE).

### 10. Get Service Status
Check Gemini service status.

```http
GET /gemini/status
```

**Response:**
```json
{
  "success": true,
  "data": {
    "available": true,
    "mockMode": false,
    "defaultModel": "gemini-2.0-flash-exp",
    "visionModel": "gemini-2.0-flash-exp",
    "activeChatSessions": 3
  }
}
```

---

## 📊 Dataset Endpoints

### 1. Search Cars
Advanced search with filters.

```http
GET /dataset/search?make=Ford&model=Mustang&yearFrom=1990&yearTo=2000&page=1&limit=10&sortBy=horsepower&sortOrder=desc
```

**Query Parameters:**
- `query` - Text search across all fields
- `make` - Filter by manufacturer
- `model` - Filter by model name
- `yearFrom` - Minimum year
- `yearTo` - Maximum year
- `bodyType` - Body type (sedan, coupe, etc.)
- `engineType` - Engine type
- `minHorsepower` - Minimum horsepower
- `maxHorsepower` - Maximum horsepower
- `country` - Country of origin
- `driveWheels` - Drive configuration
- `sortBy` - Sort field (year, horsepower, speed, make)
- `sortOrder` - asc or desc
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 50)

**Response:**
```json
{
  "success": true,
  "count": 10,
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 10,
    "pages": 15
  },
  "data": [
    {
      "id": "1",
      "Make": "Ford",
      "Model": "Mustang",
      "YearFrom": 1993,
      "Engine": {
        "Horsepower": 300,
        "Capacity": 5000
      }
    }
  ]
}
```

### 2. Get Car by ID
Get detailed car information.

```http
GET /dataset/cars/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "Make": "AC",
    "Model": "ACE",
    "Generation": "1 generation",
    "YearFrom": 1993,
    "YearTo": 2000,
    "Dimensions": { },
    "Weight": { },
    "Engine": { },
    "Performance": { },
    "Transmission": { },
    "Chassis": { },
    "Cargo": { }
  }
}
```

### 3. Get Analytics
Dataset statistics and insights.

```http
GET /dataset/analytics
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalCars": 50000,
    "totalMakes": 150,
    "totalCountries": 35,
    "totalBodyTypes": 25,
    "yearRange": {
      "from": 1945,
      "to": 2020
    },
    "averageHorsepower": 180,
    "makes": ["AC", "Acura", "Alfa Romeo", ...],
    "countries": ["Italy", "USA", "Germany", ...],
    "bodyTypes": ["Sedan", "Coupe", "SUV", ...]
  }
}
```

### 4. Get Top Cars
Top performers by criteria.

```http
GET /dataset/top?criteria=horsepower&limit=10
```

**Criteria Options:**
- `horsepower` - Most powerful
- `speed` - Fastest
- `acceleration` - Quickest 0-100
- `efficient` - Most fuel efficient

**Response:**
```json
{
  "success": true,
  "criteria": "horsepower",
  "count": 10,
  "data": [ ]
}
```

### 5. Get Cars by Decade
Decade-by-decade analysis.

```http
GET /dataset/decades
```

**Response:**
```json
{
  "success": true,
  "count": 8,
  "data": [
    {
      "decade": 1950,
      "count": 5000,
      "makes": 25,
      "avgHorsepower": 120,
      "avgMaxSpeed": 160,
      "bodyTypes": ["Sedan", "Coupe"]
    }
  ]
}
```

### 6. Get All Makes
List of all manufacturers.

```http
GET /dataset/makes
```

### 7. Get Make Statistics
Detailed statistics for a manufacturer.

```http
GET /dataset/makes/:make
```

**Example:**
```http
GET /dataset/makes/Ford
```

**Response:**
```json
{
  "success": true,
  "data": {
    "make": "Ford",
    "totalModels": 500,
    "yearRange": {
      "from": 1945,
      "to": 2020
    },
    "models": ["Mustang", "F-150", ...],
    "bodyTypes": ["Sedan", "Truck", ...],
    "avgHorsepower": 250,
    "avgMaxSpeed": 200,
    "mostPowerful": { }
  }
}
```

### 8. Get Random Cars
Random car selection.

```http
GET /dataset/random?count=5
```

### 9. Compare Cars (Data)
Structured data comparison.

```http
POST /dataset/compare
Content-Type: application/json
```

**Body:**
```json
{
  "carIds": ["1", "2"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "cars": [ ],
    "specs": {
      "engine": [ ],
      "performance": [ ],
      "dimensions": [ ]
    }
  }
}
```

---

## 📤 Export Endpoints

### 1. Generate Comparison Report
HTML or PDF comparison report.

```http
POST /export/comparison-report
Content-Type: application/json
```

**Body:**
```json
{
  "carIds": ["1", "2"],
  "format": "html",
  "criteria": ["performance", "efficiency"]
}
```

**Format Options:** `html`, `pdf`

**Response:**
```json
{
  "success": true,
  "format": "html",
  "data": {
    "filename": "report_1234567890.html",
    "filepath": "/path/to/file",
    "url": "/exports/report_1234567890.html"
  }
}
```

### 2. Export as Markdown
Markdown document export.

```http
POST /export/markdown
Content-Type: application/json
```

**Body:**
```json
{
  "carIds": ["1", "2"],
  "title": "My Car Comparison"
}
```

### 3. Export as JSON
JSON data export.

```http
POST /export/json
Content-Type: application/json
```

**Body:**
```json
{
  "carIds": ["1", "2"]
}
```

### 4. Download File
Download exported file.

```http
GET /export/download/:filename
```

**Example:**
```http
GET /export/download/report_1234567890.html
```

---

## 🔒 Authentication Endpoints

### Register User
```http
POST /auth/register
Content-Type: application/json
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

### Login User
```http
POST /auth/login
Content-Type: application/json
```

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

## 📝 Response Format

### Success Response
```json
{
  "success": true,
  "data": { },
  "count": 10,
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message here"
}
```

---

## 🚀 Rate Limiting

- **Window**: 15 minutes
- **Max Requests**: 100 per IP
- Applies to all `/api/*` routes

---

## 💡 Tips

1. **Mock Mode**: Enable `AI_MOCK_MODE=true` for development
2. **Pagination**: Use `page` and `limit` for large datasets
3. **Caching**: Dataset is cached after first load
4. **Sessions**: Chat sessions persist across requests
5. **Export**: Files are stored in `/exports` directory

---

## 📚 Additional Resources

- **Postman Collection**: `AutoStory_API_v2_Enhanced.postman_collection.json`
- **Features Guide**: `NEW_FEATURES_v2.md`
- **Quick Start**: `QUICKSTART_v2.md`
- **Architecture**: `ARCHITECTURE.md`

---

**AutoStory API v2.0** - Transform vehicle data into immersive experiences! 🚗✨
