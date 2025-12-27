/**
 * Test Pexels API to fetch specific car images
 */

const axios = require('axios');

async function testPexelsAPI() {
  const pexelsKey = 'gYDoP4j3HMhrzVqNieR95iKA4qH0iy4QOCGUdGlrUjT2aBkgR6YfqkNH';
  
  const testQueries = [
    'Porsche 911 GT3 2024',
    'Ferrari SF90 2024',
    'Tesla Model S',
    'BMW M4'
  ];
  
  console.log('🔍 Testing Pexels API for specific car searches\n');
  
  for (const query of testQueries) {
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📝 Query: "${query}"`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    
    try {
      const response = await axios.get('https://api.pexels.com/v1/search', {
        headers: { 'Authorization': pexelsKey },
        params: {
          query: query,
          per_page: 3,
          orientation: 'landscape'
        },
        timeout: 10000
      });
      
      if (response.data.photos && response.data.photos.length > 0) {
        console.log(`✅ Found ${response.data.photos.length} images`);
        response.data.photos.forEach((photo, i) => {
          console.log(`  ${i + 1}. ${photo.alt || 'No description'}`);
          console.log(`     URL: ${photo.src.large2x}`);
        });
      } else {
        console.log(`⚠️  No images found for "${query}"`);
      }
      
    } catch (error) {
      console.error(`❌ API Error:`, error.response?.status, error.response?.statusText || error.message);
      if (error.response?.data) {
        console.error(`   Details:`, error.response.data);
      }
    }
  }
  
  console.log('\n\n💡 RECOMMENDATIONS:');
  console.log('  - If API fails: Check API key validity at https://www.pexels.com/api/');
  console.log('  - Rate limit: 200 requests/hour for free tier');
  console.log('  - Alternative: Use Unsplash API or pre-download images');
}

testPexelsAPI().catch(console.error);
