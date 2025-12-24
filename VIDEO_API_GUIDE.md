# 🎬 Gemini AI Video Generation Implementation Guide

## Current Status
The video generator is set up to:
1. ✅ Fetch real vehicle images from Pexels
2. ✅ Download and optimize images with Sharp
3. ✅ Generate cinematic prompts from story chapters
4. ⚠️  **Video API integration needed**

## Required: Actual Video Generation API

Google Gemini doesn't currently have a public video generation API. Here are your options:

### Option 1: Runway ML (Recommended)
```javascript
// In geminiVideoGenerator.js, replace generateVideoClip():

const response = await axios.post(
  'https://api.runwayml.com/v1/generate',
  {
    prompt: prompt,
    image: imageBase64,
    duration: 6,
    model: 'gen2'
  },
  {
    headers: {
      'Authorization': `Bearer ${process.env.RUNWAY_API_KEY}`,
      'Content-Type': 'application/json'
    }
  }
);
```
**Get API key:** https://runwayml.com/

### Option 2: Stability AI (Video Diffusion)
```javascript
const response = await axios.post(
  'https://api.stability.ai/v2beta/image-to-video',
  {
    image: imageBase64,
    cfg_scale: 1.8,
    motion_bucket_id: 127,
    seed: 0
  },
  {
    headers: {
      'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`,
    }
  }
);
```
**Get API key:** https://platform.stability.ai/

### Option 3: Pika Labs
```javascript
const response = await axios.post(
  'https://api.pika.art/v1/generate',
  {
    prompt: prompt,
    image_url: imageUrl,
    duration: 6
  },
  {
    headers: {
      'X-API-Key': process.env.PIKA_API_KEY
    }
  }
);
```
**Get API key:** https://pika.art/api

### Option 4: D-ID (Talking Head Videos)
Best for car presenters/spokespeople:
```javascript
const response = await axios.post(
  'https://api.d-id.com/talks',
  {
    source_url: imageUrl,
    script: {
      type: 'text',
      input: chapter.content
    }
  },
  {
    headers: {
      'Authorization': `Basic ${process.env.DID_API_KEY}`,
    }
  }
);
```
**Get API key:** https://www.d-id.com/api/

## Installation Steps

1. Choose a video API provider (Runway ML recommended)
2. Sign up and get API key
3. Add to `.env`:
```bash
RUNWAY_API_KEY=your_key_here
# OR
STABILITY_API_KEY=your_key_here
# OR
PIKA_API_KEY=your_key_here
```

4. Update `generateVideoClip()` method in `src/services/geminiVideoGenerator.js`

5. Test with:
```bash
node test-gemini-video.js
```

## Video Merging with FFmpeg

Once you have FFmpeg installed (via Homebrew or manual install):

```bash
# Install FFmpeg
brew install ffmpeg

# Or download binary:
# https://evermeet.cx/ffmpeg/
```

The merge function will work automatically once FFmpeg is available.

## Alternative: Use Our Canvas Video Generator

If video APIs are too expensive, you can use our existing Puppeteer-based generator:
```javascript
// In export controller:
const videoGenerator = require('../services/videoGenerator');
const videoData = await videoGenerator.generateVideo(vehicleStory);
```

This creates animated videos with:
- Cinematic text animations
- Particle effects
- Gradient backgrounds
- Professional typography

No external API needed!

## Cost Comparison

| Service | Cost per Video | Quality | Speed |
|---------|---------------|---------|-------|
| Runway ML | ~$0.05-0.10 | High | 1-2 min |
| Stability AI | ~$0.02-0.05 | Medium | 30-60s |
| Pika Labs | ~$0.03-0.07 | High | 1-3 min |
| D-ID | ~$0.30-0.50 | Medium | 1-2 min |
| Our Puppeteer | FREE | Medium | 30-40s |

## Recommended Approach

**For MVP/Testing:**
Use our Puppeteer-based generator (already working!)

**For Production:**
1. Start with Stability AI (cheapest)
2. Upgrade to Runway ML for higher quality
3. Use Pika Labs for creative effects

## Need Help?

The code is ready - you just need to:
1. Pick a video API
2. Get an API key  
3. Update the `generateVideoClip()` method
4. Run the test!

🎬 Happy video generation!
