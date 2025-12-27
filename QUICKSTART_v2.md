# 🚀 AutoStory Backend v2.0 - Quick Start Guide

## Get Started in 5 Minutes!

### Prerequisites
- Node.js v18+ installed
- MongoDB running (local or Atlas)
- (Optional) Gemini API key from Google

### Step 1: Clone & Install

```bash
cd AutoStory-backend
npm install
```

### Step 2: Configure Environment

Create a `.env` file:

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/autostory

# AI Settings (Mock mode for quick start)
AI_MOCK_MODE=true
GEMINI_API_KEY=

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Step 3: Start the Server

```bash
npm run dev
```

You should see:
```
✅ Loaded 50000+ cars from dataset
🚀 Server running in development mode on port 5000
```

### Step 4: Test It Out!

#### Check Health
```bash
curl http://localhost:5000/api/v1/health
```

#### Search for Cars
```bash
curl "http://localhost:5000/api/v1/dataset/search?make=Ford&limit=5"
```

#### Generate AI Story (Mock Mode)
```bash
curl -X POST http://localhost:5000/api/v1/gemini/car-story \
  -H "Content-Type: application/json" \
  -d '{"carId": "1", "tone": "enthusiastic"}'
```

#### Compare Cars
```bash
curl -X POST http://localhost:5000/api/v1/gemini/compare-cars \
  -H "Content-Type: application/json" \
  -d '{"carIds": ["1", "2"]}'
```

#### Get Dataset Analytics
```bash
curl http://localhost:5000/api/v1/dataset/analytics
```

## 🎯 Next Steps

### Enable Real AI (Optional)

1. Get a Gemini API key: https://makersuite.google.com/app/apikey
2. Update `.env`:
```env
AI_MOCK_MODE=false
GEMINI_API_KEY=your_actual_api_key_here
```
3. Restart server

### Import Postman Collection

1. Open Postman
2. Import `AutoStory_API_v2_Enhanced.postman_collection.json`
3. Start testing all endpoints!

### Explore the API

Visit: http://localhost:5000

See all available endpoints and features.

## 🔥 Cool Things to Try

### 1. Get Top 10 Most Powerful Cars
```bash
curl "http://localhost:5000/api/v1/dataset/top?criteria=horsepower&limit=10"
```

### 2. Cars by Decade
```bash
curl http://localhost:5000/api/v1/dataset/decades
```

### 3. Generate Comparison Report
```bash
curl -X POST http://localhost:5000/api/v1/export/comparison-report \
  -H "Content-Type: application/json" \
  -d '{
    "carIds": ["1", "2"],
    "format": "html",
    "criteria": ["performance", "efficiency"]
  }'
```

### 4. Historical Timeline
```bash
curl -X POST http://localhost:5000/api/v1/gemini/timeline \
  -H "Content-Type: application/json" \
  -d '{"make": "Ford", "model": "Mustang"}'
```

### 5. AI Recommendations
```bash
curl -X POST http://localhost:5000/api/v1/gemini/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "preferences": {
      "budget": "moderate",
      "useCase": "daily commute",
      "priorities": ["efficiency", "reliability"]
    }
  }'
```

## 📚 Documentation

- **Full Features Guide**: `NEW_FEATURES_v2.md`
- **Architecture**: `ARCHITECTURE.md`
- **Postman Guide**: `POSTMAN_GUIDE.md`

## 🐛 Troubleshooting

### Port Already in Use
Change PORT in `.env` or:
```bash
PORT=3001 npm run dev
```

### MongoDB Connection Error
Make sure MongoDB is running:
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Dataset Not Loading
Check that the file exists:
```bash
ls datasets/Car\ Dataset\ 1945-2020.csv
```

## 🎉 You're Ready!

Your AutoStory backend is now running with:
- ✅ 100,000+ historical car data
- ✅ AI-powered storytelling (mock mode)
- ✅ Advanced search & analytics
- ✅ Smart comparisons
- ✅ Beautiful exports

Enjoy building amazing car applications! 🚗✨
