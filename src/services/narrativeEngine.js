const { HfInference } = require('@huggingface/inference');

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

/**
 * Generate immersive narrative for vehicle specifications
 */
exports.generateNarrative = async ({ vehicle, tone, language, chapters }) => {
  try {
    const chapterPromises = chapters.map(chapterType => 
      generateChapter(vehicle, chapterType, tone, language)
    );

    const generatedChapters = await Promise.all(chapterPromises);

    // Generate title and subtitle
    const titlePrompt = `Create a compelling marketing title for a ${vehicle.year} ${vehicle.make} ${vehicle.model}. Make it emotional and engaging. Title only:`;
    
    const titleResponse = await hf.textGeneration({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      inputs: titlePrompt,
      parameters: {
        max_new_tokens: 20,
        temperature: 0.8,
        return_full_text: false
      }
    });

    const title = titleResponse.generated_text.trim().split('\n')[0].replace(/["']/g, '');

    return {
      title,
      subtitle: `Discover the ${vehicle.year} ${vehicle.make} ${vehicle.model} through immersive technical storytelling`,
      chapters: generatedChapters
    };
  } catch (error) {
    console.error('Narrative Generation Error:', error);
    throw new Error('Failed to generate narrative');
  }
};

/**
 * Generate individual chapter based on type
 */
async function generateChapter(vehicle, chapterType, tone, language) {
  const chapterTemplates = {
    overview: {
      title: 'Meet Your Vision',
      prompt: `Write an engaging overview paragraph for the ${vehicle.year} ${vehicle.make} ${vehicle.model}. Tone: ${tone}. Focus on design philosophy and first impressions.`
    },
    performance: {
      title: 'Power & Precision',
      prompt: `Describe the performance capabilities of the ${vehicle.year} ${vehicle.make} ${vehicle.model}. Engine: ${vehicle.specifications?.engine?.horsepower || 'N/A'} HP, ${vehicle.specifications?.engine?.torque || 'N/A'} Nm torque. 0-100: ${vehicle.specifications?.performance?.acceleration_0_100 || 'N/A'}s. Make it exciting and technical. Tone: ${tone}.`
    },
    technology: {
      title: 'Innovation at Your Fingertips',
      prompt: `Explain the advanced technology features of the ${vehicle.year} ${vehicle.make} ${vehicle.model}. ADAS features: ${vehicle.specifications?.adas?.features?.join(', ') || 'standard safety systems'}. Infotainment: ${vehicle.specifications?.technology?.infotainmentSystem || 'modern system'}. Tone: ${tone}.`
    },
    safety: {
      title: 'Protection Beyond Standards',
      prompt: `Describe the safety features and philosophy of the ${vehicle.year} ${vehicle.make} ${vehicle.model}. Safety rating: ${vehicle.specifications?.safety?.rating || 'N/A'} stars. Features: ${vehicle.specifications?.safety?.features?.join(', ') || 'comprehensive safety'}. Tone: ${tone}.`
    },
    experience: {
      title: 'The Journey Awaits',
      prompt: `Paint a picture of what it's like to drive the ${vehicle.year} ${vehicle.make} ${vehicle.model}. Focus on emotions, comfort, and the overall driving experience. Tone: ${tone}.`
    },
    efficiency: {
      title: 'Sustainable Performance',
      prompt: `Explain the efficiency and environmental aspects of the ${vehicle.year} ${vehicle.make} ${vehicle.model}. Fuel consumption: ${vehicle.specifications?.efficiency?.fuelConsumption || 'N/A'}, Range: ${vehicle.specifications?.battery?.range || vehicle.specifications?.efficiency?.range || 'N/A'}km. Tone: ${tone}.`
    }
  };

  const template = chapterTemplates[chapterType] || chapterTemplates.overview;

  try {
    const response = await hf.textGeneration({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      inputs: template.prompt + '\n\nParagraph:',
      parameters: {
        max_new_tokens: 300,
        temperature: 0.7,
        top_p: 0.9,
        return_full_text: false
      }
    });

    const content = response.generated_text.trim();

    // Extract technical highlights from vehicle specs
    const technicalHighlights = extractTechnicalHighlights(vehicle, chapterType);

    return {
      title: template.title,
      content,
      order: Object.keys(chapterTemplates).indexOf(chapterType),
      technicalHighlights,
      visualType: getVisualType(chapterType)
    };
  } catch (error) {
    console.error(`Chapter generation error for ${chapterType}:`, error);
    return {
      title: template.title,
      content: `Explore the ${chapterType} features of the ${vehicle.make} ${vehicle.model}.`,
      order: 0,
      technicalHighlights: [],
      visualType: 'static'
    };
  }
}

/**
 * Extract technical highlights based on chapter type
 */
function extractTechnicalHighlights(vehicle, chapterType) {
  const highlights = [];

  switch (chapterType) {
    case 'performance':
      if (vehicle.specifications?.engine?.horsepower) {
        highlights.push({
          title: 'Horsepower',
          value: vehicle.specifications.engine.horsepower,
          unit: 'HP',
          description: 'Maximum power output'
        });
      }
      if (vehicle.specifications?.performance?.acceleration_0_100) {
        highlights.push({
          title: '0-100 km/h',
          value: vehicle.specifications.performance.acceleration_0_100,
          unit: 's',
          description: 'Acceleration time'
        });
      }
      break;

    case 'efficiency':
      if (vehicle.specifications?.efficiency?.fuelConsumption) {
        highlights.push({
          title: 'Fuel Consumption',
          value: vehicle.specifications.efficiency.fuelConsumption,
          unit: 'L/100km',
          description: 'Combined cycle'
        });
      }
      if (vehicle.specifications?.battery?.range) {
        highlights.push({
          title: 'Range',
          value: vehicle.specifications.battery.range,
          unit: 'km',
          description: 'Maximum range on full charge'
        });
      }
      break;

    case 'safety':
      if (vehicle.specifications?.safety?.rating) {
        highlights.push({
          title: 'Safety Rating',
          value: vehicle.specifications.safety.rating,
          unit: '★',
          description: 'Crash test rating'
        });
      }
      if (vehicle.specifications?.safety?.airbags) {
        highlights.push({
          title: 'Airbags',
          value: vehicle.specifications.safety.airbags,
          unit: '',
          description: 'Total airbag count'
        });
      }
      break;

    case 'technology':
      if (vehicle.specifications?.adas?.features) {
        highlights.push({
          title: 'ADAS Features',
          value: vehicle.specifications.adas.features.length,
          unit: 'systems',
          description: vehicle.specifications.adas.features.slice(0, 3).join(', ')
        });
      }
      break;
  }

  return highlights;
}

/**
 * Determine visual type for chapter
 */
function getVisualType(chapterType) {
  const visualTypes = {
    overview: '3d-exterior',
    performance: 'animated-graph',
    technology: '3d-interior',
    safety: 'infographic',
    experience: 'video',
    efficiency: 'animated-gauge'
  };

  return visualTypes[chapterType] || 'static';
}

/**
 * Generate variations of a narrative
 */
exports.generateVariations = async (originalNarrative, count = 3) => {
  const variations = [];

  const tones = ['professional', 'enthusiastic', 'technical', 'luxury', 'sporty'];

  for (let i = 0; i < Math.min(count, tones.length); i++) {
    try {
      const prompt = `Rewrite this vehicle description in a ${tones[i]} tone:\n\n${originalNarrative}\n\nRewritten version:`;
      
      const response = await hf.textGeneration({
        model: 'mistralai/Mistral-7B-Instruct-v0.2',
        inputs: prompt,
        parameters: {
          max_new_tokens: 200,
          temperature: 0.8,
          return_full_text: false
        }
      });

      variations.push({
        tone: tones[i],
        content: response.generated_text.trim()
      });
    } catch (error) {
      console.error(`Variation generation error for tone ${tones[i]}:`, error);
    }
  }

  return variations;
};
