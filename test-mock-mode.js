require('dotenv').config();
const { generateText } = require('./src/services/huggingFaceAPI');

async function testMockMode() {
  console.log('🎭 Testing Mock Mode...');
  console.log(`HUGGINGFACE_MOCK=${process.env.HUGGINGFACE_MOCK}`);
  
  try {
    console.log('\n📝 Generating test narratives...\n');
    
    const title = await generateText('Create a compelling marketing title for a 2024 Tesla Model S Plaid:', 20, 0.8);
    console.log('✅ Title:', title);
    
    const overview = await generateText('Write an overview of the 2024 Tesla Model S Plaid:', 300, 0.7);
    console.log('\n✅ Overview:', overview);
    
    const performance = await generateText('Describe the performance capabilities of this vehicle:', 300, 0.7);
    console.log('\n✅ Performance:', performance);
    
    console.log('\n🎉 Mock mode working perfectly!');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

testMockMode();
