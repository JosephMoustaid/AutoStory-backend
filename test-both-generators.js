/**
 * Test script to compare both video generation methods
 * 1. Puppeteer Animated Videos (fast, immediate)
 * 2. Gemini AI Videos (slower, AI-guided motion)
 */

const videoGenerator = require('./src/services/videoGenerator');
const geminiVideoGenerator = require('./src/services/geminiVideoGenerator');

async function testBothGenerators() {
  console.log('\n🎬 VIDEO GENERATION COMPARISON TEST');
  console.log('============================================================\n');

  // Test story
  const testStory = {
    vehicleId: 'test-comparison-123',
    manufacturer: 'Ferrari',
    model: 'SF90 Stradale',
    year: 2024,
    vehicleType: 'Hybrid Supercar',
    narrative: {
      title: 'The Future of Performance',
      subtitle: 'Where Electric Meets Excellence',
      chapters: [
        {
          title: 'Hybrid Powerhouse',
          content: 'The SF90 Stradale combines a twin-turbo V8 with three electric motors, producing a staggering 986 horsepower. 0-60 mph in just 2.5 seconds.'
        },
        {
          title: 'Advanced Aerodynamics',
          content: 'Active aerodynamics with adjustable rear spoiler and vortex generators create maximum downforce while maintaining efficiency.'
        },
        {
          title: 'Cutting-Edge Technology',
          content: 'The latest eManettino brings electric power management to your fingertips, with four distinct driving modes from pure electric to Qualify.'
        }
      ]
    }
  };

  console.log('🚗 Test Vehicle:', testStory.year, testStory.manufacturer, testStory.model);
  console.log('📝 Story:', testStory.narrative.title);
  console.log('📚 Chapters:', testStory.narrative.chapters.length);
  console.log('\n');

  // Test 1: Animated Video (Fast)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST 1: ANIMATED VIDEO (Puppeteer + Canvas)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  const animatedStart = Date.now();
  try {
    const animatedVideo = await videoGenerator.generateVideo(testStory);
    const animatedTime = ((Date.now() - animatedStart) / 1000).toFixed(1);
    
    console.log('\n✅ ANIMATED VIDEO COMPLETE!\n');
    console.log('⏱️  Generation Time:', animatedTime, 'seconds');
    console.log('📹 Video Details:');
    console.log('  - File:', animatedVideo.filename);
    console.log('  - Size:', (animatedVideo.size / 1024 / 1024).toFixed(2), 'MB');
    console.log('  - Duration:', animatedVideo.duration, 'seconds');
    console.log('  - Resolution:', animatedVideo.resolution);
    console.log('  - Format:', animatedVideo.format);
    console.log('\n🌐 Access at: http://localhost:5000' + animatedVideo.url);
  } catch (error) {
    console.error('❌ Animated video failed:', error.message);
  }

  console.log('\n\n');

  // Test 2: AI-Generated Video (Slower)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST 2: GEMINI AI VIDEO (Vision + Analysis)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  const aiStart = Date.now();
  try {
    const aiVideo = await geminiVideoGenerator.generateCommercialVideo(testStory);
    const aiTime = ((Date.now() - aiStart) / 1000).toFixed(1);
    
    console.log('\n✅ AI VIDEO COMPLETE!\n');
    console.log('⏱️  Generation Time:', aiTime, 'seconds');
    console.log('📹 Video Details:');
    console.log('  - File:', aiVideo.filename);
    console.log('  - Size:', (aiVideo.size / 1024 / 1024).toFixed(2), 'MB');
    console.log('  - Duration:', aiVideo.duration, 'seconds');
    console.log('  - Clips:', aiVideo.clips);
    console.log('  - Resolution:', aiVideo.resolution);
    console.log('  - Format:', aiVideo.format);
    console.log('\n🌐 Access at: http://localhost:5000' + aiVideo.url);
  } catch (error) {
    console.error('❌ AI video failed:', error.message);
  }

  console.log('\n\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('COMPARISON SUMMARY');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  console.log('🎨 ANIMATED VIDEO:');
  console.log('  ✅ Fast (30-40 seconds)');
  console.log('  ✅ No AI API costs');
  console.log('  ✅ Cinematic effects');
  console.log('  ✅ Real car images as backgrounds');
  console.log('  ⚠️  Pre-programmed animations\n');
  
  console.log('🤖 GEMINI AI VIDEO:');
  console.log('  ✅ AI-analyzed motion');
  console.log('  ✅ Vision-guided camera work');
  console.log('  ✅ Dynamic scene understanding');
  console.log('  ✅ Real car images with AI motion');
  console.log('  ⚠️  Slower (5-6 minutes)');
  console.log('  ⚠️  Requires Gemini API\n');
  
  console.log('💡 RECOMMENDATION:');
  console.log('  - Use ANIMATED for instant previews');
  console.log('  - Use GEMINI AI for final production quality');
  console.log('\n');
}

// Run test
console.log('\n⚡ Starting comparison test in 2 seconds...\n');
setTimeout(() => {
  testBothGenerators().catch(console.error);
}, 2000);
