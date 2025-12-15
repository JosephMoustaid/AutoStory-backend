/**
 * Visual Generator Service
 * Coordinates media asset generation for vehicle stories
 */

/**
 * Generate visuals for a vehicle story
 */
exports.generateVisuals = async (vehicle, story) => {
  const mediaAssets = [];

  try {
    // Generate different types of media based on story chapters
    for (const chapter of story.chapters) {
      const visualAsset = await generateChapterVisual(vehicle, chapter);
      if (visualAsset) {
        mediaAssets.push(visualAsset);
      }
    }

    // Generate overview infographic
    const overviewInfographic = generateOverviewInfographic(vehicle);
    mediaAssets.push(overviewInfographic);

    // Generate comparison charts
    const comparisonCharts = generateComparisonCharts(vehicle);
    mediaAssets.push(...comparisonCharts);

    return mediaAssets;
  } catch (error) {
    console.error('Visual Generation Error:', error);
    return [];
  }
};

/**
 * Generate visual for a specific chapter
 */
async function generateChapterVisual(vehicle, chapter) {
  const visualType = chapter.visualType || 'static';

  switch (visualType) {
    case '3d-exterior':
      return {
        type: '3d-model',
        url: `/assets/3d/placeholder-exterior.glb`,
        title: `${vehicle.make} ${vehicle.model} - Exterior View`,
        chapter: chapter.title,
        interactive: true,
        description: '360° interactive 3D model'
      };

    case '3d-interior':
      return {
        type: '3d-model',
        url: `/assets/3d/placeholder-interior.glb`,
        title: `${vehicle.make} ${vehicle.model} - Interior`,
        chapter: chapter.title,
        interactive: true,
        description: 'Explore the interior in 3D'
      };

    case 'animated-graph':
      return {
        type: 'animation',
        format: 'lottie',
        url: `/assets/animations/performance-graph.json`,
        title: 'Performance Metrics',
        chapter: chapter.title,
        data: {
          horsepower: vehicle.specifications?.engine?.horsepower || 0,
          torque: vehicle.specifications?.engine?.torque || 0,
          acceleration: vehicle.specifications?.performance?.acceleration_0_100 || 0
        },
        description: 'Animated performance visualization'
      };

    case 'animated-gauge':
      return {
        type: 'animation',
        format: 'lottie',
        url: `/assets/animations/efficiency-gauge.json`,
        title: 'Efficiency Metrics',
        chapter: chapter.title,
        data: {
          fuelConsumption: vehicle.specifications?.efficiency?.fuelConsumption || 0,
          range: vehicle.specifications?.battery?.range || 0,
          emissions: vehicle.specifications?.efficiency?.co2Emissions || 0
        },
        description: 'Animated efficiency gauge'
      };

    case 'infographic':
      return {
        type: 'infographic',
        format: 'svg',
        url: `/assets/infographics/safety-${vehicle._id}.svg`,
        title: 'Safety Features Overview',
        chapter: chapter.title,
        data: vehicle.specifications?.safety || {},
        description: 'Interactive safety feature breakdown'
      };

    case 'video':
      return {
        type: 'video',
        format: 'mp4',
        url: `/assets/videos/experience-placeholder.mp4`,
        title: 'Driving Experience',
        chapter: chapter.title,
        duration: 15,
        description: 'AI-generated experience video'
      };

    default:
      return null;
  }
}

/**
 * Generate overview infographic
 */
function generateOverviewInfographic(vehicle) {
  return {
    type: 'infographic',
    format: 'svg',
    url: `/assets/infographics/overview-${vehicle._id}.svg`,
    title: `${vehicle.make} ${vehicle.model} Overview`,
    chapter: 'Overview',
    data: {
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      type: vehicle.type,
      keySpecs: {
        horsepower: vehicle.specifications?.engine?.horsepower,
        range: vehicle.specifications?.battery?.range || vehicle.specifications?.efficiency?.range,
        topSpeed: vehicle.specifications?.performance?.topSpeed,
        safety: vehicle.specifications?.safety?.rating
      }
    },
    description: 'Complete vehicle overview infographic'
  };
}

/**
 * Generate comparison charts
 */
function generateComparisonCharts(vehicle) {
  const charts = [];

  // Performance comparison chart
  if (vehicle.specifications?.performance) {
    charts.push({
      type: 'chart',
      format: 'interactive',
      chartType: 'radar',
      title: 'Performance Profile',
      data: {
        acceleration: normalizeValue(vehicle.specifications.performance.acceleration_0_100, 0, 10, true),
        topSpeed: normalizeValue(vehicle.specifications.performance.topSpeed, 0, 300),
        handling: 85, // Placeholder
        braking: 90  // Placeholder
      },
      description: 'Performance characteristics comparison'
    });
  }

  // Efficiency comparison chart
  if (vehicle.specifications?.efficiency) {
    charts.push({
      type: 'chart',
      format: 'interactive',
      chartType: 'bar',
      title: 'Efficiency Metrics',
      data: {
        fuelEconomy: vehicle.specifications.efficiency.fuelConsumption || 0,
        emissions: vehicle.specifications.efficiency.co2Emissions || 0,
        range: vehicle.specifications.battery?.range || vehicle.specifications.efficiency.range || 0
      },
      description: 'Efficiency and environmental impact'
    });
  }

  return charts;
}

/**
 * Generate video storyboard
 */
exports.generateVideoStoryboard = async (vehicle, story) => {
  const storyboard = {
    title: story.title,
    duration: 30, // seconds
    scenes: []
  };

  // Opening scene - vehicle reveal
  storyboard.scenes.push({
    duration: 5,
    type: 'reveal',
    description: `Cinematic reveal of ${vehicle.make} ${vehicle.model}`,
    camera: 'rotating-360',
    visual: '3d-model',
    narration: story.subtitle
  });

  // Feature highlights - one per chapter
  story.chapters.slice(0, 4).forEach((chapter, index) => {
    storyboard.scenes.push({
      duration: 5,
      type: 'feature-highlight',
      title: chapter.title,
      description: chapter.content.substring(0, 100),
      visual: chapter.visualType,
      highlights: chapter.technicalHighlights.slice(0, 2),
      narration: chapter.content.substring(0, 150)
    });
  });

  // Closing scene
  storyboard.scenes.push({
    duration: 5,
    type: 'call-to-action',
    description: `${vehicle.make} ${vehicle.model} - ${story.title}`,
    visual: 'brand-logo',
    narration: 'Experience it yourself'
  });

  return storyboard;
};

/**
 * Generate interactive 3D scene configuration
 */
exports.generate3DScene = (vehicle) => {
  return {
    model: {
      url: `/assets/3d/vehicles/${vehicle._id}.glb`,
      scale: 1.0,
      position: [0, 0, 0],
      rotation: [0, 0, 0]
    },
    environment: {
      lighting: 'studio',
      background: 'gradient',
      floor: 'reflective'
    },
    camera: {
      position: [5, 2, 5],
      target: [0, 1, 0],
      fov: 45
    },
    hotspots: generateHotspots(vehicle),
    annotations: generateAnnotations(vehicle),
    controls: {
      rotate: true,
      zoom: true,
      pan: false,
      autoRotate: true,
      autoRotateSpeed: 2
    }
  };
};

/**
 * Generate interactive hotspots for 3D model
 */
function generateHotspots(vehicle) {
  const hotspots = [];

  if (vehicle.specifications?.engine) {
    hotspots.push({
      position: [1.5, 0.8, 2],
      title: 'Engine',
      description: `${vehicle.specifications.engine.horsepower} HP`,
      icon: 'engine'
    });
  }

  if (vehicle.specifications?.safety) {
    hotspots.push({
      position: [0, 1.2, 2.5],
      title: 'Safety Systems',
      description: `${vehicle.specifications.safety.rating}★ Rating`,
      icon: 'shield'
    });
  }

  if (vehicle.specifications?.adas) {
    hotspots.push({
      position: [0, 1.5, 2.2],
      title: 'ADAS Technology',
      description: `${vehicle.specifications.adas.features?.length || 0} features`,
      icon: 'radar'
    });
  }

  return hotspots;
}

/**
 * Generate technical annotations
 */
function generateAnnotations(vehicle) {
  const annotations = [];

  const specs = vehicle.specifications;

  if (specs?.dimensions) {
    annotations.push({
      type: 'dimension',
      lines: [
        { start: [-2, 0, 0], end: [2, 0, 0], label: `Length: ${specs.dimensions.length}mm` },
        { start: [0, 0, -1.5], end: [0, 0, 1.5], label: `Width: ${specs.dimensions.width}mm` },
        { start: [2, 0, 0], end: [2, 1.5, 0], label: `Height: ${specs.dimensions.height}mm` }
      ]
    });
  }

  return annotations;
}

/**
 * Normalize value for comparison charts
 */
function normalizeValue(value, min, max, invert = false) {
  if (!value) return 0;
  const normalized = ((value - min) / (max - min)) * 100;
  return invert ? 100 - normalized : normalized;
}
