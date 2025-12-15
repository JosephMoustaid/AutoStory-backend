/**
 * Data Parser Service
 * Extracts and normalizes vehicle data from various formats
 */

/**
 * Parse and normalize vehicle data
 */
exports.parseVehicleData = async (rawData) => {
  const normalized = {
    make: extractField(rawData, ['make', 'manufacturer', 'brand']),
    model: extractField(rawData, ['model', 'modelName']),
    year: extractField(rawData, ['year', 'modelYear']),
    type: extractField(rawData, ['type', 'category', 'vehicleType']) || 'sedan',
    specifications: {}
  };

  // Parse engine specifications
  normalized.specifications.engine = parseEngineSpecs(rawData);

  // Parse performance metrics
  normalized.specifications.performance = parsePerformanceSpecs(rawData);

  // Parse battery/electric specs
  normalized.specifications.battery = parseBatterySpecs(rawData);

  // Parse efficiency data
  normalized.specifications.efficiency = parseEfficiencySpecs(rawData);

  // Parse safety features
  normalized.specifications.safety = parseSafetySpecs(rawData);

  // Parse ADAS features
  normalized.specifications.adas = parseAdasSpecs(rawData);

  // Parse transmission
  normalized.specifications.transmission = parseTransmissionSpecs(rawData);

  // Parse dimensions
  normalized.specifications.dimensions = parseDimensionSpecs(rawData);

  // Parse technology features
  normalized.specifications.technology = parseTechnologySpecs(rawData);

  return normalized;
};

/**
 * Extract field with multiple possible keys
 */
function extractField(data, possibleKeys) {
  for (const key of possibleKeys) {
    if (data[key] !== undefined && data[key] !== null) {
      return data[key];
    }
  }
  return null;
}

/**
 * Parse engine specifications
 */
function parseEngineSpecs(data) {
  return {
    type: extractField(data, ['engineType', 'engine.type', 'propulsion']),
    displacement: parseNumber(extractField(data, ['displacement', 'engine.displacement', 'engineSize'])),
    cylinders: parseNumber(extractField(data, ['cylinders', 'engine.cylinders'])),
    horsepower: parseNumber(extractField(data, ['horsepower', 'hp', 'power', 'engine.horsepower'])),
    torque: parseNumber(extractField(data, ['torque', 'engine.torque'])),
    fuelType: extractField(data, ['fuelType', 'fuel', 'engine.fuel'])
  };
}

/**
 * Parse performance specifications
 */
function parsePerformanceSpecs(data) {
  return {
    acceleration_0_100: parseNumber(extractField(data, ['acceleration', '0-100', 'acceleration_0_100', 'zeroTo100'])),
    acceleration_0_60: parseNumber(extractField(data, ['0-60', 'acceleration_0_60'])),
    topSpeed: parseNumber(extractField(data, ['topSpeed', 'maxSpeed', 'vMax'])),
    quarterMile: parseNumber(extractField(data, ['quarterMile', '1_4_mile']))
  };
}

/**
 * Parse battery specifications (for EVs)
 */
function parseBatterySpecs(data) {
  return {
    capacity: parseNumber(extractField(data, ['batteryCapacity', 'battery.capacity', 'kWh'])),
    range: parseNumber(extractField(data, ['range', 'battery.range', 'electricRange'])),
    chargingTime: {
      fast: parseNumber(extractField(data, ['fastCharging', 'dcCharging', 'charging.fast'])),
      normal: parseNumber(extractField(data, ['normalCharging', 'acCharging', 'charging.normal']))
    },
    batteryType: extractField(data, ['batteryType', 'battery.type'])
  };
}

/**
 * Parse efficiency specifications
 */
function parseEfficiencySpecs(data) {
  return {
    fuelConsumption: parseNumber(extractField(data, ['fuelConsumption', 'mpg', 'l_100km', 'consumption'])),
    co2Emissions: parseNumber(extractField(data, ['co2', 'emissions', 'co2Emissions'])),
    energyConsumption: parseNumber(extractField(data, ['energyConsumption', 'kWh_100km'])),
    range: parseNumber(extractField(data, ['range', 'fuelRange', 'totalRange']))
  };
}

/**
 * Parse safety specifications
 */
function parseSafetySpecs(data) {
  const features = extractField(data, ['safetyFeatures', 'safety.features', 'safetyEquipment']) || [];
  
  return {
    rating: parseNumber(extractField(data, ['safetyRating', 'safety.rating', 'ncapRating'])),
    features: Array.isArray(features) ? features : [],
    airbags: parseNumber(extractField(data, ['airbags', 'safety.airbags'])),
    abs: extractBoolean(extractField(data, ['abs', 'safety.abs'])),
    esc: extractBoolean(extractField(data, ['esc', 'esp', 'stability']))
  };
}

/**
 * Parse ADAS specifications
 */
function parseAdasSpecs(data) {
  const features = extractField(data, ['adasFeatures', 'adas.features', 'assistanceFeatures', 'driverAssist']) || [];
  
  return {
    features: Array.isArray(features) ? features : [],
    adaptiveCruise: extractBoolean(extractField(data, ['adaptiveCruise', 'acc', 'adas.acc'])),
    laneKeeping: extractBoolean(extractField(data, ['laneKeeping', 'lka', 'adas.lka'])),
    autonomyLevel: parseNumber(extractField(data, ['autonomyLevel', 'adas.level', 'automationLevel']))
  };
}

/**
 * Parse transmission specifications
 */
function parseTransmissionSpecs(data) {
  return {
    type: extractField(data, ['transmission', 'gearbox', 'transmission.type']),
    gears: parseNumber(extractField(data, ['gears', 'speeds', 'transmission.gears'])),
    driveType: extractField(data, ['driveType', 'drivetrain', 'awd', 'fwd', 'rwd'])
  };
}

/**
 * Parse dimension specifications
 */
function parseDimensionSpecs(data) {
  return {
    length: parseNumber(extractField(data, ['length', 'dimensions.length'])),
    width: parseNumber(extractField(data, ['width', 'dimensions.width'])),
    height: parseNumber(extractField(data, ['height', 'dimensions.height'])),
    wheelbase: parseNumber(extractField(data, ['wheelbase', 'dimensions.wheelbase'])),
    weight: parseNumber(extractField(data, ['weight', 'curbWeight', 'mass'])),
    trunkCapacity: parseNumber(extractField(data, ['trunkCapacity', 'cargo', 'bootSpace']))
  };
}

/**
 * Parse technology specifications
 */
function parseTechnologySpecs(data) {
  const connectivity = extractField(data, ['connectivity', 'technology.connectivity']) || [];
  
  return {
    infotainmentSystem: extractField(data, ['infotainment', 'mediaSystem', 'technology.infotainment']),
    screenSize: parseNumber(extractField(data, ['screenSize', 'displaySize'])),
    connectivity: Array.isArray(connectivity) ? connectivity : [],
    voiceControl: extractBoolean(extractField(data, ['voiceControl', 'technology.voice'])),
    smartphoneIntegration: extractBoolean(extractField(data, ['appleCarPlay', 'androidAuto', 'smartphoneIntegration']))
  };
}

/**
 * Parse number safely
 */
function parseNumber(value) {
  if (value === null || value === undefined) return null;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? null : parsed;
}

/**
 * Parse boolean safely
 */
function extractBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    return ['true', 'yes', '1', 'enabled'].includes(value.toLowerCase());
  }
  return false;
}

/**
 * Parse PDF data (OCR)
 */
exports.parsePDFData = async (pdfBuffer) => {
  // In production, use pdf-parse and tesseract
  // For now, return placeholder
  return {
    message: 'PDF parsing coming soon',
    text: 'Extracted text would appear here'
  };
};

/**
 * Parse CSV data
 */
exports.parseCSVData = async (csvString) => {
  // In production, use csv-parser
  // For now, return placeholder
  return {
    message: 'CSV parsing coming soon',
    rows: []
  };
};
