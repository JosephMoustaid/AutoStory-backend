# Image API Setup Guide

## Current Status

✅ **Video generation is working!**
⚠️ **Using fallback images** - Same car image used for all clips to ensure consistency

## Why You See Generic Cars

The videos use the **same car image throughout** to ensure consistency. This prevents the issue where different cars appear in different clips (Ferrari → 90s car → BMW, etc.).

## Get Specific Car Images (Optional)

To fetch **actual images of the specific car model** (e.g., real Porsche 911 GT3 images), you need a free Pexels API key.

### Step 1: Get a Free Pexels API Key

1. Go to **https://www.pexels.com/api/**
2. Click **"Get Started"**
3. Sign up for a free account
4. Go to your dashboard: https://www.pexels.com/api/
5. Copy your API key (looks like: `abcdef1234567890...`)

### Step 2: Add to .env File

```bash
# In your .env file, add:
PEXELS_API_KEY=your_api_key_here
```

### Step 3: Test It

```bash
node test-pexels-api.js
```

You should see:
```
✅ Found 3 images of "Porsche 911 GT3 2024"
```

## Alternative: Unsplash API (Optional)

If Pexels doesn't have images for a specific car, the system will try Unsplash automatically.

1. Go to **https://unsplash.com/developers**
2. Create a free app
3. Copy your Access Key
4. Add to `.env`:

```bash
UNSPLASH_API_KEY=your_unsplash_key_here
```

## How It Works

### With API Key ✅
```
🔍 Searching: "Ferrari SF90 2024"
✅ Found Pexels images
✅ Using SAME Ferrari image for all clips
📹 Result: Consistent Ferrari throughout video
```

### Without API Key (Current) ⚠️
```
🔍 Searching: "Ferrari SF90 2024"  
⚠️ API not configured
⚠️ Using generic luxury car
📹 Result: Same generic car throughout (still consistent!)
```

## Recommendations

### For Production / Client Demos
✅ **Get Pexels API key** - Shows actual car model  
✅ **Free tier:** 200 requests/hour (plenty for your use case)  
✅ **Takes 2 minutes to setup**

### For Testing / Development
✅ **Current fallback works fine** - Ensures consistency  
✅ **No API key needed** - Videos generate successfully  
✅ **Professional quality** - Same cinematic effects

## FAQ

**Q: Why does it use the same image 3-4 times?**  
A: To ensure consistency! Previously, different images showed different cars (Ferrari → BMW → 90s car). Now it's the SAME car throughout the video with different camera angles and motion.

**Q: Will it slow down video generation?**  
A: No! Image fetching takes ~1-2 seconds. Video generation time remains the same (30-40 seconds for animated, 5-6 minutes for AI).

**Q: What if Pexels doesn't have my car?**  
A: The system automatically:
1. Tries Pexels API
2. Falls back to Unsplash API
3. Uses consistent generic luxury car image

All options ensure consistency!

## Testing

Test with your car models:

```javascript
// test-image-search.js
const videoGenerator = require('./src/services/videoGenerator');

const story = {
  manufacturer: 'Lamborghini',
  model: 'Huracán',
  year: 2024
};

videoGenerator.fetchVehicleImages(story).then(images => {
  console.log('Images:', images);
});
```

---

**Need help?** Check the main README.md or open an issue!
