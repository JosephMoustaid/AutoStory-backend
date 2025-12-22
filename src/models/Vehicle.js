const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  // Basic Information
  make: {
    type: String,
    required: [true, 'Please add vehicle make'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Please add vehicle model'],
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Please add vehicle year']
  },
  type: {
    type: String,
    enum: ['sedan', 'suv', 'truck', 'coupe', 'hatchback', 'convertible', 'van', 'wagon', 'electric', 'hybrid', 'sports'],
    default: 'sedan'
  },

  // Technical Specifications
  specifications: {
    // Engine
    engine: {
      type: { type: String },  // Use object notation for 'type' field
      displacement: Number,
      cylinders: Number,
      horsepower: Number,
      torque: Number,
      fuelType: String
    },

    // Performance
    performance: {
      acceleration_0_100: Number,
      acceleration_0_60: Number,
      topSpeed: Number,
      quarterMile: Number
    },

    // Battery (for EVs/Hybrids)
    battery: {
      capacity: Number,
      range: Number,
      chargingTime: {
        fast: Number,
        normal: Number
      },
      batteryType: String
    },

    // Efficiency
    efficiency: {
      fuelConsumption: Number,
      co2Emissions: Number,
      energyConsumption: Number,
      range: Number
    },

    // Safety
    safety: {
      rating: Number,
      features: [String],
      airbags: Number,
      abs: Boolean,
      esc: Boolean
    },

    // ADAS (Advanced Driver Assistance Systems)
    adas: {
      features: [String],
      adaptiveCruise: Boolean,
      laneKeeping: Boolean,
      autonomyLevel: Number
    },

    // Transmission
    transmission: {
      type: { type: String },  // Use object notation for 'type' field
      gears: Number,
      driveType: String
    },
    // Dimensions
    dimensions: {
     length: Number,
      width: Number,
      height: Number,
      wheelbase: Number,
      weight: Number,
      trunkCapacity: Number
    },

    // Technology
    technology: {
      infotainmentSystem: String,
      screenSize: Number,
      connectivity: [String],
      voiceControl: Boolean,
      smartphoneIntegration: Boolean
    }
  },

  // Metadata
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  
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

// Update timestamp on save
VehicleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Reverse populate with virtuals
VehicleSchema.virtual('stories', {
  ref: 'VehicleStory',
  localField: '_id',
  foreignField: 'vehicle',
  justOne: false
});

module.exports = mongoose.model('Vehicle', VehicleSchema);
