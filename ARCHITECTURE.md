# 📖 AutoStory Backend Architecture Guide

## 🏗️ Application Structure

```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   └── db.js           # MongoDB connection setup
│   │
│   ├── models/             # Database Models (Mongoose Schemas)
│   │   ├── User.js         # User model with authentication
│   │   ├── Story.js        # Story model with metadata
│   │   └── Review.js       # Review model with ratings
│   │
│   ├── controllers/        # Business Logic Layer
│   │   ├── auth.js         # Authentication logic (register, login, JWT)
│   │   ├── stories.js      # Story CRUD operations
│   │   ├── reviews.js      # Review management
│   │   ├── users.js        # User management (admin)
│   │   └── ai.js           # AI story generation with Hugging Face
│   │
│   ├── routes/             # API Route Definitions
│   │   ├── auth.js         # /api/v1/auth/* endpoints
│   │   ├── stories.js      # /api/v1/stories/* endpoints
│   │   ├── reviews.js      # /api/v1/reviews/* endpoints
│   │   ├── users.js        # /api/v1/users/* endpoints
│   │   └── ai.js           # /api/v1/ai/* endpoints
│   │
│   ├── middleware/         # Custom Middleware Functions
│   │   ├── auth.js         # JWT verification & role-based access
│   │   ├── error.js        # Global error handler
│   │   ├── async.js        # Async/await wrapper
│   │   └── advancedResults.js  # Pagination, filtering, sorting
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
├── .env                    # Environment variables (private)
├── .env.example           # Environment template
├── package.json           # Dependencies & scripts
└── README.md              # Documentation
```

---

## 🔄 Request Flow

```
Client Request
      ↓
[Express Server] (server.js)
      ↓
[Security Middleware] (helmet, cors, rate-limit, xss-clean)
      ↓
[Route Handler] (routes/*.js)
      ↓
[Authentication Middleware] (middleware/auth.js) - if protected route
      ↓
[Controller] (controllers/*.js) - Business logic
      ↓
[Model] (models/*.js) - Database operations
      ↓
[MongoDB Database]
      ↓
[Response] - JSON data back to client
```

---

## 📦 Core Components Explained

### 1. **Models** (Data Layer)

Define the structure of data stored in MongoDB:

- **User.js**: User accounts with authentication
  - Fields: name, email, password (hashed), role, bio, avatar, preferences, statistics
  - Methods: `matchPassword()`, `getSignedJwtToken()`
  - Hooks: Password hashing before save

- **Story.js**: Story content and metadata
  - Fields: title, description, content, genre, tags, author, status, statistics
  - Auto-calculates: word count, reading time
  - Relationships: Belongs to User, has many Reviews

- **Review.js**: User reviews and ratings
  - Fields: title, text, rating (1-5), story, user
  - Auto-updates: Story average rating after save/delete

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
