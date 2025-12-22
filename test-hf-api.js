const { generateText } = require('./src/services/huggingFaceAPI');
require('dotenv').config();

async function testHfApi() {
  console.log('🔧 Testing Hugging Face API with direct axios calls...');
  
  try {
    console.log('\n📝 Generating test story...');
    const text = await generateText('Write a short one-sentence description of a 2024 Tesla Model S Plaid:', 50, 0.7);

    console.log('\n✅ API call successful!');
    console.log('\nGenerated text:', text);
  } catch (error) {
    console.error('\n❌ API call failed:');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

testHfApi();
