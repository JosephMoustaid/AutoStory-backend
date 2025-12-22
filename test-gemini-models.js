const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
  const apiKey = 'AIzaSyB2xaqdf4GKbSrue66TpnvCIKkH58VUyhY';
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const models = ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-pro', 'gemini-1.0-pro'];
  
  for (const modelName of models) {
    try {
      console.log(`\n🧪 Testing ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Say "Hello, I am working!" in one short sentence.');
      const response = await result.response;
      const text = response.text();
      console.log(`✅ ${modelName} works!`);
      console.log(`Response: ${text}`);
      break; // Use the first working model
    } catch (error) {
      console.log(`❌ ${modelName} failed: ${error.message}`);
    }
  }
}

testGemini();
