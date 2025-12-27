# 🚀 AutoStory Backend v2.0 - New Features Guide

## Overview

AutoStory Backend has been massively enhanced with powerful AI capabilities, historical car dataset integration, and advanced export features. This guide covers all the exciting new features.

## 🌟 What's New in v2.0

### 1. 🤖 Gemini AI Integration

Full integration with Google's Gemini AI for intelligent car storytelling, comparisons, and recommendations.

#### Features:
- **Text Generation**: Create compelling narratives about vehicles
- **Interactive Chat**: Conversational AI assistant for car queries
- **Streaming Responses**: Real-time text generation
- **Vision Analysis**: Analyze car images and generate descriptions
- **Multi-turn Conversations**: Maintain context across chat sessions

#### Endpoints:
- `POST /api/v1/gemini/generate` - Generate text
- `POST /api/v1/gemini/stream` - Stream generation
- `POST /api/v1/gemini/chat` - Chat with AI
- `POST /api/v1/gemini/analyze-image` - Analyze car images
- `POST /api/v1/gemini/car-story` - Generate car stories
- `POST /api/v1/gemini/compare-cars` - AI-powered comparisons
- `POST /api/v1/gemini/recommend` - Smart recommendations
- `POST /api/v1/gemini/explain-specs` - Explain technical specs
- `POST /api/v1/gemini/timeline` - Historical timelines
- `GET /api/v1/gemini/status` - Service status

### 2. 📊 Historical Car Dataset (1945-2020)

Comprehensive car dataset with 100,000+ vehicles from 1945-2020.

#### Features:
- **Advanced Search**: Filter by make, model, year, specs, country
- **Analytics Dashboard**: Statistics and trends
- **Top Cars**: Most powerful, fastest, most efficient
- **Decade Analysis**: How cars evolved over time
- **Make Statistics**: Detailed manufacturer insights

#### Endpoints:
- `GET /api/v1/dataset/search` - Search with filters
- `GET /api/v1/dataset/cars/:id` - Get car details
- `GET /api/v1/dataset/analytics` - Dataset statistics
- `GET /api/v1/dataset/top` - Top cars by criteria
- `GET /api/v1/dataset/decades` - Cars by decade
- `GET /api/v1/dataset/makes` - List all manufacturers
- `GET /api/v1/dataset/makes/:make` - Make statistics
- `GET /api/v1/dataset/random` - Random cars
- `POST /api/v1/dataset/compare` - Compare cars

### 3. 📈 Smart Comparisons

Intelligent car comparison system combining dataset data with AI insights.

#### Features:
- Side-by-side spec comparison
- AI-generated analysis and recommendations
- Visual comparison charts
- Pros/cons analysis
- Use-case recommendations

### 4. 💡 AI Recommendations

Smart car recommendation engine based on user preferences.

#### Features:
- Budget-aware suggestions
- Use-case matching (daily, performance, family)
- Priority-based filtering
- Historical data analysis
- Personalized recommendations

### 5. 📚 Historical Timeline

Generate evolution timelines for car makes and models.

#### Features:
- Decade-by-decade evolution
- Key milestone identification
- AI-generated narratives
- Performance trends over time

### 6. 📤 Enhanced Export System

Beautiful, professional export formats with AI insights.

#### Features:
- **HTML Reports**: Interactive, styled reports
- **PDF Export**: Print-ready documents
- **Markdown**: Documentation-friendly format
- **JSON**: Developer-friendly data export

#### Export Endpoints:
- `POST /api/v1/export/comparison-report` - HTML/PDF reports
- `POST /api/v1/export/markdown` - Markdown documents
- `POST /api/v1/export/json` - JSON data
- `GET /api/v1/export/download/:filename` - Download files

## 🔧 Setup & Configuration

### Environment Variables

Add these to your `.env` file:

```env
# Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash-exp
GEMINI_VISION_MODEL=gemini-2.0-flash-exp
AI_MOCK_MODE=false

# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=your_mongodb_connection_string

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Getting Gemini API Key

1. Visit https://makersuite.google.com/app/apikey
2. Create a new API key
3. Add it to your `.env` file as `GEMINI_API_KEY`

### Mock Mode

For development without an API key, enable mock mode:

```env
AI_MOCK_MODE=true
```

## 📖 Usage Examples

### 1. Generate Car Story

```bash
POST /api/v1/gemini/car-story
Content-Type: application/json

{
  "carId": "1",
  "tone": "enthusiastic",
  "length": "medium",
  "focus": "performance"
}
```

### 2. Compare Cars with AI

```bash
POST /api/v1/gemini/compare-cars
Content-Type: application/json

{
  "carIds": ["1", "2", "3"],
  "criteria": ["performance", "efficiency", "design"]
}
```

### 3. Get Recommendations

```bash
POST /api/v1/gemini/recommend
Content-Type: application/json

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

### 4. Search Dataset

```bash
GET /api/v1/dataset/search?make=Ford&model=Mustang&yearFrom=1990&yearTo=2000&sortBy=horsepower&sortOrder=desc&page=1&limit=10
```

### 5. Generate Comparison Report

```bash
POST /api/v1/export/comparison-report
Content-Type: application/json

{
  "carIds": ["1", "2"],
  "format": "pdf",
  "criteria": ["performance", "efficiency"]
}
```

### 6. Chat with AI

```bash
POST /api/v1/gemini/chat
Authorization: Bearer {token}
Content-Type: application/json

{
  "message": "What makes a good sports car?",
  "sessionId": "session_123"
}
```

## 🎯 Use Cases

### For Car Enthusiasts
- Explore historical car data from 1945-2020
- Compare classic vs modern vehicles
- Discover top performers by decade
- Get AI-generated stories about favorite cars

### For Dealerships
- Generate compelling marketing content
- Create comparison reports for customers
- Provide AI-powered recommendations
- Export professional reports

### For Researchers
- Analyze automotive trends over decades
- Access comprehensive specifications
- Export data in multiple formats
- Historical timeline analysis

### For Developers
- RESTful API access
- Comprehensive dataset
- AI-powered insights
- Multiple export formats

## 📊 Dataset Features

### Available Data Points
- Make, Model, Generation, Year Range
- Engine specifications (HP, torque, capacity)
- Performance metrics (0-100, top speed)
- Dimensions and weight
- Fuel consumption
- Transmission details
- Safety ratings
- Country of origin
- And much more!

### Search Filters
- Text search across all fields
- Filter by make, model, year range
- Body type filtering
- Engine type and horsepower range
- Country of origin
- Drive wheels configuration
- Sorting by multiple criteria

## 🚀 Performance

- **Dataset Loading**: Cached after first load
- **AI Responses**: Fast with streaming support
- **Export Generation**: Optimized HTML/PDF creation
- **Search**: Efficient filtering and pagination

## 🧪 Testing

Use the included Postman collection:
- `AutoStory_API_v2_Enhanced.postman_collection.json`

### Quick Test Flow:
1. Check health: `GET /api/v1/health`
2. Check Gemini status: `GET /api/v1/gemini/status`
3. Search cars: `GET /api/v1/dataset/search?make=Ford`
4. Generate story: `POST /api/v1/gemini/car-story`
5. Compare cars: `POST /api/v1/gemini/compare-cars`
6. Export report: `POST /api/v1/export/comparison-report`

## 📝 API Response Format

All endpoints return consistent JSON:

```json
{
  "success": true,
  "data": { },
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
}
```

Error responses:

```json
{
  "success": false,
  "error": "Error message here"
}
```

## 🔒 Authentication

Some endpoints require authentication:
- All Gemini generation endpoints (except public ones)
- User-specific features

Public endpoints (no auth required):
- Dataset search and analytics
- Public car stories and comparisons
- Timeline generation
- Export features

## 🎨 Frontend Integration

Perfect for:
- React/Vue/Angular applications
- 3D car visualization tools
- Marketing automation platforms
- Car comparison websites
- Historical automotive research tools

## 📚 Additional Resources

- **Architecture Guide**: `ARCHITECTURE.md`
- **Quickstart**: `QUICKSTART.md`
- **Postman Guide**: `POSTMAN_GUIDE.md`
- **Original README**: `README.md`

## 🐛 Troubleshooting

### Dataset Not Loading
- Check that CSV file exists in `datasets/` folder
- Ensure sufficient memory for large dataset
- Check console for loading errors

### Gemini API Errors
- Verify API key is valid
- Check internet connection
- Enable mock mode for development
- Review rate limits

### Export Issues
- Ensure exports directory exists
- Check file permissions
- Verify Puppeteer installation

## 🎯 Roadmap

Future enhancements:
- Vector embeddings for semantic search
- Image generation integration
- Video generation enhancements
- Real-time price data integration
- User preference learning
- Advanced analytics dashboard

## 📞 Support

For issues or questions:
1. Check documentation
2. Review Postman examples
3. Enable mock mode for testing
4. Check console logs

---

**AutoStory v2.0** - Transform vehicle data into immersive storytelling experiences! 🚗✨
