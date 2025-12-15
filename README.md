# AutoStory Backend API

Backend API for AutoStory - An automated story generation platform powered by AI.

## Features

- 🔐 User Authentication & Authorization (JWT)
- 📚 Story Management (CRUD operations)
- 🤖 AI-Powered Story Generation (OpenAI Integration)
- 👤 User Profile Management
- 📊 Story Analytics & Statistics
- 🔍 Advanced Search & Filtering
- 📝 Story Templates & Genres
- ⭐ Ratings & Reviews
- 🔒 Security Features (Rate Limiting, XSS Protection, etc.)
- 📄 Comprehensive API Documentation

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **AI Integration**: OpenAI API
- **Security**: Helmet, express-rate-limit, xss-clean, hpp

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- OpenAI API Key

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

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/logout` - Logout user
- `GET /api/v1/auth/me` - Get current user
- `PUT /api/v1/auth/updatedetails` - Update user details
- `PUT /api/v1/auth/updatepassword` - Update password

### Stories
- `GET /api/v1/stories` - Get all stories (with pagination, filtering)
- `GET /api/v1/stories/:id` - Get single story
- `POST /api/v1/stories` - Create new story
- `PUT /api/v1/stories/:id` - Update story
- `DELETE /api/v1/stories/:id` - Delete story
- `POST /api/v1/stories/generate` - Generate story with AI

### Users
- `GET /api/v1/users` - Get all users (Admin only)
- `GET /api/v1/users/:id` - Get single user
- `PUT /api/v1/users/:id` - Update user (Admin only)
- `DELETE /api/v1/users/:id` - Delete user (Admin only)

### Reviews
- `GET /api/v1/stories/:storyId/reviews` - Get reviews for a story
- `POST /api/v1/stories/:storyId/reviews` - Add review
- `PUT /api/v1/reviews/:id` - Update review
- `DELETE /api/v1/reviews/:id` - Delete review

## Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── utils/          # Utility functions
│   └── server.js       # App entry point
├── uploads/            # File uploads directory
├── .env.example        # Environment variables example
├── .gitignore
├── package.json
└── README.md
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
