/**
 * Test Gemini AI Commercial Video Generation
 * Generates real commercial videos using:
 * - Gemini AI Video Generation
 * - Real vehicle images from web
 * - Story-based prompts
 */

require('dotenv').config();
const geminiVideoGenerator = require('./src/services/geminiVideoGenerator');

// Real vehicle story data
const testStory = {
  vehicleId: 'porsche-911-gt3-2024',
  year: 2024,
  manufacturer: 'Porsche',
  model: '911 GT3',
  vehicleType: 'Sports Car',
  narrative: {
    title: 'The Ultimate Driving Machine',
    subtitle: 'Porsche 911 GT3 - Track-Ready Excellence',
    chapters: [
      {
        title: 'Pure Performance',
        content: 'The naturally-aspirated 4.0-liter flat-six engine delivers 502 horsepower at 8,400 RPM, propelling you from 0-60 mph in just 3.2 seconds. This is racing engineering distilled into road-legal perfection, with every component optimized for the track.'
      },
      {
        title: 'Aerodynamic Mastery',
        content: 'The iconic rear wing generates up to 150% more downforce than its predecessor, working in harmony with the sculpted bodywork. Active aerodynamics adapt to your driving, whether carving apexes or cruising highways. Form follows function in the most beautiful way.'
      },
      {
        title: 'Driver-Focused Cockpit',
        content: 'Alcantara-wrapped steering wheel, carbon fiber bucket seats, and a minimalist digital display put you in complete control. Every switch, every gauge is positioned for split-second access. This is where driver and machine become one.'
      }
    ]
  }
};

async function testCommercialVideoGeneration() {
  try {
    console.log('🎬 GEMINI AI COMMERCIAL VIDEO GENERATION TEST');
    console.log('='.repeat(60));
    console.log(`\n🚗 Vehicle: ${testStory.year} ${testStory.manufacturer} ${testStory.model}`);
    console.log(`📝 Title: ${testStory.narrative.title}`);
    console.log(`📚 Chapters: ${testStory.narrative.chapters.length}`);
    console.log('\n⚠️  NOTE: This will take 3-9 minutes to generate!');
    console.log('⏱️  Each video clip takes 1-3 minutes...\n');
    
    const startTime = Date.now();
    const result = await geminiVideoGenerator.generateCommercialVideo(testStory);
    const totalTime = Math.round((Date.now() - startTime) / 1000);
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ COMMERCIAL VIDEO GENERATION COMPLETE!');
    console.log('='.repeat(60));
    console.log('\n📹 Video Details:');
    console.log(`  - File: ${result.filename}`);
    console.log(`  - Path: ${result.path}`);
    console.log(`  - URL: ${result.url}`);
    console.log(`  - Size: ${(result.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  - Duration: ${result.duration} seconds`);
    console.log(`  - Clips: ${result.clips} video segments`);
    console.log(`  - Resolution: ${result.resolution}`);
    console.log(`  - Format: ${result.format}`);
    console.log(`  - Generation Time: ${totalTime} seconds (${Math.round(totalTime/60)} minutes)`);
    console.log('\n🎉 Amazing commercial video generated with Gemini AI!');
    console.log(`\n🌐 Access at: http://localhost:5000${result.url}\n`);
    
  } catch (error) {
    console.error('\n❌ Video generation failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run the test
console.log('\n⚡ Starting in 2 seconds...\n');
setTimeout(testCommercialVideoGeneration, 2000);
