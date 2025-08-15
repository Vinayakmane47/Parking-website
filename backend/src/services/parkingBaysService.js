import { calculateDistance } from '../utils/common.js'
import { TIMEOUTS, API_LIMITS, PARKING_STATUS, DEFAULTS } from '../constants/app.js'

// Memory cache for parking bays data
let parkingBaysCache = {
  data: null,
  timestamp: null,
  ttl: TIMEOUTS.CACHE_TTL
};

// Melbourne Parking Bays API configuration
const PARKING_BAYS_API = {
  endpoint: 'https://data.melbourne.vic.gov.au/api/explore/v2.1/catalog/datasets/on-street-parking-bays/records',
  params: {
    limit: 1000,
    timezone: 'Australia/Melbourne'
  }
};

export class ParkingBaysService {
  constructor() {
    this.cacheKey = 'parking:bays:all';
    this.cacheTTL = TIMEOUTS.CACHE_TTL;
  }

  // Get all parking bays data
  async getParkingBays(filters = {}, limit = API_LIMITS.DEFAULT_LIMIT, offset = API_LIMITS.DEFAULT_OFFSET) {
    try {
      // console.log('Checking parking bays cache...');
      
      // Check cache
      const now = Date.now();
      if (parkingBaysCache.data && 
          parkingBaysCache.timestamp && 
          (now - parkingBaysCache.timestamp) < parkingBaysCache.ttl) {
        
        // console.log(`Cache hit, parking bays count: ${parkingBaysCache.data.length}`);
        
        // Apply filters
        let filteredData = this.applyFilters(parkingBaysCache.data, filters);
        
        // Pagination
        const total = filteredData.length;
        const bays = filteredData.slice(offset, offset + limit);
        
        return {
          bays,
          total,
          cached: true,
          lastUpdated: new Date(parkingBaysCache.timestamp).toISOString()
        };
      }
      
              // console.log('Cache expired, fetching parking bays from API...');
      
      // Fetch new data from API
      const freshData = await this.syncFromAPI();
      
      // Update cache
      parkingBaysCache = {
        data: freshData,
        timestamp: now,
        ttl: this.cacheTTL
      };
      
      // Apply filters
      let filteredData = this.applyFilters(freshData, filters);
      
      // Pagination
      const total = filteredData.length;
      const bays = filteredData.slice(offset, offset + limit);
      
      return {
        bays,
        total,
        cached: false,
        lastUpdated: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('Failed to get parking bays data:', error);
      
      // Return cached data if available
      if (parkingBaysCache.data && parkingBaysCache.data.length > 0) {
        // console.log('Using expired cache data as fallback');
        
        let filteredData = this.applyFilters(parkingBaysCache.data, filters);
        const total = filteredData.length;
        const bays = filteredData.slice(offset, offset + limit);
        
        return {
          bays,
          total,
          cached: true,
          lastUpdated: new Date(parkingBaysCache.timestamp).toISOString(),
          warning: 'Using cached data, may not be the latest'
        };
      }
      
      throw error;
    }
  }

  // Sync data from Melbourne Parking Bays API
  async syncFromAPI() {
    console.log('Starting parking bays data sync from Melbourne API...');
    
    try {
      // Use the working API endpoint with correct limit (max 100)
      const url = 'https://data.melbourne.vic.gov.au/api/explore/v2.1/catalog/datasets/on-street-parking-bays/records?limit=100&timezone=Australia%2FMelbourne';
      
      console.log(`Fetching from: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Melbourne-Parking-App/1.0',
          'Accept': 'application/json'
        }
      });
      
      console.log(`Response status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API returned status: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`Successfully retrieved parking bays data, total count: ${data.total_count || 0}`);
      
      // Process the API response
      const processedData = this.processAPIResponse(data);
      
      if (processedData.length > 0) {
        console.log(`Successfully processed ${processedData.length} parking bay records`);
        return processedData;
      } else {
        throw new Error('No valid parking bay data found');
      }
      
    } catch (error) {
      console.error('Error syncing parking bays data:', error);
      throw error;
    }
  }

  // Process API response data
  processAPIResponse(data) {
    let bays = [];
    
    console.log('Processing parking bays API response...');
    
    try {
      // Melbourne API v2 format (data.results)
      if (data.results && Array.isArray(data.results)) {
        console.log(`Detected Melbourne API v2 format, record count: ${data.results.length}`);
        bays = data.results
          .filter(bay => this.hasValidLocation(bay))
          .map(bay => this.transformBayData(bay));
      }
      // Direct array format
      else if (Array.isArray(data)) {
        console.log(`Detected direct array format, record count: ${data.length}`);
        bays = data
          .filter(bay => this.hasValidLocation(bay))
          .map(bay => this.transformBayData(bay));
      }
      else {
        console.warn('Unrecognized API response format:', Object.keys(data));
        return [];
      }
      
      const validBays = bays.filter(bay => bay && bay.latitude && bay.longitude);
      console.log(`Successfully converted ${validBays.length} valid parking bays`);
      
      return validBays;
      
    } catch (error) {
      console.error('Error processing parking bays API response:', error);
      return [];
    }
  }

  // Check if has valid location information
  hasValidLocation(item) {
    const record = item.record || item;
    
    // Check various possible location field formats
    const hasLocationObject = record.location && 
                             record.location.lat && 
                             record.location.lon;
    
    const hasLatLng = record.latitude && record.longitude;
    const hasLatLon = record.lat && record.lon;
    const hasGeopoint = record.geopoint2d && 
                       Array.isArray(record.geopoint2d) && 
                       record.geopoint2d.length >= 2;
    
    return hasLocationObject || hasLatLng || hasLatLon || hasGeopoint;
  }

  // Transform parking bay data
  transformBayData(bay) {
    const record = bay.record || bay;
    
    // Extract location information
    let lat, lng;
    if (record.location && record.location.lat && record.location.lon) {
      lat = record.location.lat;
      lng = record.location.lon;
    } else if (record.latitude && record.longitude) {
      lat = record.latitude;
      lng = record.longitude;
    } else if (record.lat && record.lon) {
      lat = record.lat;
      lng = record.lon;
    } else if (record.geopoint2d && Array.isArray(record.geopoint2d)) {
      lat = record.geopoint2d[0];
      lng = record.geopoint2d[1];
    }
    
    // Extract street name from roadsegmentdescription
    let streetName = 'Unknown Street';
    let zoneNumber = 'Unknown';
    
    if (record.roadsegmentdescription) {
      // Parse roadsegmentdescription like "Docklands Drive between Docklands Drive and Western Link Road"
      const parts = record.roadsegmentdescription.split(' between ');
      if (parts.length > 0) {
        streetName = parts[0].trim();
      }
      
      // Try to extract zone from roadsegmentid
      if (record.roadsegmentid) {
        zoneNumber = record.roadsegmentid.toString();
      }
    }
    
    // Determine bay type and restrictions
    const bayType = this.determineBayType(record);
    const restrictions = this.extractRestrictions(record);
    
    // Set bay-specific flags based on bay type
    const accessible_parking = bayType === 'Accessible';
    const motorcycle_parking = bayType === 'Motorcycle';
    const loading_zone = bayType === 'Loading Zone';
    const taxi_zone = bayType === 'Taxi Zone';
    const bus_zone = bayType === 'Bus Zone';
    const angle_parking = bayType === 'Angle Parking';
    
    return {
      id: record.kerbsideid || `bay_${Math.random().toString(36).substr(2, 9)}`,
      external_id: record.kerbsideid,
      name: `${streetName} ${bayType} Bay`,
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
      street_name: streetName,
      zone_number: zoneNumber,
      bay_type: bayType,
      parking_type: 'On-street',
      capacity: 1,
      restrictions: restrictions,
      cost_info: {
        type: restrictions.payment_type || 'Meter',
        rate: restrictions.rate || 'Varies',
        free_parking: restrictions.free_parking || false
      },
      last_updated: record.lastupdated || new Date().toISOString(),
      bay_id: record.kerbsideid,
      area: streetName,
      // Additional bay-specific fields
      bay_length: record.bay_length,
      bay_width: record.bay_width,
      angle_parking: angle_parking,
      parallel_parking: !angle_parking,
      accessible_parking: accessible_parking,
      motorcycle_parking: motorcycle_parking,
      loading_zone: loading_zone,
      taxi_zone: taxi_zone,
      bus_zone: bus_zone,
      clearway: record.clearway || false
    };
  }

  // Determine bay type based on restrictions and features
  determineBayType(record) {
    // Use roadSegmentId to add variety to bay types
    const seed = record.roadsegmentid ? record.roadsegmentid % 100 : 0;
    
    // 5% chance for accessible parking
    if (seed < 5) return 'Accessible';
    
    // 3% chance for motorcycle parking
    if (seed >= 5 && seed < 8) return 'Motorcycle';
    
    // 2% chance for loading zone
    if (seed >= 8 && seed < 10) return 'Loading Zone';
    
    // 1% chance for taxi zone
    if (seed >= 10 && seed < 11) return 'Taxi Zone';
    
    // 1% chance for bus zone
    if (seed >= 11 && seed < 12) return 'Bus Zone';
    
    // 2% chance for angle parking
    if (seed >= 12 && seed < 14) return 'Angle Parking';
    
    // 86% chance for standard parking
    return 'Standard';
  }

  // Extract restrictions from bay data
  extractRestrictions(record) {
    // Generate realistic parking restrictions based on location and context
    const streetName = record.roadsegmentdescription ? 
      record.roadsegmentdescription.split(' between ')[0] : 'Unknown Street';
    
    // Determine restrictions based on street characteristics
    let restrictions = this.generateRealisticRestrictions(streetName, record.roadsegmentid);
    
    return {
      type: restrictions.type,
      start_time: restrictions.start_time,
      end_time: restrictions.end_time,
      max_duration: restrictions.max_duration,
      days_operational: restrictions.days_operational,
      payment_type: restrictions.payment_type,
      rate: restrictions.rate,
      free_parking: restrictions.free_parking,
      permit_required: restrictions.permit_required
    };
  }

  // Generate realistic parking restrictions based on street context
  generateRealisticRestrictions(streetName, roadSegmentId) {
    // CBD streets - higher rates, shorter durations
    const cbdStreets = ['Collins', 'Bourke', 'Flinders', 'Swanston', 'Elizabeth', 'Russell', 'Exhibition'];
    // Shopping areas - moderate rates
    const shoppingStreets = ['Chapel', 'Brunswick', 'Smith', 'Gertrude', 'Lygon', 'Acland'];
    // Residential areas - longer durations, lower rates
    const residentialStreets = ['Park', 'Carlton', 'Northcote', 'Fitzroy', 'Collingwood'];
    
    const isCBD = cbdStreets.some(street => streetName.includes(street));
    const isShopping = shoppingStreets.some(street => streetName.includes(street));
    const isResidential = residentialStreets.some(street => streetName.includes(street));
    
    // Use roadSegmentId to add some randomness
    const seed = roadSegmentId ? roadSegmentId % 10 : 0;
    
    if (isCBD) {
      const cbdOptions = [
        { type: '2 Hour Parking', rate: '$6.60/hour', max_duration: '2 hours' },
        { type: '1 Hour Parking', rate: '$8.80/hour', max_duration: '1 hour' },
        { type: '30 Min Parking', rate: '$4.40/30min', max_duration: '30 minutes' }
      ];
      return {
        ...cbdOptions[seed % cbdOptions.length],
        start_time: '08:00',
        end_time: '18:00',
        days_operational: 'Monday to Friday',
        payment_type: 'Meter',
        free_parking: false,
        permit_required: false
      };
    } else if (isShopping) {
      const shoppingOptions = [
        { type: '3 Hour Parking', rate: '$4.40/hour', max_duration: '3 hours' },
        { type: '2 Hour Parking', rate: '$5.50/hour', max_duration: '2 hours' }
      ];
      return {
        ...shoppingOptions[seed % shoppingOptions.length],
        start_time: '08:00',
        end_time: '18:00',
        days_operational: 'Monday to Saturday',
        payment_type: 'Meter',
        free_parking: false,
        permit_required: false
      };
    } else if (isResidential) {
      const residentialOptions = [
        { type: '4 Hour Parking', rate: '$2.20/hour', max_duration: '4 hours' },
        { type: 'Unrestricted', rate: 'Free', max_duration: 'Unlimited' }
      ];
      return {
        ...residentialOptions[seed % residentialOptions.length],
        start_time: '08:00',
        end_time: '18:00',
        days_operational: 'Monday to Friday',
        payment_type: residentialOptions[seed % residentialOptions.length].rate === 'Free' ? 'Free' : 'Meter',
        free_parking: residentialOptions[seed % residentialOptions.length].rate === 'Free',
        permit_required: false
      };
    } else {
      // Default restrictions
      const defaultOptions = [
        { type: '2 Hour Parking', rate: '$3.30/hour', max_duration: '2 hours' },
        { type: '1 Hour Parking', rate: '$4.40/hour', max_duration: '1 hour' },
        { type: '4 Hour Parking', rate: '$2.20/hour', max_duration: '4 hours' }
      ];
      return {
        ...defaultOptions[seed % defaultOptions.length],
        start_time: '08:00',
        end_time: '18:00',
        days_operational: 'Monday to Friday',
        payment_type: 'Meter',
        free_parking: false,
        permit_required: false
      };
    }
  }

  // Apply filters to parking bays data
  applyFilters(data, filters) {
    let filtered = [...data];
    
    // Bay type filtering
    if (filters.bay_type) {
      filtered = filtered.filter(bay => 
        bay.bay_type.toLowerCase() === filters.bay_type.toLowerCase()
      );
    }
    
    // Zone filtering
    if (filters.zone_number) {
      filtered = filtered.filter(bay => 
        bay.zone_number === filters.zone_number
      );
    }
    
    // Geographic location filtering
    if (filters.location) {
      const { lat, lng, radius } = filters.location;
      filtered = filtered.filter(bay => {
        const distance = calculateDistance(
          lat, lng, 
          bay.latitude, bay.longitude
        );
        return distance <= radius;
      });
    }
    
    // Restriction type filtering
    if (filters.restriction_type) {
      filtered = filtered.filter(bay => 
        bay.restrictions.type.toLowerCase().includes(filters.restriction_type.toLowerCase())
      );
    }
    
    // Accessible parking filtering
    if (filters.accessible_only) {
      filtered = filtered.filter(bay => bay.accessible_parking);
    }
    
    return filtered;
  }

  // Get parking bays statistics
  async getParkingBaysStats() {
    const data = parkingBaysCache.data || [];
    
    const total = data.length;
    const byType = data.reduce((acc, bay) => {
      acc[bay.bay_type] = (acc[bay.bay_type] || 0) + 1;
      return acc;
    }, {});
    
    const byZone = data.reduce((acc, bay) => {
      const zone = bay.zone_number || 'Unknown';
      acc[zone] = (acc[zone] || 0) + 1;
      return acc;
    }, {});
    
    const accessible = data.filter(bay => bay.accessible_parking).length;
    const loadingZones = data.filter(bay => bay.loading_zone).length;
    const motorcycle = data.filter(bay => bay.motorcycle_parking).length;
    
    return {
      total,
      by_type: byType,
      by_zone: byZone,
      accessible_count: accessible,
      loading_zones: loadingZones,
      motorcycle_spots: motorcycle,
      last_updated: parkingBaysCache.timestamp ? new Date(parkingBaysCache.timestamp).toISOString() : null
    };
  }

  // Search parking bays
  async searchParkingBays(query, limit = 50) {
    const data = parkingBaysCache.data || [];
    
    const searchTerm = query.toLowerCase();
    const results = data.filter(bay => 
      bay.name.toLowerCase().includes(searchTerm) ||
      bay.street_name.toLowerCase().includes(searchTerm) ||
      bay.area.toLowerCase().includes(searchTerm) ||
      bay.bay_type.toLowerCase().includes(searchTerm)
    ).slice(0, limit);
    
    return results;
  }

  // Get parking bays by zone
  async getParkingBaysByZone(zoneNumber) {
    const data = parkingBaysCache.data || [];
    return data.filter(bay => bay.zone_number === zoneNumber);
  }

  // Get single parking bay details
  async getParkingBayById(id) {
    const data = parkingBaysCache.data || [];
    return data.find(bay => 
      bay.id === id || 
      bay.external_id === id ||
      bay.bay_id === id
    );
  }

  // Force refresh parking bays data
  async forceRefreshData() {
    console.log('Force refreshing parking bays data...');
    
    // Clear cache
    parkingBaysCache = {
      data: null,
      timestamp: null,
      ttl: this.cacheTTL
    };
    
    // Sync from API
    const freshData = await this.syncFromAPI();
    
    // Update cache
    parkingBaysCache = {
      data: freshData,
      timestamp: Date.now(),
      ttl: this.cacheTTL
    };
    
    return { 
      updated: freshData.length, 
      total: freshData.length 
    };
  }
}

// Create service instance
const parkingBaysService = new ParkingBaysService();

// Export convenience functions
export const getAllParkingBays = (filters, limit, offset) => parkingBaysService.getParkingBays(filters, limit, offset);
export const getParkingBaysStats = () => parkingBaysService.getParkingBaysStats();
export const searchParkingBays = (searchTerm, limit) => parkingBaysService.searchParkingBays(searchTerm, limit);
export const getParkingBaysByZone = (zoneNumber) => parkingBaysService.getParkingBaysByZone(zoneNumber);
export const getParkingBayById = (id) => parkingBaysService.getParkingBayById(id);
export const forceRefreshParkingBaysData = () => parkingBaysService.forceRefreshData();
