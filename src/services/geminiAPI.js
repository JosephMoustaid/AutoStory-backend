const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MOCK_MODE = process.env.AI_MOCK_MODE !== 'false'; // Default to mock mode unless explicitly disabled
// Use the router-style model id per Google AI Studio naming
const MODEL_NAME = 'models/gemini-flash-latest';

// Initialize Gemini only if we have a key and not in mock mode
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = (GEMINI_API_KEY && !MOCK_MODE) ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

/**
 * Generate mock text for development/testing
 * @param {string} prompt - The text prompt
 * @returns {string} - Mock generated text
 */
function generateMockText(prompt) {
  const lowerPrompt = prompt.toLowerCase();
  
  // Detect what kind of content is being requested
  if (lowerPrompt.includes('title')) {
    return 'Redefining Excellence: A New Era of Performance';
  }
  
  if (lowerPrompt.includes('overview') || lowerPrompt.includes('introduction')) {
    return 'This exceptional vehicle represents the convergence of innovative engineering and sophisticated design. Built with precision and passion, it delivers an experience that transcends traditional expectations, offering drivers a perfect harmony of power, efficiency, and luxury.';
  }
  
  if (lowerPrompt.includes('performance')) {
    return 'Performance is at the heart of this vehicle\'s DNA. With an advanced powertrain delivering exhilarating acceleration and responsive handling, every drive becomes an adventure. The precisely tuned suspension and intelligent power delivery system work in perfect harmony to provide both thrilling performance and refined comfort on any road.';
  }
  
  if (lowerPrompt.includes('technology')) {
    return 'Cutting-edge technology enhances every aspect of your journey. An intuitive infotainment system with seamless smartphone integration keeps you connected, while advanced driver assistance features provide confidence and peace of mind. Smart sensors and AI-powered systems adapt to your preferences, creating a personalized driving experience.';
  }
  
  if (lowerPrompt.includes('safety')) {
    return 'Safety is paramount, with comprehensive protection systems integrated throughout the vehicle. Multiple airbags, advanced collision avoidance technology, and intelligent monitoring systems work together to safeguard occupants. Rigorous testing ensures this vehicle meets and exceeds the highest safety standards.';
  }
  
  if (lowerPrompt.includes('experience') || lowerPrompt.includes('comfort')) {
    return 'The interior offers a sanctuary of comfort and refinement. Premium materials, intuitive controls, and thoughtful amenities create an inviting atmosphere. Spacious seating, advanced climate control, and superior sound insulation ensure every journey is a pleasure, whether commuting or touring.';
  }
  
  if (lowerPrompt.includes('efficiency')) {
    return 'Exceptional efficiency meets outstanding performance through innovative engineering. Advanced aerodynamics and intelligent power management optimize fuel economy without sacrificing capability. This vehicle proves that environmental responsibility and driving pleasure can coexist harmoniously.';
  }
  
  if (lowerPrompt.includes('design')) {
    return 'Striking design captures attention at every angle. Bold lines flow seamlessly from front to rear, creating a dynamic silhouette that signals both elegance and athleticism. Every detail, from the sculpted grille to the distinctive LED lighting, reflects a commitment to aesthetic excellence.';
  }
  
  // Default for story/narrative requests
  return 'This remarkable vehicle offers an exceptional blend of performance, technology, and comfort. Every element has been carefully engineered to deliver an outstanding driving experience, making it the perfect choice for discerning drivers who demand excellence in every detail.';
}

/**
 * Generate text using Google Gemini API or mock data
 * @param {string} prompt - The text prompt
 * @param {number} maxTokens - Maximum tokens to generate (unused for mock mode)
 * @param {number} temperature - Temperature for generation
 * @returns {Promise<string>} - Generated text
 */
async function generateText(prompt, maxTokens = 300, temperature = 0.7) {
  // Use mock mode if enabled or no API key
  if (MOCK_MODE) {
    console.log('🎭 Using mock mode for AI generation');
    return generateMockText(prompt);
  }

  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY not configured. Set AI_MOCK_MODE=true for development.');
  }

  if (!genAI) {
    throw new Error('Google Generative AI not initialized');
  }

  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ 
      model: MODEL_NAME,
      generationConfig: {
        temperature: temperature,
        maxOutputTokens: maxTokens,
      }
    });

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text || '';
  } catch (error) {
    console.error('Gemini API Error:', error);
    
    // Fallback to mock mode on API errors
    console.warn('⚠️  Gemini API failed, falling back to mock mode');
    return generateMockText(prompt);
  }
}

module.exports = {
  generateText,
  MODEL_NAME,
  MOCK_MODE
};
