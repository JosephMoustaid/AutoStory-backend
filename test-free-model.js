const axios = require('axios');
require('dotenv').config();

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
const MODEL_NAME = 'google/flan-t5-large';
const API_URL = `https://api-inference.huggingface.co/models/${MODEL_NAME}`;

async function testHfApi() {
  console.log('🔧 Testing Hugging Face API with free model...');
  console.log(`API Key: ${HF_API_KEY ? HF_API_KEY.substring(0, 10) + '...' : 'Missing ✗'}`);
  console.log(`Model: ${MODEL_NAME}`);
  console.log(`Endpoint: ${API_URL}`);
  
  if (!HF_API_KEY) {
    console.error('❌ HUGGINGFACE_API_KEY not found in environment');
    process.exit(1);
  }

  try {
    console.log('\n📝 Generating test text...');
    const response = await axios.post(
      API_URL,
      {
        inputs: 'Write a compelling description of a 2024 Tesla Model S Plaid:',
        parameters: {
          max_new_tokens: 100,
          temperature: 0.7
        },
        options: {
          wait_for_model: true
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000
      }
    );

    console.log('\n✅ API call successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    if (Array.isArray(response.data) && response.data.length > 0) {
      console.log('\nGenerated text:', response.data[0].generated_text || response.data[0].text);
    }
  } catch (error) {
    console.error('\n❌ API call failed:');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

testHfApi();
