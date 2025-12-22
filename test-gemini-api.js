const { generateText } = require('./src/services/geminiAPI');
require('dotenv').config();

async function testGeminiApi() {
  console.log('🔧 Testing Google Gemini API...');
  console.log(`API Key: ${process.env.GEMINI_API_KEY ? 'Found ✓' : 'Missing ✗'}`);
  
  try {
    console.log('\n📝 Generating test story...');
    const text = await generateText('Write a short one-sentence description of a 2024 Tesla Model S Plaid:', 50, 0.7);

    console.log('\n✅ API call successful!');
    console.log('\nGenerated text:', text);
    
    console.log('\n📝 Testing vehicle narrative...');
    const narrative = await generateText('Write a compelling paragraph about the performance capabilities of a high-performance electric vehicle:', 200, 0.7);
    
    console.log('\n✅ Narrative generated!');
    console.log('\nNarrative:', narrative);
    
  } catch (error) {
    console.error('\n❌ API call failed:');
    console.error('Error:', error.message);
    process.exit(1);
  }
}

testGeminiApi();
