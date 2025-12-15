const { HfInference } = require('@huggingface/inference');
const Story = require('../models/Story');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// @desc    Generate story with AI
// @route   POST /api/v1/ai/generate
// @access  Private
exports.generateStory = asyncHandler(async (req, res, next) => {
  const { prompt, genre, length, style } = req.body;

  if (!prompt) {
    return next(new ErrorResponse('Please provide a story prompt', 400));
  }

  // Construct the AI prompt
  const fullPrompt = `Write a ${genre || 'fiction'} story (${length || 'medium'} length, around ${getLengthWords(length)} words) in a ${style || 'descriptive'} style. Story prompt: ${prompt}\n\nStory:`;

  try {
    // Generate story using Hugging Face
    const response = await hf.textGeneration({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      inputs: fullPrompt,
      parameters: {
        max_new_tokens: getMaxTokens(length),
        temperature: 0.8,
        top_p: 0.95,
        return_full_text: false
      }
    });

    const generatedContent = response.generated_text.trim();

    // Generate a title from the content
    const titlePrompt = `Generate only a short, catchy title (maximum 10 words) for this story:\n${generatedContent.substring(0, 500)}\n\nTitle:`;
    
    const titleResponse = await hf.textGeneration({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      inputs: titlePrompt,
      parameters: {
        max_new_tokens: 20,
        temperature: 0.7,
        return_full_text: false
      }
    });

    const generatedTitle = titleResponse.generated_text.trim().replace(/["']/g, '').split('\n')[0];

    // Create the story
    const story = await Story.create({
      title: generatedTitle,
      description: generatedContent.substring(0, 300) + '...',
      content: generatedContent,
      genre: genre || 'other',
      author: req.user.id,
      isAIGenerated: true,
      generationPrompt: prompt,
      status: 'draft'
    });

    // Update user statistics
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { 'statistics.storiesCreated': 1 }
    });

    res.status(201).json({
      success: true,
      data: story
    });
  } catch (error) {
    console.error('Hugging Face API Error:', error);
    return next(new ErrorResponse('Error generating story with AI. Make sure your Hugging Face API key is valid.', 500));
  }
});

// @desc    Enhance existing story with AI
// @route   POST /api/v1/ai/enhance/:storyId
// @access  Private
exports.enhanceStory = asyncHandler(async (req, res, next) => {
  const { enhancementType } = req.body; // 'improve', 'expand', 'summarize'

  const story = await Story.findById(req.params.storyId);

  if (!story) {
    return next(
      new ErrorResponse(`Story not found with id of ${req.params.storyId}`, 404)
    );
  }

  // Make sure user is story owner
  if (story.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to enhance this story`, 401)
    );
  }

  let systemPrompt = '';
  switch (enhancementType) {
    case 'improve':
      systemPrompt = 'Improve the following story by enhancing the language, adding more vivid descriptions, and improving the flow:\n\n';
      break;
    case 'expand':
      systemPrompt = 'Expand the following story by adding more details, character development, and plot elements:\n\n';
      break;
    case 'summarize':
      systemPrompt = 'Create a concise summary of the following story:\n\n';
      break;
    default:
      return next(new ErrorResponse('Invalid enhancement type', 400));
  }

  try {
    const response = await hf.textGeneration({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      inputs: systemPrompt + story.content,
      parameters: {
        max_new_tokens: enhancementType === 'summarize' ? 500 : 2000,
        temperature: 0.7,
        top_p: 0.95,
        return_full_text: false
      }
    });

    const enhancedContent = response.generated_text.trim();

    res.status(200).json({
      success: true,
      data: {
        original: story.content,
        enhanced: enhancedContent
      }
    });
  } catch (error) {
    console.error('Hugging Face API Error:', error);
    return next(new ErrorResponse('Error enhancing story with AI. Make sure your Hugging Face API key is valid.', 500));
  }
});

// @desc    Generate story ideas
// @route   POST /api/v1/ai/ideas
// @access  Private
exports.generateIdeas = asyncHandler(async (req, res, next) => {
  const { genre, theme, count = 5 } = req.body;

  const prompt = `Generate ${count} creative story ideas for ${genre || 'any'} genre${theme ? ` with the theme of ${theme}` : ''}. For each idea, provide a title and a brief one-sentence description. Format as a numbered list.\n\nIdeas:`;

  try {
    const response = await hf.textGeneration({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      inputs: prompt,
      parameters: {
        max_new_tokens: 1000,
        temperature: 0.9,
        top_p: 0.95,
        return_full_text: false
      }
    });

    const ideas = response.generated_text.trim();

    res.status(200).json({
      success: true,
      data: { ideas }
    });
  } catch (error) {
    console.error('Hugging Face API Error:', error);
    return next(new ErrorResponse('Error generating story ideas. Make sure your Hugging Face API key is valid.', 500));
  }
});

// Helper functions
function getLengthWords(length) {
  const lengths = {
    short: 500,
    medium: 1000,
    long: 2000
  };
  return lengths[length] || 1000;
}

function getMaxTokens(length) {
  const tokens = {
    short: 750,
    medium: 1500,
    long: 3000
  };
  return tokens[length] || 1500;
}

module.exports = exports;
