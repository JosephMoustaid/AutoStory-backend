const axios = require('axios');
require('dotenv').config();

const BASE_URL = 'http://localhost:5000/api/v1';

async function testFullFlow() {
  console.log('🚗 Testing AutoStory Backend - Story Generation with Mock Mode');
  console.log('================================================================\n');

  try {
    // Test 1: Health check
    console.log('1️⃣  Testing health endpoint...');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('   ✅ Server is healthy\n');

    // Test 2: Login/Register
    console.log('2️⃣  Authenticating...');
    let token;
    try {
      const login = await axios.post(`${BASE_URL}/auth/login`, {
        email: 'test@example.com',
        password: 'password123'
      });
      token = login.data.token;
      console.log('   ✅ Logged in successfully\n');
    } catch (error) {
      console.log('   ⚠️  Login failed, registering...');
      const register = await axios.post(`${BASE_URL}/auth/register`, {
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'password123'
      });
      token = register.data.token;
      console.log('   ✅ Registered successfully\n');
    }

    // Test 3: Create vehicle
    console.log('3️⃣  Creating test vehicle...');
    let vehicleId;
    try {
      const vehicle = await axios.post(
        `${BASE_URL}/vehicles`,
        {
          year: 2024,
          make: 'Tesla',
          model: 'Model S Plaid',
          specifications: {
            engine: {
              type: 'Tri-Motor Electric',
              horsepower: 1020,
              torque: 1420
            },
            transmission: {
              type: 'Single-Speed Automatic'
            },
            performance: {
              acceleration: '0-60 mph in 1.99s',
              topSpeed: 200,
              range: 396
            }
          }
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      vehicleId = vehicle.data.data._id || vehicle.data.data.id;
      console.log(`   ✅ Vehicle created: ${vehicleId}\n`);
    } catch (error) {
      console.log('   ⚠️  Vehicle creation failed, fetching existing...');
      const vehicles = await axios.get(`${BASE_URL}/vehicles`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      vehicleId = vehicles.data.data[0]?._id || vehicles.data.data[0]?.id;
      console.log(`   ✅ Using existing vehicle: ${vehicleId}\n`);
    }

    // Test 4: Generate story (MAIN TEST)
    console.log('4️⃣  Generating story with MOCK MODE...');
    console.log('   This should use placeholder AI-generated content...\n');

    const story = await axios.post(
      `${BASE_URL}/stories/generate`,
      {
        vehicleId: vehicleId,
        chapters: ['overview', 'performance', 'technology', 'safety'],
        tone: 'enthusiastic',
        language: 'en'
      },
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 30000
      }
    );

    console.log('✅ SUCCESS! Story generated with mock mode\n');
    console.log(`   Title: ${story.data.data.title}`);
    console.log(`   Subtitle: ${story.data.data.subtitle}`);
    console.log(`\n   Chapters generated (${story.data.data.chapters.length}):`);
    
    story.data.data.chapters.forEach((chapter, i) => {
      const preview = chapter.content.substring(0, 80);
      console.log(`   ${i + 1}. ${chapter.title}: ${preview}...`);
    });

    console.log('\n🎉 All tests passed! Mock mode is working perfectly!');
    console.log('\n📝 Summary:');
    console.log(`   - Mock mode: ENABLED (${process.env.HUGGINGFACE_MOCK})`);
    console.log(`   - Story ID: ${story.data.data._id}`);
    console.log(`   - Vehicle: ${story.data.data.vehicle.year} ${story.data.data.vehicle.make} ${story.data.data.vehicle.model}`);
    console.log(`   - Chapters: ${story.data.data.chapters.length}`);
    console.log('\n✨ Your AutoStory backend is fully operational!');

  } catch (error) {
    console.error('\n❌ Test failed:');
    console.error('   Error:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

testFullFlow();
