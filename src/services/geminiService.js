const { GoogleGenerativeAI } = require('@google/generative-ai');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MOCK_MODE = process.env.AI_MOCK_MODE !== 'false';

class GeminiService {
  constructor() {
    this.genAI = GEMINI_API_KEY && !MOCK_MODE ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
    this.defaultModel = process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp';
    this.visionModel = process.env.GEMINI_VISION_MODEL || 'gemini-2.0-flash-exp';
    this.chatSessions = new Map(); // Store active chat sessions
  }

  /**
   * Generate text with Gemini
   */
  async generateText(prompt, options = {}) {
    const {
      temperature = 0.7,
      maxTokens = 1000,
      model = this.defaultModel
    } = options;

    if (MOCK_MODE) {
      return this.getMockResponse(prompt);
    }

    if (!this.genAI) {
      throw new Error('Gemini API not initialized. Set GEMINI_API_KEY or enable mock mode.');
    }

    try {
      const geminiModel = this.genAI.getGenerativeModel({
        model,
        generationConfig: {
          temperature,
          maxOutputTokens: maxTokens,
        }
      });

      const result = await geminiModel.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Gemini generation error:', error);
      throw new Error(`Gemini API error: ${error.message}`);
    }
  }

  /**
   * Generate text with streaming
   */
  async *generateStreamText(prompt, options = {}) {
    const {
      temperature = 0.7,
      maxTokens = 1000,
      model = this.defaultModel
    } = options;

    if (MOCK_MODE) {
      const mockText = this.getMockResponse(prompt);
      // Simulate streaming by yielding chunks
      const words = mockText.split(' ');
      for (let i = 0; i < words.length; i += 5) {
        yield words.slice(i, i + 5).join(' ') + ' ';
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return;
    }

    if (!this.genAI) {
      throw new Error('Gemini API not initialized.');
    }

    try {
      const geminiModel = this.genAI.getGenerativeModel({
        model,
        generationConfig: {
          temperature,
          maxOutputTokens: maxTokens,
        }
      });

      const result = await geminiModel.generateContentStream(prompt);
      
      for await (const chunk of result.stream) {
        const text = chunk.text();
        yield text;
      }
    } catch (error) {
      console.error('Gemini streaming error:', error);
      throw new Error(`Gemini streaming error: ${error.message}`);
    }
  }

  /**
   * Start or continue a chat session
   */
  async chat(sessionId, message, history = []) {
    if (MOCK_MODE) {
      return this.getMockChatResponse(message);
    }

    if (!this.genAI) {
      throw new Error('Gemini API not initialized.');
    }

    try {
      let chatSession = this.chatSessions.get(sessionId);

      if (!chatSession) {
        const model = this.genAI.getGenerativeModel({ model: this.defaultModel });
        chatSession = model.startChat({
          history: history.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.content }]
          })),
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 1500,
          }
        });
        this.chatSessions.set(sessionId, chatSession);
      }

      const result = await chatSession.sendMessage(message);
      return result.response.text();
    } catch (error) {
      console.error('Gemini chat error:', error);
      throw new Error(`Chat error: ${error.message}`);
    }
  }

  /**
   * Analyze image with vision model
   */
  async analyzeImage(imageData, prompt = 'Describe this car in detail') {
    if (MOCK_MODE) {
      return this.getMockVisionResponse();
    }

    if (!this.genAI) {
      throw new Error('Gemini API not initialized.');
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: this.visionModel });

      const imagePart = {
        inlineData: {
          data: imageData,
          mimeType: 'image/jpeg'
        }
      };

      const result = await model.generateContent([prompt, imagePart]);
      return result.response.text();
    } catch (error) {
      console.error('Gemini vision error:', error);
      throw new Error(`Vision analysis error: ${error.message}`);
    }
  }

  /**
   * Generate car story from specifications
   */
  async generateCarStory(carData, options = {}) {
    const {
      tone = 'enthusiastic',
      length = 'medium',
      focus = 'general'
    } = options;

    const prompt = this.buildCarStoryPrompt(carData, tone, length, focus);
    return await this.generateText(prompt, { maxTokens: 1500, temperature: 0.8 });
  }

  /**
   * Compare multiple cars and generate narrative
   */
  async compareCards(cars, criteria = []) {
    const prompt = this.buildComparisonPrompt(cars, criteria);
    return await this.generateText(prompt, { maxTokens: 2000, temperature: 0.7 });
  }

  /**
   * Generate car recommendation
   */
  async recommendCar(preferences, availableCars) {
    const prompt = this.buildRecommendationPrompt(preferences, availableCars);
    return await this.generateText(prompt, { maxTokens: 1500, temperature: 0.7 });
  }

  /**
   * Explain technical specifications in simple terms
   */
  async explainSpecs(specs, audienceLevel = 'general') {
    const prompt = `Explain these car specifications in ${audienceLevel} terms that are easy to understand:\n\n${JSON.stringify(specs, null, 2)}\n\nProvide clear, engaging explanations.`;
    return await this.generateText(prompt, { maxTokens: 1000, temperature: 0.6 });
  }

  /**
   * Generate historical timeline narrative
   */
  async generateTimeline(makeOrModel, years) {
    const prompt = `Create an engaging narrative about the evolution of ${makeOrModel} from ${years.from} to ${years.to}. Include key milestones, innovations, and how the vehicle changed over time.`;
    return await this.generateText(prompt, { maxTokens: 1500, temperature: 0.7 });
  }

  // ===== PROMPT BUILDERS =====

  buildCarStoryPrompt(carData, tone, length, focus) {
    const lengthGuide = {
      short: '2-3 paragraphs',
      medium: '4-6 paragraphs',
      long: '8-10 paragraphs'
    };

    return `Write an ${tone} automotive story about this vehicle (${lengthGuide[length]}):

Vehicle: ${carData.Make} ${carData.Model}
Year: ${carData.YearFrom || ''} ${carData.YearTo ? `- ${carData.YearTo}` : ''}
Body Type: ${carData.BodyType || 'Not specified'}
Engine: ${carData.Engine?.Type || 'Not specified'} ${carData.Engine?.Capacity ? `${carData.Engine.Capacity}cc` : ''}
Power: ${carData.Engine?.Horsepower ? `${carData.Engine.Horsepower}hp` : 'Not specified'}
Max Speed: ${carData.Performance?.MaxSpeed ? `${carData.Performance.MaxSpeed} km/h` : 'Not specified'}
0-100: ${carData.Performance?.Acceleration0_100 ? `${carData.Performance.Acceleration0_100}s` : 'Not specified'}

Focus on: ${focus}

Create a compelling narrative that brings this vehicle to life. ${tone === 'technical' ? 'Include technical details and engineering insights.' : 'Make it emotional and engaging for car enthusiasts.'}`;
  }

  buildComparisonPrompt(cars, criteria) {
    const carsInfo = cars.map(car => `
${car.Make} ${car.Model} (${car.YearFrom || 'N/A'})
- Engine: ${car.Engine?.Horsepower || 'N/A'} hp, ${car.Engine?.Capacity || 'N/A'} cc
- Performance: 0-100 in ${car.Performance?.Acceleration0_100 || 'N/A'}s, Top Speed ${car.Performance?.MaxSpeed || 'N/A'} km/h
- Body: ${car.BodyType || 'N/A'}
- Drive: ${car.Transmission?.DriveWheels || 'N/A'}
`).join('\n');

    return `Compare these vehicles and provide a detailed analysis:

${carsInfo}

${criteria.length > 0 ? `Focus on: ${criteria.join(', ')}` : ''}

Provide:
1. Key differences and similarities
2. Pros and cons of each
3. Which is better for different use cases
4. Clear recommendation based on typical buyer needs

Be objective but engaging.`;
  }

  buildRecommendationPrompt(preferences, cars) {
    return `Based on these preferences:
Budget: ${preferences.budget || 'Not specified'}
Use Case: ${preferences.useCase || 'Daily driving'}
Priorities: ${preferences.priorities?.join(', ') || 'General'}
Body Type: ${preferences.bodyType || 'Any'}

Recommend the best car from these options:
${cars.map(c => `- ${c.Make} ${c.Model} (${c.YearFrom}): ${c.Engine?.Horsepower}hp, ${c.BodyType}`).join('\n')}

Provide:
1. Top 3 recommendations with reasoning
2. Why each matches the preferences
3. What trade-offs exist
4. Final verdict

Be helpful and specific.`;
  }

  // ===== MOCK RESPONSES =====

  getMockResponse(prompt) {
    const lower = prompt.toLowerCase();
    
    if (lower.includes('compare')) {
      return `After analyzing these vehicles, here's a comprehensive comparison:

**Performance Analysis:**
Each vehicle brings unique strengths to the table. The first offers outstanding acceleration and handling dynamics, perfect for spirited driving. The second provides a more balanced approach with excellent fuel efficiency without sacrificing performance.

**Key Differences:**
- Power delivery and engine characteristics vary significantly
- Handling dynamics reflect different engineering philosophies
- Interior space and comfort levels differ based on body style

**Recommendation:**
For daily driving with occasional spirited runs, the first vehicle edges ahead with its versatile nature. However, if efficiency is paramount, the second option delivers exceptional value.`;
    }

    if (lower.includes('recommend')) {
      return `Based on your preferences, here are my top recommendations:

**1. Top Choice**
This vehicle perfectly aligns with your stated priorities. Its combination of performance, efficiency, and practicality makes it an excellent all-rounder. The engine delivers smooth power across the rev range, while the chassis provides confidence-inspiring handling.

**2. Strong Alternative**
If you're willing to trade some performance for enhanced comfort, this option deserves consideration. Superior interior refinement and lower running costs make it ideal for high-mileage drivers.

**3. Budget-Friendly Pick**
Don't overlook this option if budget is a priority. While it may lack some features, it delivers solid fundamentals and proven reliability.

**Final Verdict:** The top choice offers the best balance for your needs.`;
    }

    if (lower.includes('timeline') || lower.includes('evolution') || lower.includes('history')) {
      return `The evolution of this automotive icon spans decades of innovation and refinement.

**Early Years:**
The journey began with a bold vision to create something extraordinary. Initial models established a foundation of quality and performance that would define the brand for generations.

**Golden Era:**
Through continuous development, the vehicle evolved into a true masterpiece. Engineering advancements brought improved power, efficiency, and handling. Each generation built upon its predecessor's strengths.

**Modern Evolution:**
Today's incarnation represents the culmination of decades of knowledge. Advanced technology, refined design, and exceptional performance come together in perfect harmony.

**Legacy:**
This vehicle's influence on automotive history cannot be overstated. It set benchmarks that competitors still strive to match.`;
    }

    return `This exceptional vehicle represents a perfect blend of engineering excellence and driving passion.

**Performance:**
The powertrain delivers exhilarating performance with smooth, linear power delivery. Acceleration is brisk, and the engine note provides an emotional soundtrack to every journey. Modern efficiency technology ensures you can enjoy the performance without compromise.

**Design & Engineering:**
Every element has been carefully crafted to optimize both form and function. Aerodynamic efficiency meets stunning aesthetics, while advanced materials reduce weight without sacrificing strength or safety.

**Driving Experience:**
Behind the wheel, everything comes together beautifully. The chassis communicates clearly, controls are perfectly weighted, and the overall balance inspires confidence. Whether commuting or carving canyon roads, this vehicle excels.

**Conclusion:**
This is more than transportation—it's an experience that rewards every mile driven.`;
  }

  getMockChatResponse(message) {
    const lower = message.toLowerCase();

    if (lower.includes('hello') || lower.includes('hi')) {
      return "Hello! I'm your automotive AI assistant. I can help you with car comparisons, recommendations, technical explanations, and more. What would you like to know?";
    }

    if (lower.includes('which car') || lower.includes('recommend')) {
      return "I'd be happy to recommend a vehicle! To give you the best suggestion, could you tell me about:\n- Your budget range\n- Primary use (daily commute, family, performance)\n- Must-have features\n- Body type preference";
    }

    return "That's an interesting question! Based on the current automotive landscape, there are several factors to consider. Each vehicle has unique characteristics that make it suitable for different needs. Could you provide more specific details about what aspects you're most interested in?";
  }

  getMockVisionResponse() {
    return `This vehicle showcases striking design language with athletic proportions. The body styling features flowing lines that emphasize motion even when stationary. Notable design elements include distinctive headlights, a bold grille treatment, and sculpted body panels that create visual drama.

The stance suggests a performance-oriented nature, with aggressive wheel fitment and aerodynamic enhancements. Color and finish appear to be of high quality, contributing to an premium overall appearance.

From this view, the vehicle demonstrates excellent attention to detail in both major design elements and subtle touches that elevate the overall aesthetic.`;
  }

  /**
   * Clear chat session
   */
  clearChatSession(sessionId) {
    return this.chatSessions.delete(sessionId);
  }

  /**
   * Get active sessions count
   */
  getActiveSessions() {
    return this.chatSessions.size;
  }
}

module.exports = new GeminiService();
