const axios = require('axios');
require('dotenv').config();

const BASE_URL = 'http://localhost:5000/api/v1';

async function testStoryGeneration() {
  try {
    console.log('🔐 Step 1: Register/Login...');
    
    // Register a test user
    let token;
    try {
      const registerRes = await axios.post(`${BASE_URL}/auth/register`, {
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        role: 'user'
      });
      token = registerRes.data.token;
      console.log('✅ Registered new user');
    } catch (err) {
      // If registration fails, try login
      const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
        email: 'test@example.com',
        password: 'password123'
      });
      token = loginRes.data.token;
      console.log('✅ Logged in with existing user');
    }

    console.log('\n🚗 Step 2: Create a vehicle...');
    const vehicleRes = await axios.post(
      `${BASE_URL}/vehicles`,
      {
        year: 2024,
        make: 'Tesla',
        model: 'Model S Plaid',
        trim: 'Performance',
        specifications: {
          engine: {
            type: 'Tri-Motor Electric',
            horsepower: 1020,
            torque: 1420
          },
          transmission: {
            type: 'Single-Speed Direct Drive',
            drivetrain: 'AWD'
          },
          performance: {
            acceleration: '1.99s (0-60 mph)',
            topSpeed: '200 mph',
            range: '396 miles'
          },
          dimensions: {
            length: 196.0,
            width: 77.3,
            height: 56.9,
            wheelbase: 116.5,
            curbWeight: 4766
          },
          fuelEconomy: {
            city: 0,
            highway: 0,
            combined: 'N/A (Electric)'
          }
        },
        features: [
          'Autopilot',
          'Full Self-Driving Capability',
          '17" Cinematic Display',
          'Premium Audio',
          'Glass Roof'
        ],
        tags: ['electric', 'performance', 'luxury', 'sedan']
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const vehicleId = vehicleRes.data.data._id;
    console.log(`✅ Created vehicle: ${vehicleId}`);

    console.log('\n📝 Step 3: Generate story with Gemini...');
    const storyRes = await axios.post(
      `${BASE_URL}/stories/generate`,
      {
        vehicleId: vehicleId,
        tone: 'professional',
        language: 'en',
        targetAudience: 'tech enthusiasts',
        focusAreas: ['performance', 'technology', 'innovation']
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    console.log('✅ Story generated successfully!');
    console.log('\nStory Details:');
    console.log('- Title:', storyRes.data.data.narrative?.title || 'N/A');
    console.log('- Subtitle:', storyRes.data.data.narrative?.subtitle || 'N/A');
    console.log('- Chapters:', storyRes.data.data.narrative?.chapters?.length || 0);
    
    if (storyRes.data.data.narrative?.chapters?.length > 0) {
      console.log('\nFirst Chapter:');
      console.log('- Title:', storyRes.data.data.narrative.chapters[0].title);
      console.log('- Content:', storyRes.data.data.narrative.chapters[0].content.substring(0, 200) + '...');
    }

    console.log('\n✅ ALL TESTS PASSED! Gemini API is working correctly.');

  } catch (error) {
    console.error('\n❌ TEST FAILED');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    process.exit(1);
  }
}

testStoryGeneration();
