# 🚀 AutoStory Backend - Quick Start Guide

## What is AutoStory?

AutoStory transforms cold vehicle specification sheets into **immersive, emotional storytelling experiences** using AI. Instead of boring technical data, you get:

- 📖 Multi-chapter narratives that bring specs to life
- 🎨 Auto-generated visuals and infographics
- 🎬 Video storyboards and animations
- 🌐 Multilingual content
- 📤 Export to PDF, HTML, video, and more

---

## 🏃 Quick Start (5 minutes)

### 1. Install Dependencies

```bash
cd "/home/youssefmoustaid/Desktop/my-projects/PFA /backend"
npm install
```

### 2. Environment Setup

The `.env` file is already created. You just need to add your **free** Hugging Face API key:

1. Go to https://huggingface.co/join (create free account)
2. Go to https://huggingface.co/settings/tokens
3. Create a new token (Read permission)
4. Copy the token and update `.env`:

```bash
HUGGINGFACE_API_KEY=hf_your_actual_token_here
```

### 3. Start MongoDB

```bash
# Check if MongoDB is running
sudo systemctl status mongod

# If not running, start it
sudo systemctl start mongod
```

### 4. Start the Server

```bash
npm run dev
```

You should see:
```
🚀 Server running in development mode on port 5000
MongoDB Connected: localhost
```

---

## 📝 Testing the API

### Step 1: Register a User

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

Save the `token` from the response!

### Step 2: Create a Vehicle

```bash
curl -X POST http://localhost:5000/api/v1/vehicles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "make": "Tesla",
    "model": "Model 3",
    "year": 2024,
    "type": "sedan",
    "specifications": {
      "engine": {
        "type": "Electric",
        "horsepower": 283,
        "torque": 420
      },
      "performance": {
        "acceleration_0_100": 5.6,
        "topSpeed": 225
      },
      "battery": {
        "capacity": 60,
        "range": 491
      },
      "safety": {
        "rating": 5,
        "features": ["ABS", "ESC", "Airbags", "Autopilot"],
        "airbags": 8
      }
    }
  }'
```

Save the vehicle `_id` from the response!

### Step 3: Generate Immersive Story

```bash
curl -X POST http://localhost:5000/api/v1/stories/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "vehicleId": "YOUR_VEHICLE_ID_HERE",
    "tone": "enthusiastic",
    "language": "en",
    "chapters": ["overview", "performance", "technology", "safety"],
    "includeVisuals": true
  }'
```

This will:
- ✅ Generate AI-powered narrative chapters
- ✅ Extract technical highlights
- ✅ Create visual assets metadata
- ✅ Structure content for export

### Step 4: Export the Story

```bash
# Export as Markdown
curl http://localhost:5000/api/v1/stories/YOUR_STORY_ID/export/markdown \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Export as HTML
curl http://localhost:5000/api/v1/stories/YOUR_STORY_ID/export/html \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Export as JSON
curl http://localhost:5000/api/v1/stories/YOUR_STORY_ID/export/json \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🎯 Key API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/auth/register` | POST | Create account |
| `/api/v1/auth/login` | POST | Get JWT token |
| `/api/v1/vehicles` | GET | List all vehicles |
| `/api/v1/vehicles` | POST | Add new vehicle |
| `/api/v1/vehicles/parse` | POST | Parse vehicle data (JSON/CSV) |
| `/api/v1/vehicles/compare` | POST | Compare vehicles side-by-side |
| `/api/v1/stories/generate` | POST | Generate AI story from vehicle |
| `/api/v1/stories/:id/export/:format` | GET | Export story (pdf/html/md/json) |

---

## 🔥 Example: Parse Vehicle Data from JSON

Instead of manually entering data, you can parse it:

```bash
curl -X POST http://localhost:5000/api/v1/vehicles/parse \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "dataType": "json",
    "data": "{\"make\":\"BMW\",\"model\":\"iX\",\"year\":2024,\"horsepower\":523,\"torque\":765,\"0-100\":4.6,\"range\":630}"
  }'
```

The API will:
- ✅ Parse and normalize the data
- ✅ Extract engine, performance, battery specs
- ✅ Return structured vehicle object
- ✅ Ready to create vehicle or generate story

---

## 🎨 Story Generation Features

When you generate a story, AutoStory creates:

### 1. **Multi-Chapter Narrative**
- Overview (design philosophy, first impressions)
- Performance (power, acceleration, handling)
- Technology (ADAS, infotainment, connectivity)
- Safety (ratings, features, protection systems)
- Experience (driving emotions, comfort)
- Efficiency (consumption, range, sustainability)

### 2. **Technical Highlights**
Each chapter extracts key specs:
- Horsepower, torque, acceleration
- Range, charging time
- Safety rating, airbag count
- ADAS feature count

### 3. **Visual Asset Metadata**
- 3D model links
- Animated infographic configs
- Performance graph data
- Video storyboard scenes

### 4. **Multiple Tones**
- `professional` - Corporate marketing
- `enthusiastic` - Exciting and dynamic
- `technical` - Engineering-focused
- `luxury` - Premium and sophisticated
- `sporty` - Performance-oriented

---

## 🌐 Multilingual Support

Generate stories in different languages:

```bash
curl -X POST http://localhost:5000/api/v1/stories/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "vehicleId": "YOUR_VEHICLE_ID",
    "language": "fr",
    "tone": "luxury"
  }'
```

Supported: `en`, `fr`, `es`, `de`, `it`, `pt`, `ar`, `zh`, `ja`

---

## 🔍 Advanced Queries

### Filter Vehicles by Type
```
GET /api/v1/vehicles?type=electric
```

### Pagination
```
GET /api/v1/vehicles?page=2&limit=20
```

### Sort by Year
```
GET /api/v1/vehicles?sort=-year
```

### Filter Published Stories
```
GET /api/v1/stories?status=published&language=en
```

---

## 📊 Vehicle Comparison

Compare multiple vehicles side-by-side:

```bash
curl -X POST http://localhost:5000/api/v1/vehicles/compare \
  -H "Content-Type: application/json" \
  -d '{
    "vehicleIds": ["VEHICLE_ID_1", "VEHICLE_ID_2", "VEHICLE_ID_3"]
  }'
```

Returns comparison of:
- Performance metrics
- Efficiency data
- Safety ratings
- Technology features

---

## 🛠️ Troubleshooting

### MongoDB Connection Error
```bash
# Start MongoDB
sudo systemctl start mongod

# Check status
sudo systemctl status mongod
```

### Hugging Face API Error
- Make sure your API key is valid
- Check you have internet connection
- Free tier has rate limits (wait between requests)

### Port Already in Use
```bash
# Change port in .env
PORT=5001
```

---

## 📚 Next Steps

1. ✅ Read `ARCHITECTURE.md` for detailed system design
2. ✅ Import `AutoStory_API.postman_collection.json` into Postman
3. ✅ Explore the visual generation service
4. ✅ Test export formats (PDF, HTML, video)
5. ✅ Integrate with your frontend

---

## 💡 Pro Tips

1. **Batch Operations**: Generate stories for multiple vehicles at once
2. **Caching**: Stories are cached for performance
3. **Analytics**: View counts are tracked automatically
4. **Versioning**: Stories save edit history
5. **Templates**: Reuse successful story structures

---

## 🆘 Need Help?

- Check `ARCHITECTURE.md` for system details
- Review API examples in Postman collection
- Test with the health endpoint: `GET /api/v1/health`

---

**🎉 You're ready to transform vehicle specs into stories!**
