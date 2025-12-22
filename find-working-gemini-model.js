const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGeminiModels() {
  const apiKey = 'AIzaSyB2xaqdf4GKbSrue66TpnvCIKkH58VUyhY';
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Try different model variations
  const modelVariations = [
    'models/gemini-1.5-pro',
    'models/gemini-1.5-flash',
    'models/gemini-pro',
    'gemini-1.5-pro-latest',
    'gemini-1.5-flash-latest',
    'gemini-pro',
    'gemini-1.5-pro',
    'gemini-1.5-flash'
  ];
  
  for (const modelName of modelVariations) {
    try {
      console.log(`\n🧪 Testing: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      
      const result = await model.generateContent('Write one sentence about a Tesla car.');
      const response = await result.response;
      const text = response.text();
      
      console.log(`✅ SUCCESS with ${modelName}`);
      console.log(`Response: ${text}\n`);
      console.log(`Use this model name: "${modelName}"`);
      return modelName;
    } catch (error) {
      console.log(`❌ Failed: ${error.message.substring(0, 100)}...`);
    }
  }
  
  console.log('\n⚠️  No working model found. Mock mode will be used.');
}

testGeminiModels();
