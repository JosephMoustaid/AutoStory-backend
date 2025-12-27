const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

class CarDatasetService {
  constructor() {
    this.cars = [];
    this.loaded = false;
    this.datasetPath = path.join(__dirname, '../../datasets/Car Dataset 1945-2020.csv');
  }

  /**
   * Load and parse the car dataset from CSV
   * @returns {Promise<void>}
   */
  async loadDataset() {
    if (this.loaded) return;

    return new Promise((resolve, reject) => {
      const cars = [];

      fs.createReadStream(this.datasetPath)
        .pipe(csv())
        .on('data', (row) => {
          // Clean and normalize data
          const car = this.normalizeCarData(row);
          if (car.Make && car.Model) { // Check if essential fields exist
            cars.push(car);
          }
        })
        .on('end', () => {
          this.cars = cars;
          this.loaded = true;
          console.log(`✅ Loaded ${this.cars.length} cars from dataset`);
          resolve();
        })
        .on('error', (error) => {
          console.error('❌ Error loading dataset:', error);
          reject(error);
        });
    });
  }

  /**
   * Normalize car data from CSV row
   * @param {Object} row - Raw CSV row
   * @returns {Object} - Normalized car object
   */
  normalizeCarData(row) {
    const parseNumber = (val) => {
      if (!val || val === '') return null;
      const num = parseFloat(val);
      return isNaN(num) ? null : num;
    };

    const parseInt = (val) => {
      if (!val || val === '') return null;
      const num = Number(val);
      return isNaN(num) ? null : Math.floor(num);
    };

    return {
      id: row.id_trim,
      Make: row.Make?.trim(),
      Model: row.Modle?.trim(), // Note: CSV has typo "Modle"
      Generation: row.Generation?.trim(),
      YearFrom: parseInt(row.Year_from),
      YearTo: parseInt(row.Year_to),
      Series: row.Series?.trim(),
      Trim: row.Trim?.trim(),
      BodyType: row.Body_type?.trim(),
      NumberOfSeats: parseInt(row.number_of_seats),
      NumberOfDoors: parseInt(row.number_of_doors),
      
      // Dimensions
      Dimensions: {
        Length: parseNumber(row.length_mm),
        Width: parseNumber(row.width_mm),
        Height: parseNumber(row.height_mm),
        Wheelbase: parseNumber(row.wheelbase_mm),
        FrontTrack: parseNumber(row.front_track_mm),
        RearTrack: parseNumber(row.rear_track_mm),
        GroundClearance: parseNumber(row.ground_clearance_mm),
      },

      // Weight
      Weight: {
        Curb: parseNumber(row.curb_weight_kg),
        Full: parseNumber(row.full_weight_kg),
        Payload: parseNumber(row.payload_kg),
      },

      // Engine
      Engine: {
        Type: row.engine_type?.trim(),
        Capacity: parseNumber(row.capacity_cm3),
        Horsepower: parseNumber(row.engine_hp),
        HorsepowerRPM: parseNumber(row.engine_hp_rpm),
        MaxPower: parseNumber(row.max_power_kw),
        MaxTorque: parseNumber(row.maximum_torque_n_m),
        TorqueRPM: parseNumber(row.turnover_of_maximum_torque_rpm),
        Cylinders: parseInt(row.number_of_cylinders),
        CylinderLayout: row.cylinder_layout?.trim(),
        ValvesPerCylinder: parseInt(row.valves_per_cylinder),
        CompressionRatio: parseNumber(row.compression_ratio),
        CylinderBore: parseNumber(row.cylinder_bore_mm),
        StrokeCycle: parseNumber(row.stroke_cycle_mm),
        InjectionType: row.injection_type?.trim(),
        BoostType: row.boost_type?.trim(),
        FuelType: row.engine_type?.trim(),
      },

      // Performance
      Performance: {
        Acceleration0_100: parseNumber(row['acceleration_0_100_km/h_s']),
        MaxSpeed: parseNumber(row.max_speed_km_per_h),
        MixedFuelConsumption: parseNumber(row.mixed_fuel_consumption_per_100_km_l),
        CityFuelConsumption: parseNumber(row.city_fuel_per_100km_l),
        HighwayFuelConsumption: parseNumber(row.highway_fuel_per_100km_l),
        CO2Emissions: parseNumber(row.CO2_emissions_g_km),
        FuelGrade: row.fuel_grade?.trim(),
        FuelTankCapacity: parseNumber(row.fuel_tank_capacity_l),
        Range: parseNumber(row.range_km),
      },

      // Transmission
      Transmission: {
        Type: row.transmission?.trim(),
        Gears: parseInt(row.number_of_gears),
        DriveWheels: row.drive_wheels?.trim(),
      },

      // Chassis
      Chassis: {
        FrontSuspension: row.front_suspension?.trim(),
        RearSuspension: row.back_suspension?.trim(),
        FrontBrakes: row.front_brakes?.trim(),
        RearBrakes: row.rear_brakes?.trim(),
        SteeringType: row.steering_type?.trim(),
      },

      // Cargo
      Cargo: {
        MinTrunkCapacity: parseNumber(row.minimum_trunk_capacity_l),
        MaxTrunkCapacity: parseNumber(row.max_trunk_capacity_l),
        CargoVolume: parseNumber(row.cargo_volume_m3),
      },

      // Additional
      CarClass: row.car_class?.trim(),
      CountryOfOrigin: row.country_of_origin?.trim(),
      SafetyRating: row.safety_assessment?.trim(),
      EmissionStandards: row.emission_standards?.trim(),
      TurningCircle: parseNumber(row.turning_circle_m),
      
      // Electric vehicle data
      Electric: {
        BatteryCapacity: parseNumber(row.battery_capacity_KW_per_h),
        ElectricRange: parseNumber(row.electric_range_km),
        ChargingTime: parseNumber(row.charging_time_h),
      },
    };
  }

  /**
   * Search cars with advanced filters
   * @param {Object} filters - Search filters
   * @returns {Array} - Filtered cars
   */
  search(filters = {}) {
    let results = [...this.cars];

    // Text search across multiple fields
    if (filters.query) {
      const query = filters.query.toLowerCase();
      results = results.filter(car => 
        car.Make?.toLowerCase().includes(query) ||
        car.Model?.toLowerCase().includes(query) ||
        car.Series?.toLowerCase().includes(query) ||
        car.BodyType?.toLowerCase().includes(query)
      );
    }

    // Make filter
    if (filters.make) {
      results = results.filter(car => 
        car.Make?.toLowerCase() === filters.make.toLowerCase()
      );
    }

    // Model filter
    if (filters.model) {
      results = results.filter(car => 
        car.Model?.toLowerCase().includes(filters.model.toLowerCase())
      );
    }

    // Year range
    if (filters.yearFrom) {
      results = results.filter(car => 
        car.YearFrom && car.YearFrom >= parseInt(filters.yearFrom)
      );
    }
    if (filters.yearTo) {
      results = results.filter(car => 
        car.YearTo && car.YearTo <= parseInt(filters.yearTo)
      );
    }

    // Body type
    if (filters.bodyType) {
      results = results.filter(car => 
        car.BodyType?.toLowerCase() === filters.bodyType.toLowerCase()
      );
    }

    // Engine type
    if (filters.engineType) {
      results = results.filter(car => 
        car.Engine?.Type?.toLowerCase().includes(filters.engineType.toLowerCase())
      );
    }

    // Horsepower range
    if (filters.minHorsepower) {
      results = results.filter(car => 
        car.Engine?.Horsepower && car.Engine.Horsepower >= parseFloat(filters.minHorsepower)
      );
    }
    if (filters.maxHorsepower) {
      results = results.filter(car => 
        car.Engine?.Horsepower && car.Engine.Horsepower <= parseFloat(filters.maxHorsepower)
      );
    }

    // Country of origin
    if (filters.country) {
      results = results.filter(car => 
        car.CountryOfOrigin?.toLowerCase() === filters.country.toLowerCase()
      );
    }

    // Drive wheels
    if (filters.driveWheels) {
      results = results.filter(car => 
        car.Transmission?.DriveWheels?.toLowerCase().includes(filters.driveWheels.toLowerCase())
      );
    }

    // Sorting
    if (filters.sortBy) {
      results = this.sortResults(results, filters.sortBy, filters.sortOrder);
    }

    // Pagination
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 50;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
      data: results.slice(startIndex, endIndex),
      pagination: {
        total: results.length,
        page,
        limit,
        pages: Math.ceil(results.length / limit)
      }
    };
  }

  /**
   * Sort results by field
   */
  sortResults(results, sortBy, sortOrder = 'asc') {
    return results.sort((a, b) => {
      let aVal, bVal;

      switch (sortBy) {
        case 'year':
          aVal = a.YearFrom || 0;
          bVal = b.YearFrom || 0;
          break;
        case 'horsepower':
          aVal = a.Engine?.Horsepower || 0;
          bVal = b.Engine?.Horsepower || 0;
          break;
        case 'speed':
          aVal = a.Performance?.MaxSpeed || 0;
          bVal = b.Performance?.MaxSpeed || 0;
          break;
        case 'make':
          aVal = a.Make || '';
          bVal = b.Make || '';
          break;
        default:
          return 0;
      }

      if (sortOrder === 'desc') {
        return bVal > aVal ? 1 : -1;
      }
      return aVal > bVal ? 1 : -1;
    });
  }

  /**
   * Get analytics and statistics
   */
  getAnalytics() {
    const makes = new Set(this.cars.map(c => c.Make).filter(Boolean));
    const countries = new Set(this.cars.map(c => c.CountryOfOrigin).filter(Boolean));
    const bodyTypes = new Set(this.cars.map(c => c.BodyType).filter(Boolean));

    // Calculate averages
    const carsWithHP = this.cars.filter(c => c.Engine?.Horsepower);
    const avgHorsepower = carsWithHP.length > 0
      ? carsWithHP.reduce((sum, c) => sum + c.Engine.Horsepower, 0) / carsWithHP.length
      : 0;

    return {
      totalCars: this.cars.length,
      totalMakes: makes.size,
      totalCountries: countries.size,
      totalBodyTypes: bodyTypes.size,
      yearRange: {
        from: Math.min(...this.cars.map(c => c.YearFrom).filter(Boolean)),
        to: Math.max(...this.cars.map(c => c.YearTo).filter(Boolean))
      },
      averageHorsepower: Math.round(avgHorsepower),
      makes: Array.from(makes).sort(),
      countries: Array.from(countries).sort(),
      bodyTypes: Array.from(bodyTypes).sort()
    };
  }

  /**
   * Get top cars by criteria
   */
  getTopCars(criteria = 'horsepower', limit = 10) {
    let sorted = [...this.cars];

    switch (criteria) {
      case 'horsepower':
        sorted = sorted.filter(c => c.Engine?.Horsepower)
          .sort((a, b) => b.Engine.Horsepower - a.Engine.Horsepower);
        break;
      case 'speed':
        sorted = sorted.filter(c => c.Performance?.MaxSpeed)
          .sort((a, b) => b.Performance.MaxSpeed - a.Performance.MaxSpeed);
        break;
      case 'acceleration':
        sorted = sorted.filter(c => c.Performance?.Acceleration0_100)
          .sort((a, b) => a.Performance.Acceleration0_100 - b.Performance.Acceleration0_100);
        break;
      case 'efficient':
        sorted = sorted.filter(c => c.Performance?.MixedFuelConsumption)
          .sort((a, b) => a.Performance.MixedFuelConsumption - b.Performance.MixedFuelConsumption);
        break;
    }

    return sorted.slice(0, limit);
  }

  /**
   * Get cars by decade with statistics
   */
  getCarsByDecade() {
    const decades = {};

    this.cars.forEach(car => {
      if (!car.YearFrom) return;
      
      const decade = Math.floor(car.YearFrom / 10) * 10;
      if (!decades[decade]) {
        decades[decade] = {
          decade,
          count: 0,
          makes: new Set(),
          avgHorsepower: [],
          avgSpeed: [],
          bodyTypes: new Set()
        };
      }

      decades[decade].count++;
      decades[decade].makes.add(car.Make);
      if (car.BodyType) decades[decade].bodyTypes.add(car.BodyType);
      if (car.Engine?.Horsepower) decades[decade].avgHorsepower.push(car.Engine.Horsepower);
      if (car.Performance?.MaxSpeed) decades[decade].avgSpeed.push(car.Performance.MaxSpeed);
    });

    // Calculate averages
    return Object.values(decades).map(d => ({
      decade: d.decade,
      count: d.count,
      makes: d.makes.size,
      avgHorsepower: d.avgHorsepower.length > 0
        ? Math.round(d.avgHorsepower.reduce((a, b) => a + b, 0) / d.avgHorsepower.length)
        : null,
      avgMaxSpeed: d.avgSpeed.length > 0
        ? Math.round(d.avgSpeed.reduce((a, b) => a + b, 0) / d.avgSpeed.length)
        : null,
      bodyTypes: Array.from(d.bodyTypes)
    })).sort((a, b) => a.decade - b.decade);
  }

  /**
   * Get make statistics
   */
  getMakeStatistics(make) {
    const makeCars = this.cars.filter(c => 
      c.Make?.toLowerCase() === make.toLowerCase()
    );

    if (makeCars.length === 0) return null;

    const carsWithHP = makeCars.filter(c => c.Engine?.Horsepower);
    const carsWithSpeed = makeCars.filter(c => c.Performance?.MaxSpeed);

    return {
      make,
      totalModels: makeCars.length,
      yearRange: {
        from: Math.min(...makeCars.map(c => c.YearFrom).filter(Boolean)),
        to: Math.max(...makeCars.map(c => c.YearTo).filter(Boolean))
      },
      models: [...new Set(makeCars.map(c => c.Model))],
      bodyTypes: [...new Set(makeCars.map(c => c.BodyType).filter(Boolean))],
      avgHorsepower: carsWithHP.length > 0
        ? Math.round(carsWithHP.reduce((sum, c) => sum + c.Engine.Horsepower, 0) / carsWithHP.length)
        : null,
      avgMaxSpeed: carsWithSpeed.length > 0
        ? Math.round(carsWithSpeed.reduce((sum, c) => sum + c.Performance.MaxSpeed, 0) / carsWithSpeed.length)
        : null,
      mostPowerful: makeCars
        .filter(c => c.Engine?.Horsepower)
        .sort((a, b) => b.Engine.Horsepower - a.Engine.Horsepower)[0]
    };
  }

  /**
   * Get car by ID
   */
  getById(id) {
    return this.cars.find(c => c.id === id);
  }

  /**
   * Get random cars
   */
  getRandomCars(count = 5) {
    const shuffled = [...this.cars].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}

// Export singleton instance
const carDatasetService = new CarDatasetService();
module.exports = carDatasetService;
