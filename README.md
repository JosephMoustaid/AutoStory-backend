# AutoStory Backend API

Backend API for AutoStory - Immersive Technical Storytelling Platform for Vehicles

Transform raw automotive specifications into immersive, emotional, and personalized technical storytelling using AI, 3D, and interactive media.

## 🎯 Project Vision

Cars are packed with advanced engineering, yet their technical data is communicated through cold, unreadable specification sheets. **AutoStory** converts vehicle data into:

- 🎬 Interactive storytelling experiences
- 📊 Auto-generated animated videos and infographics
- 🎮 Real-time 3D explanations
- 🗣️ Voice narration and multilingual output
- 📄 Editable and exportable marketing content

## ✨ Core Features

- 🔐 User Authentication & Authorization (JWT)
- 🚗 Vehicle Data Management (CRUD, parsing, comparison)
- 📝 AI-Powered Narrative Generation (Hugging Face - FREE!)
- 🎨 Visual Asset Generation (Infographics, 3D scenes, animations)
- 📖 Multi-Chapter Story Creation
- 🌐 Multilingual Support
- 📤 Multiple Export Formats (PDF, HTML, Markdown, Video, JSON)
- 🔍 Advanced Search & Filtering
- 📊 Analytics & Statistics
- 🔒 Enterprise-Grade Security

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js (FastAPI-inspired structure)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **AI Integration**: Hugging Face API (Free - Mistral-7B model)
- **Security**: Helmet, express-rate-limit, xss-clean, hpp, mongo-sanitize

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher) - [Installation Guide](#mongodb-installation)
- Hugging Face API Key (FREE - get it at https://huggingface.co/settings/tokens)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration

5. Start the server:
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## 📡 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/logout` - Logout user
- `GET /api/v1/auth/me` - Get current user
- `PUT /api/v1/auth/updatedetails` - Update user details
- `PUT /api/v1/auth/updatepassword` - Update password

### Vehicles
- `GET /api/v1/vehicles` - Get all vehicles (with pagination, filtering)
- `GET /api/v1/vehicles/:id` - Get single vehicle
- `POST /api/v1/vehicles` - Create new vehicle
- `PUT /api/v1/vehicles/:id` - Update vehicle
- `DELETE /api/v1/vehicles/:id` - Delete vehicle
- `POST /api/v1/vehicles/parse` - Parse vehicle data (JSON/CSV)
- `POST /api/v1/vehicles/compare` - Compare multiple vehicles

### Vehicle Stories
- `GET /api/v1/stories` - Get all vehicle stories
- `GET /api/v1/stories/:id` - Get single story with analytics
- `POST /api/v1/stories/generate` - Generate immersive story from vehicle data
- `PUT /api/v1/stories/:id` - Update story
- `DELETE /api/v1/stories/:id` - Delete story
- `PUT /api/v1/stories/:id/publish` - Publish story
- `GET /api/v1/stories/:id/export/:format` - Export (pdf/html/markdown/video/json)

### Users (Admin)
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get single user
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   └── db.js           # MongoDB connection
│   ├── controllers/         # Route controllers
│   │   ├── auth.js         # Authentication
│   │   ├── vehicles.js     # Vehicle management & parsing
│   │   ├── vehicleStories.js # Story generation & export
│   │   └── users.js        # User management
│   ├── middleware/          # Custom middleware
│   │   ├── auth.js         # JWT protection
│   │   ├── advancedResults.js # Pagination/filtering
│   │   ├── error.js        # Error handling
│   │   └── async.js        # Async wrapper
│   ├── models/              # Database models
│   │   ├── User.js         # User schema
│   │   ├── Vehicle.js      # Vehicle schema with specs
│   │   └── VehicleStory.js # Story schema with chapters
│   ├── routes/              # API routes
│   │   ├── auth.js         # Auth endpoints
│   │   ├── vehicles.js     # Vehicle endpoints
│   │   ├── vehicleStories.js # Story endpoints
│   │   └── users.js        # User endpoints
│   ├── services/            # Business logic services
│   │   ├── narrativeEngine.js   # AI story generation
│   │   ├── visualGenerator.js   # Media asset generation
│   │   └── dataParser.js        # Vehicle data parsing
│   ├── utils/               # Utility functions
│   │   ├── errorResponse.js # Custom error class
│   │   └── logger.js        # Winston logger
│   └── server.js            # App entry point
├── uploads/                 # File uploads
├── logs/                    # Application logs
├── .env.example             # Environment template
├── .gitignore
├── package.json
├── README.md
├── ARCHITECTURE.md          # Detailed architecture docs
└── AutoStory_API.postman_collection.json  # Postman collection
```

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- XSS protection
- NoSQL injection prevention
- HPP protection
- Security headers with Helmet

## Environment Variables

See `.env.example` for all available environment variables.

## License

ISC
# AutoStory-backend
