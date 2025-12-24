/**
 * Test script for video generation
 * Creates a test story and generates an amazing animated video
 */

const videoGenerator = require('./src/services/videoGenerator');

// Mock story data
const testStory = {
  vehicleId: 'test-vehicle-123',
  year: 2024,
  manufacturer: 'Tesla',
  model: 'Model S Plaid',
  vehicleType: 'Electric Sedan',
  narrative: {
    title: 'The Future of Performance',
    subtitle: 'Tesla Model S Plaid - Redefining Electric Excellence',
    chapters: [
      {
        title: 'Lightning in a Bottle',
        content: 'With tri-motor all-wheel drive delivering 1,020 horsepower, the Model S Plaid accelerates from 0-60 mph in under 2 seconds. This isn\'t just fast—it\'s a physics-defying experience that redefines what an electric vehicle can achieve.'
      },
      {
        title: 'Cutting-Edge Technology',
        content: 'A 17-inch cinematic display serves as your command center, controlling everything from climate to entertainment. With over-the-air updates, your vehicle constantly evolves, gaining new features and improvements while you sleep.'
      },
      {
        title: 'Sustainable Luxury',
        content: 'Premium vegan leather interior, HEPA air filtration, and a 396-mile range prove that luxury and sustainability can coexist. This is the future of automotive excellence, available today.'
      }
    ]
  }
};

async function testVideoGeneration() {
  try {
    console.log('🎬 Starting video generation test...\n');
    console.log('Story:', testStory.narrative.title);
    console.log('Chapters:', testStory.narrative.chapters.length);
    console.log('');
    
    const result = await videoGenerator.generateVideo(testStory);
    
    console.log('\n✅ Video generation completed!');
    console.log('');
    console.log('📹 Video Details:');
    console.log('  - File:', result.filename);
    console.log('  - Path:', result.path);
    console.log('  - URL:', result.url);
    console.log('  - Size:', (result.size / 1024 / 1024).toFixed(2), 'MB');
    console.log('  - Duration:', result.duration, 'seconds');
    console.log('  - Resolution:', result.resolution);
    console.log('  - Format:', result.format);
    console.log('');
    console.log('🎉 Amazing animated video generated successfully!');
    
  } catch (error) {
    console.error('❌ Video generation failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run the test
testVideoGeneration();
