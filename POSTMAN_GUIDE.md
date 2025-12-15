# AutoStory API - Postman Testing Guide

## 📦 Import Instructions

### Import Collection & Environment
1. Open Postman
2. Click **Import** button (top left)
3. Drag and drop both files:
   - `AutoStory_API.postman_collection.json`
   - `AutoStory_API.postman_environment.json`
4. Select the **AutoStory - Development** environment from the dropdown (top right)

## 🚀 Quick Start Testing Flow

### Step 1: Authentication
Run these requests in order:

1. **Register User** - Creates a new user account
   - Automatically saves the auth token
   - Sets up userId variable

2. **Login User** - Authenticate with credentials
   - Updates auth token if needed

### Step 2: Create a Vehicle
3. **Create Vehicle** - Add a Tesla Model S Plaid
   - Example data is pre-filled
   - Saves vehicleId automatically

### Step 3: Generate Story
4. **Generate Story** - Create an AI-powered narrative
   - Uses the vehicleId from previous step
   - Saves storyId automatically
   - Takes ~10-30 seconds (AI generation)

### Step 4: Explore & Export
5. **Get Single Story** - View generated story
6. **Export Story - PDF/HTML/Markdown** - Download in various formats

## 📋 Collection Structure

### 1. Authentication (5 requests)
- ✅ Register User
- ✅ Login User
- ✅ Get Current User
- ✅ Update Password
- ✅ Logout

### 2. Vehicles (7 requests)
- ✅ Create Vehicle
- ✅ Get All Vehicles (with pagination)
- ✅ Get Single Vehicle
- ✅ Update Vehicle
- ✅ Delete Vehicle
- ✅ Parse Vehicle Data (JSON/CSV/PDF)
- ✅ Compare Vehicles

### 3. Vehicle Stories (11 requests)
- ✅ Generate Story (AI-powered)
- ✅ Get All Stories
- ✅ Get Single Story
- ✅ Update Story
- ✅ Publish Story
- ✅ Export Story - PDF
- ✅ Export Story - HTML
- ✅ Export Story - Markdown
- ✅ Export Story - JSON
- ✅ Export Story - Video
- ✅ Delete Story

### 4. Users - Admin Only (4 requests)
- ✅ Get All Users
- ✅ Get Single User
- ✅ Update User
- ✅ Delete User

## 🔑 Environment Variables

Auto-populated after requests:
- `baseUrl` - API base URL (http://localhost:5000/api/v1)
- `authToken` - JWT token (auto-saved on login)
- `userId` - Current user ID
- `vehicleId` - Created vehicle ID
- `storyId` - Generated story ID

## 💡 Testing Tips

### Authorization
- All protected endpoints automatically use `{{authToken}}`
- Token is saved after Register/Login
- Admin endpoints require role: 'admin'

### Query Parameters
Many endpoints support advanced filtering:
```
?select=make,model,year
?sort=-year
?page=1&limit=10
?status=published
```

### Vehicle Creation Examples

**Electric Vehicle (Tesla):**
```json
{
  "make": "Tesla",
  "model": "Model S Plaid",
  "year": 2024,
  "type": "electric"
}
```

**Sports Car (Porsche):**
```json
{
  "make": "Porsche",
  "model": "911 GT3 RS",
  "year": 2024,
  "type": "sports"
}
```

**SUV (Range Rover):**
```json
{
  "make": "Land Rover",
  "model": "Range Rover Sport",
  "year": 2024,
  "type": "suv"
}
```

### Story Generation Parameters

**Professional Tone:**
```json
{
  "vehicleId": "{{vehicleId}}",
  "tone": "professional",
  "language": "en",
  "targetAudience": "tech enthusiasts"
}
```

**Enthusiastic Tone:**
```json
{
  "vehicleId": "{{vehicleId}}",
  "tone": "enthusiastic",
  "language": "en",
  "targetAudience": "car enthusiasts"
}
```

### Export Formats
- **PDF** - Professional document
- **HTML** - Web-ready page
- **Markdown** - Documentation format
- **JSON** - Raw structured data
- **Video** - Storyboard script

## 🧪 Test Scenarios

### Scenario 1: Complete Vehicle Story Workflow
1. Register → Login
2. Create Vehicle (Tesla Model S)
3. Generate Story
4. Export as PDF & HTML

### Scenario 2: Vehicle Comparison
1. Create Vehicle 1 (Tesla)
2. Create Vehicle 2 (Porsche)
3. Compare Vehicles

### Scenario 3: Data Import
1. Parse Vehicle Data (CSV/JSON)
2. Generate Story from parsed data

### Scenario 4: Multi-language Stories
1. Create Vehicle
2. Generate Story (language: "en")
3. Generate Story (language: "fr")

## 🐛 Troubleshooting

### Error: Unauthorized
- Re-run Login request
- Check if token is saved in environment

### Error: Vehicle not found
- Ensure vehicleId is set
- Run "Create Vehicle" first

### Error: Story generation failed
- Check Hugging Face API key in .env
- Wait 30 seconds (AI processing)

## 📊 Expected Response Times

- Authentication: < 200ms
- Vehicle CRUD: < 100ms
- Story Generation: 10-30 seconds (AI processing)
- Export (PDF/HTML): 1-3 seconds
- Data Parsing: 500ms - 2 seconds

## 🔗 Base URL

Development: `http://localhost:5000/api/v1`

## 📝 Notes

- All timestamps are in ISO 8601 format
- Pagination defaults: page=1, limit=25
- Max file upload size: 5MB
- Rate limit: 100 requests per 15 minutes
- Story generation uses Hugging Face API (free tier)

## 🎯 Success Criteria

✅ All authentication endpoints work
✅ Vehicle CRUD operations successful
✅ Story generation completes without errors
✅ Export formats download correctly
✅ Admin endpoints restricted properly

Happy Testing! 🚀
