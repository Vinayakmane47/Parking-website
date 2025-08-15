import express from 'express';
import { 
  getAllParkingBays, 
  getParkingBaysStats, 
  searchParkingBays, 
  getParkingBaysByZone, 
  getParkingBayById, 
  forceRefreshParkingBaysData 
} from '../services/parkingBaysService.js';

const router = express.Router();

// Get all parking bays with optional filtering
router.get('/', async (req, res) => {
  try {
    const { 
      limit = 100, 
      offset = 0, 
      bay_type, 
      zone_number, 
      restriction_type, 
      accessible_only,
      lat, 
      lng, 
      radius 
    } = req.query;

    // Build filters object
    const filters = {};
    if (bay_type) filters.bay_type = bay_type;
    if (zone_number) filters.zone_number = zone_number;
    if (restriction_type) filters.restriction_type = restriction_type;
    if (accessible_only === 'true') filters.accessible_only = true;
    if (lat && lng && radius) {
      filters.location = {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        radius: parseFloat(radius)
      };
    }

    const result = await getAllParkingBays(filters, parseInt(limit), parseInt(offset));
    
    res.json({
      success: true,
      data: result.bays,
      pagination: {
        total: result.total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: (parseInt(offset) + parseInt(limit)) < result.total
      },
      meta: {
        cached: result.cached,
        lastUpdated: result.lastUpdated,
        warning: result.warning
      }
    });

  } catch (error) {
    console.error('Error fetching parking bays:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch parking bays data',
      message: error.message
    });
  }
});

// Get parking bays statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await getParkingBaysStats();
    
    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching parking bays stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch parking bays statistics',
      message: error.message
    });
  }
});

// Search parking bays
router.get('/search', async (req, res) => {
  try {
    const { q: query, limit = 50 } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    const results = await searchParkingBays(query, parseInt(limit));
    
    res.json({
      success: true,
      data: results,
      meta: {
        query,
        count: results.length,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error searching parking bays:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search parking bays',
      message: error.message
    });
  }
});

// Get parking bays by zone
router.get('/zone/:zoneNumber', async (req, res) => {
  try {
    const { zoneNumber } = req.params;
    const bays = await getParkingBaysByZone(zoneNumber);
    
    res.json({
      success: true,
      data: bays,
      meta: {
        zoneNumber,
        count: bays.length
      }
    });

  } catch (error) {
    console.error('Error fetching parking bays by zone:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch parking bays by zone',
      message: error.message
    });
  }
});

// Get single parking bay by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const bay = await getParkingBayById(id);
    
    if (!bay) {
      return res.status(404).json({
        success: false,
        error: 'Parking bay not found'
      });
    }
    
    res.json({
      success: true,
      data: bay
    });

  } catch (error) {
    console.error('Error fetching parking bay by ID:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch parking bay',
      message: error.message
    });
  }
});

// Force refresh parking bays data
router.post('/refresh', async (req, res) => {
  try {
    const result = await forceRefreshParkingBaysData();
    
    res.json({
      success: true,
      message: 'Parking bays data refreshed successfully',
      data: result
    });

  } catch (error) {
    console.error('Error refreshing parking bays data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to refresh parking bays data',
      message: error.message
    });
  }
});

export default router;
