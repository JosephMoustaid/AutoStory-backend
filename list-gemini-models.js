const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyB2xaqdf4GKbSrue66TpnvCIKkH58VUyhY';
  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    console.log('🔍 Listing available Gemini models...\n');
    
    // List all available models
    const models = await genAI.listModels();
    
    console.log(`Found ${models.length} models:\n`);
    
    for (const model of models) {
      console.log(`- ${model.name}`);
      console.log(`  Display Name: ${model.displayName}`);
      console.log(`  Supported methods: ${model.supportedGenerationMethods.join(', ')}`);
      console.log();
    }
  } catch (error) {
    console.error('Error listing models:', error.message);
  }
}

listModels();
