# 📖 AutoStory Backend Architecture Guide

## � Overview

**AutoStory** is an innovative backend API that transforms raw automotive technical specifications into immersive, emotional, and personalized storytelling experiences. The platform uses AI-powered narrative generation, structured data parsing, and multi-format content generation to convert cold specification sheets into engaging marketing content.

### Core Philosophy

1. **Data-Driven Storytelling**: Convert technical data into compelling narratives
2. **AI-Powered Generation**: Leverage Hugging Face models for natural language generation
3. **Multi-Format Output**: Support for text, video, 3D, PDF, and web formats
4. **Security-First**: Enterprise-grade authentication and authorization
5. **RESTful Design**: Clean, predictable API structure following REST principles

---

## �🏗️ Application Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  (Web App, Mobile App, Postman, External Integrations)      │
└────────────────┬────────────────────────────────────────────┘
                 │ HTTPS/REST API
┌────────────────▼────────────────────────────────────────────┐
│                    API GATEWAY / ROUTER                      │
│  ┌──────────┬──────────┬──────────┬──────────┬────────┐    │
│  │  Auth    │ Vehicles │ Stories  │  Users   │  AI    │    │
│  │ Routes   │  Routes  │  Routes  │  Routes  │ Routes │    │
│  └────┬─────┴────┬─────┴────┬─────┴────┬─────┴────┬───┘    │
└───────┼──────────┼──────────┼──────────┼──────────┼────────┘
        │          │          │          │          │
┌───────▼──────────▼──────────▼──────────▼──────────▼────────┐
│                    MIDDLEWARE LAYER                          │
│  ┌──────────┬──────────────┬──────────┬─────────────────┐  │
│  │   Auth   │  Advanced    │  Error   │     Async       │  │
│  │ Protect  │   Results    │ Handler  │    Handler      │  │
│  │   JWT    │   Paginate   │  Logger  │   Try-Catch     │  │
│  └──────────┴──────────────┴──────────┴─────────────────┘  │
└───────────────────────────┬──────────────────────────────────┘
                            │
┌───────────────────────────▼──────────────────────────────────┐
│                   CONTROLLER LAYER                            │
│              (Business Logic & Orchestration)                 │
│  ┌────────────┬────────────┬────────────┬─────────────────┐ │
│  │    Auth    │  Vehicles  │  Stories   │     Users       │ │
│  │ Controller │ Controller │ Controller │   Controller    │ │
│  └─────┬──────┴─────┬──────┴─────┬──────┴─────┬───────────┘ │
└────────┼────────────┼────────────┼────────────┼─────────────┘
         │            │            │            │
┌────────▼────────────▼────────────▼────────────▼─────────────┐
│                     SERVICE LAYER                             │
│  ┌────────────────┬────────────────┬───────────────────────┐ │
│  │  Data Parser   │   Narrative    │    Visual Generator   │ │
│  │   Service      │    Engine      │       Service         │ │
│  │ (Normalize)    │ (AI/Hugging)   │   (Media Creation)    │ │
│  └────────────────┴────────────────┴───────────────────────┘ │
└────────────────────────────┬──────────────────────────────────┘
                             │
┌────────────────────────────▼──────────────────────────────────┐
│                       MODEL LAYER                              │
│                  (Data Access & Validation)                    │
│  ┌────────────┬────────────┬────────────────────────────────┐ │
│  │   User     │  Vehicle   │      VehicleStory              │ │
│  │   Model    │   Model    │         Model                  │ │
│  │ (Mongoose) │ (Mongoose) │      (Mongoose)                │ │
│  └─────┬──────┴─────┬──────┴─────┬──────────────────────────┘ │
└────────┼────────────┼────────────┼────────────────────────────┘
         │            │            │
┌────────▼────────────▼────────────▼────────────────────────────┐
│                    DATABASE LAYER                              │
│                      MongoDB Atlas                             │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Collections: users, vehicles, vehiclestories            │ │
│  │  Indexes: email_1, vehicleId_1, createdAt_-1             │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
         │
┌────────▼────────────────────────────────────────────────────┐
│              EXTERNAL SERVICES                               │
│  ┌──────────────────┬────────────────────────────────────┐  │
│  │  Hugging Face    │         File Storage               │  │
│  │  (AI Models)     │    (Local/AWS S3/Cloudinary)       │  │
│  └──────────────────┴────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

---

## 📂 Project Structure

```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   └── db.js           # MongoDB connection setup
│   │
│   ├── models/             # Database Models (Mongoose Schemas)
│   │   ├── User.js         # User model with authentication
│   │   ├── Vehicle.js      # Vehicle technical specifications
│   │   └── VehicleStory.js # Generated storytelling content
│   │
│   ├── controllers/        # Business Logic Layer
│   │   ├── auth.js         # Authentication logic (register, login, JWT)
│   │   ├── vehicles.js     # Vehicle CRUD operations
│   │   ├── vehicleStories.js # Story generation & management
│   │   ├── users.js        # User management (admin)
│   │   ├── narrative.js    # Narrative generation endpoints
│   │   ├── media.js        # Media handling
│   │   ├── export.js       # Export to various formats
│   │   └── ai.js           # AI integration wrapper
│   │
│   ├── routes/             # API Route Definitions
│   │   ├── auth.js         # /api/v1/auth/* endpoints
│   │   ├── vehicles.js     # /api/v1/vehicles/* endpoints
│   │   ├── vehicleStories.js # /api/v1/stories/* endpoints
│   │   ├── users.js        # /api/v1/users/* endpoints
│   │   ├── narrative.js    # /api/v1/narrative/* endpoints
│   │   ├── media.js        # /api/v1/media/* endpoints
│   │   ├── export.js       # /api/v1/export/* endpoints
│   │   └── ai.js           # /api/v1/ai/* endpoints
│   │
│   ├── middleware/         # Custom Middleware Functions
│   │   ├── auth.js         # JWT verification & role-based access
│   │   ├── error.js        # Global error handler
│   │   ├── async.js        # Async/await wrapper
│   │   └── advancedResults.js  # Pagination, filtering, sorting
│   │
│   ├── services/           # Business Logic Services
│   │   ├── dataParser.js   # Parse & normalize vehicle data
│   │   ├── narrativeEngine.js # AI narrative generation
│   │   └── visualGenerator.js # Media asset generation
│   │
│   ├── utils/              # Utility Functions
│   │   ├── errorResponse.js    # Custom error class
│   │   └── logger.js           # Winston logger configuration
│   │
│   └── server.js           # Application Entry Point
│
├── tests/                  # Test Files
│   └── api.test.js        # Jest API tests
│
├── uploads/                # File uploads directory
├── logs/                   # Application logs
├── coverage/               # Test coverage reports
├── .env                    # Environment variables (private)
├── .env.example           # Environment template
├── package.json           # Dependencies & scripts
├── jest.config.js         # Jest test configuration
├── README.md              # Documentation
└── ARCHITECTURE.md        # This file
```

---

## 🔄 Request Flow & Data Processing Pipeline

### Standard API Request Flow

```
1. Client Request (HTTP)
      ↓
2. [Express Server] (server.js:126)
      ↓
3. [Security Middleware Stack]
   - Helmet (Security Headers)
   - CORS (Cross-Origin Resource Sharing)
   - Rate Limiter (DDoS Protection)
   - XSS Clean (Script Injection Prevention)
   - MongoDB Sanitize (NoSQL Injection Prevention)
   - HPP (HTTP Parameter Pollution)
      ↓
4. [Route Handler] (routes/*.js)
      ↓
5. [Authentication Middleware] (middleware/auth.js)
   - JWT Token Verification
   - User Authorization Check
   - Role-Based Access Control (RBAC)
      ↓
6. [Advanced Results Middleware] (optional)
   - Pagination (page, limit)
   - Filtering (query params)
   - Sorting (sort param)
   - Field Selection (select param)
      ↓
7. [Controller Function] (controllers/*.js)
   - Business Logic Execution
   - Service Layer Integration
   - Data Validation
      ↓
8. [Service Layer] (services/*.js)
   - Data Parser (normalize input)
   - Narrative Engine (AI generation)
   - Visual Generator (media creation)
      ↓
9. [Model Layer] (models/*.js)
   - Mongoose Schema Validation
   - Database Operations (CRUD)
   - Pre/Post Hooks Execution
      ↓
10. [MongoDB Database]
   - Query Execution
   - Index Optimization
   - Data Persistence
      ↓
11. [Response Handler]
   - Success: JSON response with data
   - Error: Error handler middleware catches and formats
      ↓
12. Client Receives Response
```

### Story Generation Pipeline (Unique to AutoStory)

```
1. User Uploads Vehicle Data (CSV/JSON/PDF)
      ↓
2. [Data Parser Service] (services/dataParser.js)
   - Extract vehicle specifications
   - Normalize field names
   - Validate data completeness
   - Parse technical metrics
      ↓
3. [Vehicle Model] (models/Vehicle.js)
   - Save normalized vehicle data
   - Create relationships
      ↓
4. [Narrative Engine Service] (services/narrativeEngine.js)
   - Generate story chapters using Hugging Face AI
   - Chapters: Overview, Performance, Technology, Safety, Experience
   - Apply tone & language preferences
   - Extract technical highlights
      ↓
5. [Visual Generator Service] (services/visualGenerator.js)
   - Generate infographics
   - Create 3D model metadata
   - Prepare video script
   - Generate audio narration script
      ↓
6. [VehicleStory Model] (models/VehicleStory.js)
   - Save complete story with media
   - Update processing status
   - Link to vehicle & user
      ↓
7. [Export Controller] (controllers/export.js)
   - Format output (PDF, HTML, Markdown, Video)
   - Generate downloadable files
      ↓
8. Client Receives Complete Story Package
```

---

## 📦 Core Components & Classes

### 1. **Models** (Data Access Layer)

#### **User Model** (`models/User.js`)
```javascript
class User extends mongoose.Model {
  // Fields
  - name: String (required, max 50 chars)
  - email: String (unique, validated, lowercase)
  - password: String (hashed with bcrypt, min 6 chars, not returned in queries)
  - role: Enum ['user', 'author', 'admin'] (default: 'user')
  - bio: String (max 500 chars)
  - avatar: String (image URL)
  - preferences: Object {
      favoriteGenres: [String],
      writingStyle: String,
      theme: Enum ['light', 'dark']
    }
  - statistics: Object {
      storiesCreated: Number,
      storiesPublished: Number,
      totalViews: Number,
      totalLikes: Number
    }
  - isVerified: Boolean
  - createdAt: Date

  // Methods
  + getSignedJwtToken(): String
    // Generates JWT token with user ID and expiry
    
  + matchPassword(enteredPassword: String): Boolean
    // Compares plain password with hashed password
    
  // Hooks
  + pre('save'): Hash password before saving
  + pre('remove'): Cascade delete related stories
  
  // Virtual Fields
  + stories: Reference to Story model (reverse populate)
}
```

#### **Vehicle Model** (`models/Vehicle.js`)
```javascript
class Vehicle extends mongoose.Model {
  // Basic Info
  - make: String (required)
  - model: String (required)
  - year: Number (required)
  - type: Enum ['sedan', 'suv', 'truck', 'coupe', ...]

  // Technical Specifications (Nested Objects)
  - specifications: {
      engine: {
        type: String,
        displacement: Number,
        cylinders: Number,
        horsepower: Number,
        torque: Number,
        fuelType: String
      },
      performance: {
        acceleration_0_100: Number,
        acceleration_0_60: Number,
        topSpeed: Number,
        quarterMile: Number
      },
      battery: {
        capacity: Number (kWh),
        range: Number (km),
        chargingTime: { fast, normal }
      },
      efficiency: {
        fuelConsumption: Number,
        co2Emissions: Number,
        range: Number
      },
      safety: {
        rating: Number,
        features: [String],
        airbags: Number,
        abs: Boolean,
        esc: Boolean
      },
      adas: {
        features: [String],
        adaptiveCruise: Boolean,
        laneKeeping: Boolean,
        autonomyLevel: Number (0-5)
      },
      transmission: {
        type: String,
        gears: Number,
        driveType: String
      },
      dimensions: {
        length, width, height, wheelbase, weight, trunkCapacity
      },
      technology: {
        infotainmentSystem: String,
        screenSize: Number,
        connectivity: [String],
        voiceControl: Boolean
      }
    }

  - createdBy: ObjectId (Reference to User)
  - createdAt: Date
  - updatedAt: Date

  // Virtual Fields
  + stories: Reference to VehicleStory model

  // Hooks
  + pre('save'): Update timestamp on save
}
```

#### **VehicleStory Model** (`models/VehicleStory.js`)
```javascript
class VehicleStory extends mongoose.Model {
  // Vehicle Reference
  - vehicleId: String (unique, required)
  - manufacturer: String (required)
  - model: String (required)
  - year: Number (required)
  - vehicleType: Enum ['sedan', 'suv', 'truck', ...]

  // Raw Technical Data
  - technicalData: Object (comprehensive vehicle specs)

  // Generated Narrative Content
  - narrative: {
      introChapter: {
        title: String,
        content: String (AI-generated),
        tone: Enum ['professional', 'emotional', 'technical', 'casual']
      },
      chapters: [{
        title: String,
        content: String (AI-generated),
        category: Enum ['performance', 'safety', 'design', 'technology'],
        order: Number,
        keyPoints: [String],
        comparisons: [String]
      }],
      summary: String,
      language: String (default: 'en')
    }

  // Media Assets
  - media: {
      coverImage: String (URL),
      images: [String],
      videos: [{
        url, title, duration, type
      }],
      infographics: [{
        url, title, format: Enum ['lottie', 'static', 'animated']
      }],
      audio: {
        narrationUrl, backgroundMusicUrl, voiceType
      },
      threeDModel: {
        modelUrl, textureUrls: [String], interactiveFeatures: [String]
      }
    }

  // Story Configuration
  - storyConfig: {
      tone: Enum ['professional', 'emotional', 'technical', 'casual'],
      targetAudience: Enum ['buyers', 'enthusiasts', 'dealers', 'general'],
      format: [Enum ['text', 'video', '3d', 'pdf', 'web']],
      includeComparisons: Boolean,
      includeVoiceOver: Boolean,
      language: String
    }

  // Processing Status
  - processing: {
      status: Enum ['draft', 'parsing', 'generating-narrative', 
                     'generating-media', 'completed', 'error'],
      progress: Number (0-100),
      currentStep: String,
      errorMessage: String
    }

  // Metadata
  - createdBy: ObjectId (Reference to User)
  - createdAt: Date
  - updatedAt: Date

  // Methods
  + updateProgress(step: String, progress: Number): void
  + markCompleted(): void
  + markError(message: String): void
}
```

---

## 🔧 Middleware Layer

### **Authentication Middleware** (`middleware/auth.js`)

```javascript
class AuthMiddleware {
  // Protect Routes - Verify JWT Token
  + protect(req, res, next): void
    /* 
     * 1. Extract token from Authorization header or cookies
     * 2. Verify token with JWT_SECRET
     * 3. Decode user ID from token
     * 4. Fetch user from database
     * 5. Attach user to req.user
     * 6. Call next() if valid, throw 401 if invalid
     */

  // Role-Based Access Control
  + authorize(...roles: String[]): Middleware
    /*
     * 1. Check if req.user.role is in allowed roles
     * 2. Call next() if authorized
     * 3. Throw 403 Forbidden if not authorized
     */
}
```

### **Error Handler Middleware** (`middleware/error.js`)

```javascript
class ErrorHandler {
  + errorHandler(err, req, res, next): void
    /*
     * Centralized error handling
     * 1. Log error with Winston logger
     * 2. Handle specific error types:
     *    - CastError: Invalid MongoDB ObjectId
     *    - 11000: Duplicate key error
     *    - ValidationError: Mongoose validation failure
     * 3. Format error response:
     *    { success: false, error: message }
     * 4. Send appropriate HTTP status code
     */
}
```

### **Async Handler Middleware** (`middleware/async.js`)

```javascript
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
/*
 * Wraps async functions to catch errors
 * Eliminates need for try-catch blocks
 * Automatically forwards errors to error handler
 */
```

### **Advanced Results Middleware** (`middleware/advancedResults.js`)

```javascript
class AdvancedResults {
  + advancedResults(model: Model, populate?: String): Middleware
    /*
     * Provides advanced query features:
     * 
     * 1. FILTERING
     *    - Query: ?make=Toyota&year[gte]=2020
     *    - Operators: gt, gte, lt, lte, in, ne
     * 
     * 2. FIELD SELECTION
     *    - Query: ?select=make,model,year
     *    - Returns only specified fields
     * 
     * 3. SORTING
     *    - Query: ?sort=-year,make
     *    - '-' prefix for descending order
     * 
     * 4. PAGINATION
     *    - Query: ?page=2&limit=10
     *    - Returns: { data, pagination: { next, prev } }
     * 
     * 5. POPULATION
     *    - Optionally populate referenced documents
     * 
     * Attaches results to res.advancedResults
     */
}
```

---

## 🎨 Service Layer Architecture

### **Data Parser Service** (`services/dataParser.js`)

```javascript
class DataParser {
  /*
   * PURPOSE: Extract and normalize vehicle data from various formats
   * INPUT: Raw vehicle data (CSV, JSON, PDF, API response)
   * OUTPUT: Normalized vehicle object matching Vehicle model schema
   */

  + parseVehicleData(rawData: Object): NormalizedVehicle
    /*
     * 1. Extract fields with multiple possible key names
     * 2. Parse engine specifications
     * 3. Parse performance metrics
     * 4. Parse battery/electric specifications
     * 5. Parse efficiency data
     * 6. Parse safety features
     * 7. Parse ADAS features
     * 8. Parse transmission details
     * 9. Parse dimensions
     * 10. Parse technology features
     * 11. Return normalized object
     */

  - extractField(data: Object, possibleKeys: String[]): Any
    // Try multiple key variations to find data

  - parseEngineSpecs(data: Object): EngineSpecs
  - parsePerformanceSpecs(data: Object): PerformanceSpecs
  - parseBatterySpecs(data: Object): BatterySpecs
  - parseEfficiencySpecs(data: Object): EfficiencySpecs
  - parseSafetySpecs(data: Object): SafetySpecs
  - parseAdasSpecs(data: Object): AdasSpecs
  - parseTransmissionSpecs(data: Object): TransmissionSpecs
  - parseDimensionSpecs(data: Object): DimensionSpecs
  - parseTechnologySpecs(data: Object): TechnologySpecs

  - parseNumber(value: Any): Number | null
    // Convert various number formats to Number

  - parseBoolean(value: Any): Boolean
    // Convert various truthy values to Boolean

  - parseArray(value: Any): Array
    // Convert various formats to Array
}
```

### **Narrative Engine Service** (`services/narrativeEngine.js`)

```javascript
class NarrativeEngine {
  /*
   * PURPOSE: Generate engaging narratives using AI
   * AI MODEL: Hugging Face - mistralai/Mistral-7B-Instruct-v0.2
   * INPUT: Vehicle data, tone, language, desired chapters
   * OUTPUT: Complete story with AI-generated content
   */

  + generateNarrative(config: Object): Story
    /*
     * config = {
     *   vehicle: Vehicle,
     *   tone: 'professional' | 'emotional' | 'technical' | 'casual',
     *   language: 'en' | 'fr' | 'es' | ...,
     *   chapters: ['overview', 'performance', 'technology', ...]
     * }
     * 
     * PROCESS:
     * 1. Generate title using AI
     * 2. Generate each chapter in parallel
     * 3. Combine chapters into cohesive narrative
     * 4. Return complete story object
     */

  - generateChapter(vehicle, chapterType, tone, language): Chapter
    /*
     * CHAPTER TYPES & TEMPLATES:
     * 
     * - overview: "Meet Your Vision"
     *   Focus: Design philosophy, first impressions
     * 
     * - performance: "Power & Precision"
     *   Focus: Engine, acceleration, driving dynamics
     * 
     * - technology: "Innovation at Your Fingertips"
     *   Focus: ADAS, infotainment, connectivity
     * 
     * - safety: "Protection Beyond Standards"
     *   Focus: Safety features, crash ratings
     * 
     * - experience: "The Journey Awaits"
     *   Focus: Comfort, emotions, driving feel
     * 
     * - efficiency: "Sustainable Performance"
     *   Focus: Fuel economy, emissions, range
     * 
     * AI GENERATION:
     * 1. Build chapter-specific prompt
     * 2. Call Hugging Face API
     * 3. Parse and clean AI response
     * 4. Extract technical highlights
     * 5. Determine visual type
     * 6. Return formatted chapter
     */

  - extractTechnicalHighlights(vehicle, chapterType): String[]
    // Extract key specs relevant to chapter

  - getVisualType(chapterType): String
    // Determine recommended visual format
    // e.g., 'graph', '3d-model', 'infographic', 'video'

  - callHuggingFaceAPI(prompt, parameters): String
    /*
     * Hugging Face API Integration
     * Model: mistralai/Mistral-7B-Instruct-v0.2
     * Parameters:
     *   - max_new_tokens: 20-300 (depending on content type)
     *   - temperature: 0.7-0.8 (creativity level)
     *   - top_p: 0.9 (nucleus sampling)
     *   - return_full_text: false (only new text)
     */
}
```

### **Visual Generator Service** (`services/visualGenerator.js`)

```javascript
class VisualGenerator {
  /*
   * PURPOSE: Generate visual assets and media
   * OUTPUT: Image URLs, video scripts, 3D model metadata
   */

  + generateInfographic(data: Object, type: String): InfographicURL
    /*
     * Types: 'performance-chart', 'safety-rating', 
     *        'efficiency-comparison', 'tech-features'
     * 
     * 1. Create data visualization template
     * 2. Populate with vehicle data
     * 3. Generate static or animated infographic
     * 4. Save to storage
     * 5. Return URL
     */

  + generateVideoScript(story: VehicleStory): VideoScript
    /*
     * 1. Extract key narrative points
     * 2. Create scene-by-scene script
     * 3. Add timing and transitions
     * 4. Include text overlays
     * 5. Suggest background music
     */

  + generate3DModelMetadata(vehicle: Vehicle): ThreeDMetadata
    /*
     * 1. Map vehicle dimensions to 3D coordinates
     * 2. Identify interactive hotspots
     * 3. Define camera angles
     * 4. Generate texture requirements
     * 5. Return metadata for 3D rendering engine
     */

  + generateAudioNarrationScript(narrative: Object): AudioScript
    /*
     * 1. Convert narrative to speech-friendly format
     * 2. Add pauses and emphasis markers
     * 3. Split into audio segments
     * 4. Return script for TTS engine
     */
}
```

### 2. **Controllers** (Business Logic)

Handle the core application logic:

- **auth.js**: User authentication & authorization
  - Register new users
  - Login with JWT token generation
  - Password management
  - Get current user profile

- **stories.js**: Story management
  - CRUD operations (Create, Read, Update, Delete)
  - Search and filter stories
  - Like/unlike stories
  - View count tracking

- **ai.js**: AI-powered features (Hugging Face)
  - Generate stories from prompts
  - Enhance existing stories (improve/expand/summarize)
  - Generate story ideas

- **reviews.js**: Review system
  - Add/update/delete reviews
  - Get reviews for stories
  - Auto-calculate average ratings

- **users.js**: User management (Admin only)
  - Get all users
  - Update/delete users

### 3. **Routes** (API Endpoints)

Define the API structure:

```
/api/v1/
├── auth/
│   ├── POST   /register          # Create account
│   ├── POST   /login             # Get JWT token
│   ├── GET    /logout            # Clear token
│   ├── GET    /me                # Get current user
│   ├── PUT    /updatedetails     # Update profile
│   └── PUT    /updatepassword    # Change password
│
├── stories/
│   ├── GET    /                  # Get all stories (with filters)
│   ├── POST   /                  # Create story (auth required)
│   ├── GET    /:id               # Get single story
│   ├── PUT    /:id               # Update story (owner/admin)
│   ├── DELETE /:id               # Delete story (owner/admin)
│   ├── GET    /search/:query     # Search stories
│   ├── PUT    /:id/like          # Like a story
│   └── /:storyId/reviews         # Story reviews (nested)
│
├── ai/
│   ├── POST   /generate          # Generate new story
│   ├── POST   /enhance/:storyId  # Enhance existing story
│   └── POST   /ideas             # Generate story ideas
│
├── reviews/
│   ├── GET    /                  # Get all reviews
│   ├── GET    /:id               # Get single review
│   ├── PUT    /:id               # Update review (owner)
│   └── DELETE /:id               # Delete review (owner)
│
└── users/ (Admin only)
    ├── GET    /                  # Get all users
    ├── GET    /:id               # Get single user
    ├── POST   /                  # Create user
    ├── PUT    /:id               # Update user
    └── DELETE /:id               # Delete user
```

### 4. **Middleware** (Request Processing)

Functions that run before controllers:

- **auth.js**: 
  - `protect()`: Verifies JWT token
  - `authorize(...roles)`: Checks user role permissions

- **advancedResults.js**: 
  - Pagination (`?page=1&limit=10`)
  - Filtering (`?genre=fantasy&status=published`)
  - Sorting (`?sort=-createdAt`)
  - Field selection (`?select=title,description`)

- **error.js**: 
  - Catches all errors
  - Formats error responses
  - Handles Mongoose validation errors

- **async.js**: 
  - Wraps async functions
  - Catches promise rejections

---

## 🔐 Authentication Flow

```
1. User Registration/Login
   ↓
2. Server generates JWT token
   ↓
3. Client stores token (localStorage/cookie)
   ↓
4. Client sends token in header: "Authorization: Bearer <token>"
   ↓
5. Server verifies token (middleware/auth.js)
   ↓
6. Request proceeds if valid, else 401 Unauthorized
```

**JWT Token contains:**
- User ID
- Expiry time (7 days)
- Signed with secret key

---

## 🤖 AI Integration (Hugging Face)

**How it works:**

1. User sends prompt to `/api/v1/ai/generate`
2. Controller formats prompt for Mistral-7B model
3. Sends request to Hugging Face Inference API
4. Receives generated text
5. Creates Story in database
6. Returns story to user

**Models Used:**
- **Mistral-7B-Instruct-v0.2**: Fast, high-quality text generation (FREE)

---

## 🔍 Advanced Query Examples

**Filter stories by genre:**
```
GET /api/v1/stories?genre=fantasy
```

**Pagination:**
```
GET /api/v1/stories?page=2&limit=20
```

**Sort by newest:**
```
GET /api/v1/stories?sort=-createdAt
```

**Multiple filters:**
```
GET /api/v1/stories?genre=fantasy&status=published&sort=-statistics.views
```

**Select specific fields:**
```
GET /api/v1/stories?select=title,description,author
```

**Search:**
```
GET /api/v1/stories/search/magic dragon
```

---

## 🛡️ Security Features

1. **Helmet**: Sets secure HTTP headers
2. **CORS**: Controls cross-origin requests
3. **Rate Limiting**: Max 100 requests per 15 minutes
4. **XSS Protection**: Sanitizes user input
5. **NoSQL Injection Prevention**: Sanitizes MongoDB queries
6. **HPP**: Prevents HTTP parameter pollution
7. **JWT Authentication**: Secure token-based auth
8. **Password Hashing**: bcrypt with salt rounds

---

## 📊 Database Relationships

```
User (1) ─────< Stories (many)
   │
   └─────< Reviews (many)

Story (1) ─────< Reviews (many)
```

**Cascading Deletes:**
- Delete User → Deletes all their Stories
- Delete Story → Deletes all its Reviews

---

## 🚀 Starting the Application

```bash
# Install dependencies
npm install

# Start development server (auto-reload)
npm run dev

# Start production server
npm start

# Run tests
npm test
```

**Server starts on:** `http://localhost:5000`

---

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | development |
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | localhost:27017 |
| `JWT_SECRET` | Secret key for JWT | (change this!) |
| `JWT_EXPIRE` | Token expiry time | 7d |
| `HUGGINGFACE_API_KEY` | HF API key (FREE) | required for AI |
| `CORS_ORIGIN` | Allowed origin | http://localhost:3000 |

---

## 🧪 Testing with Postman

1. Import `AutoStory_API.postman_collection.json`
2. Start with "Health Check" to verify server
3. Register a user (saves token automatically)
4. Test other endpoints (token auto-included)
5. Create stories, add reviews, generate AI content

---

## 📈 User Roles

- **user**: Can create/edit own stories, add reviews
- **author**: Same as user (for future expansion)
- **admin**: Full access, manage all users and content

---

## 🎯 Key Features Summary

✅ RESTful API design  
✅ JWT authentication  
✅ Role-based authorization  
✅ MongoDB with Mongoose ODM  
✅ AI story generation (Hugging Face - FREE)  
✅ Advanced filtering & pagination  
✅ Full-text search  
✅ Review & rating system  
✅ Statistics tracking  
✅ Error handling & logging  
✅ Security best practices  
✅ API documentation  

---

## 🐛 Common Issues & Solutions

**MongoDB Connection Failed:**
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod
```

**JWT Secret Warning:**
```bash
# Change JWT_SECRET in .env to a strong random string
JWT_SECRET=your-super-secret-random-key-here-change-this
```

**Hugging Face API Errors:**
- Make sure you have a valid API key from https://huggingface.co/settings/tokens
- Free tier has rate limits (be patient between requests)

---

## 📚 Additional Resources

- [Express.js Docs](https://expressjs.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [JWT.io](https://jwt.io/)
- [Hugging Face API](https://huggingface.co/docs/api-inference/index)

---

**Made with ❤️ for AutoStory**
