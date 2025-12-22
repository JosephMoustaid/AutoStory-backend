const axios = require('axios');

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
// Use google/flan-t5-large - it's free and works well for text generation
const MODEL_NAME = 'google/flan-t5-large';
const API_URL = `https://api-inference.huggingface.co/models/${MODEL_NAME}`;
const MOCK_MODE = process.env.HUGGINGFACE_MOCK === 'true';

/**
 * Generate mock text for development/testing
 * @param {string} prompt - The text prompt
 * @param {number} maxTokens - Maximum tokens (affects length)
 * @returns {string} - Mock generated text
 */
function generateMockText(prompt, maxTokens) {
  const lowerPrompt = prompt.toLowerCase();
  
  // Detect what kind of content is being requested
  if (lowerPrompt.includes('title')) {
    return 'Experience Excellence: The Ultimate Driving Machine';
  }
  
  if (lowerPrompt.includes('overview') || lowerPrompt.includes('introduction')) {
    return 'This remarkable vehicle represents the pinnacle of automotive engineering, combining cutting-edge technology with timeless design principles. Every detail has been meticulously crafted to deliver an unparalleled driving experience.';
  }
  
  if (lowerPrompt.includes('performance')) {
    return 'Engineered for exhilarating performance, this vehicle delivers breathtaking acceleration and precise handling. The powertrain seamlessly combines power and efficiency, while advanced suspension systems ensure a smooth, responsive ride that inspires confidence on every journey.';
  }
  
  if (lowerPrompt.includes('technology')) {
    return 'State-of-the-art technology enhances every aspect of the driving experience. The intuitive infotainment system provides seamless connectivity, while advanced driver assistance features offer peace of mind. Smart integration brings the future of mobility to your fingertips.';
  }
  
  if (lowerPrompt.includes('safety')) {
    return 'Comprehensive safety systems protect you and your passengers at all times. Multiple airbags, advanced collision avoidance technology, and intelligent monitoring systems work together to provide maximum protection. Every journey is backed by industry-leading safety standards.';
  }
  
  if (lowerPrompt.includes('experience') || lowerPrompt.includes('comfort')) {
    return 'Step inside to discover a sanctuary of comfort and refinement. Premium materials, ergonomic design, and thoughtful amenities create an environment where every journey becomes a pleasure. The cabin offers a perfect blend of luxury and functionality.';
  }
  
  if (lowerPrompt.includes('efficiency')) {
    return 'Impressive efficiency meets outstanding performance. Advanced engineering optimizes fuel consumption without compromising power delivery. Whether cruising on the highway or navigating city streets, this vehicle demonstrates exceptional economy and reduced environmental impact.';
  }
  
  // Default response
  return 'This exceptional vehicle offers outstanding capabilities across all metrics. From performance to comfort, technology to safety, every aspect has been engineered to exceed expectations and deliver a superior driving experience that defines modern automotive excellence.';
}

/**
 * Call Hugging Face Inference API or return mock data
 * @param {string} prompt - The text prompt
 * @param {number} maxTokens - Maximum tokens to generate
 * @param {number} temperature - Temperature for generation
 * @returns {Promise<string>} - Generated text
 */
async function generateText(prompt, maxTokens = 300, temperature = 0.7) {
  // Use mock mode if enabled
  if (MOCK_MODE) {
    console.log('🎭 Mock mode: Generating placeholder text');
    return generateMockText(prompt, maxTokens);
  }

  if (!HF_API_KEY) {
    throw new Error('HUGGINGFACE_API_KEY not configured. Set HUGGINGFACE_MOCK=true to use mock mode for development.');
  }

  try {
    const response = await axios.post(
      API_URL,
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: maxTokens,
          temperature,
          top_p: 0.9,
          return_full_text: false
        },
        options: {
          wait_for_model: true,
          use_cache: false
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000 // 60 second timeout
      }
    );

    // Handle different response formats from HF API
    const data = response.data;
    
    if (Array.isArray(data) && data.length > 0) {
      return data[0].generated_text || data[0].text || '';
    }
    
    if (data.generated_text) {
      return data.generated_text;
    }
    
    if (typeof data === 'string') {
      return data;
    }

    return '';
  } catch (error) {
    // Handle specific API errors
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      if (status === 503) {
        throw new Error('Model is loading, please try again in a few moments');
      }
      
      if (status === 401) {
        throw new Error('Invalid Hugging Face API key');
      }
      
      if (data && data.error) {
        const errorMsg = typeof data.error === 'string' ? data.error : JSON.stringify(data.error);
        
        // Handle deprecated endpoint error
        if (errorMsg.includes('no longer supported') || errorMsg.includes('router.huggingface.co')) {
          throw new Error('Hugging Face API endpoint deprecated. Please update your API key to a fine-grained token with "Inference Providers" permissions, or set HUGGINGFACE_MOCK=true for development.');
        }
        
        throw new Error(`Hugging Face API error: ${errorMsg}`);
      }
    }
    
    throw new Error(`Failed to generate text: ${error.message}`);
  }
}

module.exports = {
  generateText,
  MODEL_NAME,
  MOCK_MODE
};
