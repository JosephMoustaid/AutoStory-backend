const mongoose = require('mongoose');

const VehicleStorySchema = new mongoose.Schema({
  // Basic Vehicle Information
  vehicleId: {
    type: String,
    required: [true, 'Please add a vehicle ID'],
    unique: true,
    trim: true
  },
  manufacturer: {
    type: String,
    required: [true, 'Please add manufacturer'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Please add model name'],
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Please add model year']
  },
  vehicleType: {
    type: String,
    enum: ['sedan', 'suv', 'truck', 'sports', 'electric', 'hybrid', 'luxury', 'compact', 'convertible'],
    required: true
  },

  // Technical Specifications (Raw Data)
  technicalData: {
    engine: {
      type: { type: String }, // e.g., "V6", "Electric", "Hybrid"
      displacement: String,
      horsepower: Number,
      torque: String,
      fuelType: String,
      transmission: String
    },
    performance: {
      acceleration0to60: Number, // seconds
      topSpeed: Number, // km/h
      fuelEconomy: {
        city: Number,
        highway: Number,
        combined: Number,
        unit: { type: String, default: 'mpg' }
      }
    },
    battery: {
      capacity: Number, // kWh
      range: Number, // km or miles
      chargingTime: String,
      fastChargingCapable: Boolean
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      wheelbase: Number,
      weight: Number,
      unit: { type: String, default: 'mm' }
    },
    safety: {
      airbags: Number,
      abs: Boolean,
      stabilityControl: Boolean,
      adaptiveCruiseControl: Boolean,
      laneKeepingAssist: Boolean,
      blindSpotMonitoring: Boolean,
      crashTestRating: Number,
      adas: [String] // Advanced Driver Assistance Systems
    },
    features: {
      infotainmentSystem: String,
      screenSize: Number,
      audioSystem: String,
      connectivity: [String], // e.g., ["Apple CarPlay", "Android Auto"]
      seatingCapacity: Number,
      trunkSpace: Number
    }
  },

  // Generated Storytelling Content
  narrative: {
    introChapter: {
      title: String,
      content: String,
      tone: { type: String, enum: ['professional', 'emotional', 'technical', 'casual'], default: 'professional' }
    },
    chapters: [{
      title: String,
      content: String,
      category: { type: String, enum: ['performance', 'safety', 'design', 'technology', 'sustainability'] },
      order: Number,
      keyPoints: [String],
      comparisons: [String] // Real-life comparisons
    }],
    summary: String,
    language: { type: String, default: 'en' }
  },

  // Media Assets
  media: {
    coverImage: String,
    images: [String],
    videos: [{
      url: String,
      title: String,
      duration: Number,
      type: { type: String, enum: ['feature-explainer', 'full-story', 'highlight'] }
    }],
    infographics: [{
      url: String,
      title: String,
      format: { type: String, enum: ['lottie', 'static', 'animated'] }
    }],
    audio: {
      narrationUrl: String,
      backgroundMusicUrl: String,
      voiceType: String
    },
    threeDModel: {
      modelUrl: String,
      textureUrls: [String],
      interactiveFeatures: [String]
    }
  },

  // Story Configuration
  storyConfig: {
    tone: { type: String, enum: ['professional', 'emotional', 'technical', 'casual'], default: 'professional' },
    targetAudience: { type: String, enum: ['buyers', 'enthusiasts', 'dealers', 'general'], default: 'buyers' },
    format: [{ type: String, enum: ['text', 'video', '3d', 'pdf', 'web'] }],
    includeComparisons: { type: Boolean, default: true },
    includeVoiceOver: { type: Boolean, default: false },
    language: { type: String, default: 'en' }
  },

  // Processing Status
  processing: {
    status: {
      type: String,
      enum: ['draft', 'parsing', 'generating-narrative', 'generating-media', 'completed', 'error'],
      default: 'draft'
    },
    progress: { type: Number, default: 0 }, // 0-100
    currentStep: String,
    errorMessage: String,
    completedSteps: [String]
  },

  // Metadata
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  isAIGenerated: {
    type: Boolean,
    default: true
  },
  sourceData: {
    type: { type: String, enum: ['json', 'csv', 'pdf', 'manual'] },
    uploadedFile: String,
    extractionMethod: String
  },
  
  // Analytics
  statistics: {
    views: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    averageRating: { type: Number, min: 0, max: 5, default: 0 },
    totalRatings: { type: Number, default: 0 }
  },

  // Export History
  exports: [{
    format: String,
    exportedAt: Date,
    fileUrl: String,
    fileSize: Number
  }],

  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create indexes
VehicleStorySchema.index({ manufacturer: 1, model: 1, year: 1 });
VehicleStorySchema.index({ vehicleType: 1 });
VehicleStorySchema.index({ 'processing.status': 1 });
VehicleStorySchema.index({ isPublic: 1 });

// Update timestamp on save
VehicleStorySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Cascade delete reviews when a vehicle story is deleted
VehicleStorySchema.pre('remove', async function(next) {
  await this.model('Review').deleteMany({ story: this._id });
  next();
});

// Virtual for full vehicle name
VehicleStorySchema.virtual('fullName').get(function() {
  return `${this.year} ${this.manufacturer} ${this.model}`;
});

// Reverse populate with virtuals
VehicleStorySchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'story',
  justOne: false
});

module.exports = mongoose.model('VehicleStory', VehicleStorySchema);
