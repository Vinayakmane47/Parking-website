<template>
  <div class="map-container">
    <!-- Modern Header Panel -->
    <div class="map-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="header-title">Melbourne Parking Map</h1>
          <p class="header-subtitle">Real-time parking availability across the city</p>
        </div>
        
        <!-- Live Stats -->
        <div class="live-stats">
          <div class="stat-item">
            <div class="stat-icon">LOCATION</div>
            <div class="stat-content">
              <div class="stat-value">{{ parkingCount }}</div>
              <div class="stat-label">Total Spots</div>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">AVAILABLE</div>
            <div class="stat-content">
              <div class="stat-value">{{ availableCount }}</div>
              <div class="stat-label">Available</div>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">OCCUPIED</div>
            <div class="stat-content">
              <div class="stat-value">{{ occupiedCount }}</div>
              <div class="stat-label">Occupied</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Search Bar -->
      <div class="search-section">
        <div class="search-container">
          <div class="search-input-wrapper">
            <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              v-model="searchQuery"
              @keyup.enter="searchLocation"
              type="text"
              placeholder="Search for a location in Melbourne..."
              class="search-input"
            >
            <button @click="searchLocation" :disabled="searching" class="search-btn">
              <svg v-if="!searching" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <div v-else class="search-spinner"></div>
            </button>
          </div>
          
          <div class="action-buttons">
            <button @click="resetView" class="action-btn reset-btn" v-if="searchQuery">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                <path d="M21 3v5h-5"/>
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                <path d="M3 21v-5h5"/>
              </svg>
              Show All
            </button>
            <button @click="loadParkingData" :disabled="loading" class="action-btn refresh-btn">
              <svg v-if="!loading" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                <path d="M21 3v5h-5"/>
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                <path d="M3 21v-5h5"/>
              </svg>
              <div v-else class="refresh-spinner"></div>
              {{ loading ? 'Loading...' : 'Refresh' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Enhanced Filters -->
      <div class="filters-section">
        <!-- Parking Type Filters -->
        <div class="filter-group">
          <label class="filter-label">Parking Type</label>
          <div class="filter-buttons">
            <button 
              @click="setParkingTypeFilter('all')" 
              :class="{ active: parkingTypeFilter === 'all' }" 
              class="filter-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M8 12h8"/>
                <path d="M12 8v8"/>
              </svg>
              All Types
            </button>
            <button 
              @click="setParkingTypeFilter('street')" 
              :class="{ active: parkingTypeFilter === 'street' }" 
              class="filter-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
              Street Parking
            </button>
            <button 
              @click="setParkingTypeFilter('building')" 
              :class="{ active: parkingTypeFilter === 'building' }" 
              class="filter-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 3v18h18"/>
                <path d="M9 9h6v6H9z"/>
              </svg>
              Building Parking
            </button>
          </div>
        </div>

        <!-- NEW: Suburb Filter -->
        <div class="filter-group">
          <label class="filter-label">Suburb</label>
          <div class="suburb-filter">
            <select v-model="selectedSuburb" @change="filterBySuburb" class="suburb-select">
              <option value="">All Suburbs ({{ availableSuburbs.length }})</option>
              <option v-for="suburb in availableSuburbs" :key="suburb" :value="suburb">
                {{ suburb }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Status Indicators -->
      <div class="status-section">
        <div class="status-indicators">
          <div v-if="isFiltered" class="status-badge filter-active">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
            </svg>
            Filtered: {{ searchLocationName }}
          </div>
          <div class="status-badge data-source" :class="{ 'real-data': usingRealData, 'mock-data': !usingRealData }">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4"/>
              <path d="M12 8h.01"/>
            </svg>
            {{ dataSource }}
          </div>
        </div>

        <!-- Enhanced Legend -->
        <div class="legend">
          <div class="legend-item" v-if="parkingTypeFilter === 'all' || parkingTypeFilter === 'street'">
            <div class="legend-dot available"></div>
            <span>Available</span>
          </div>
          <div class="legend-item" v-if="parkingTypeFilter === 'all' || parkingTypeFilter === 'street'">
            <div class="legend-dot occupied"></div>
            <span>Occupied</span>
          </div>
          <div class="legend-item" v-if="parkingTypeFilter === 'all' || parkingTypeFilter === 'building'">
            <div class="legend-dot building"></div>
            <span>Building Parking</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Map Container -->
    <div ref="mapContainer" class="map" id="map"></div>
    
    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <h3>Loading Parking Data</h3>
        <p>Fetching real-time availability from Melbourne API...</p>
      </div>
    </div>

    <!-- Quick Actions Floating Panel -->
    <div class="quick-actions">
      <button @click="zoomToCBD" class="quick-action-btn" title="Zoom to CBD">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          <circle cx="12" cy="9" r="2.5"/>
        </svg>
      </button>
      <button @click="toggleHeatmap" class="quick-action-btn" title="Toggle Heatmap">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2v20M2 12h20"/>
        </svg>
      </button>
      <button @click="showPopularAreas" class="quick-action-btn" title="Popular Areas">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { MAPBOX_CONFIG, BACKEND_CONFIG } from '../config/mapbox.js'
import { calculateDistance, getDisplayName } from '../utils/common.js'

// Define props
const props = defineProps({
  selectedSpot: {
    type: Object,
    default: null
  }
})

console.log('ParkingMap: Props received:', props)
console.log('ParkingMap: selectedSpot:', props.selectedSpot)

// Building parking data
let buildingParkingData = null

const mapContainer = ref(null)
const loading = ref(false)
const searching = ref(false)
const parkingCount = ref(0)
const availableCount = ref(0)
const occupiedCount = ref(0)
const searchQuery = ref('')
const usingRealData = ref(false)
const dataSource = ref('Ready to load data')
let map = null
let allParkingSpots = []
let searchMarker = null
const isFiltered = ref(false)
const searchLocationName = ref('')
const parkingTypeFilter = ref('all')

// NEW: Suburb filtering
const selectedSuburb = ref('')
const availableSuburbs = ref([])
const heatmapMode = ref(false)

// Backend API configuration
const BACKEND_URL = BACKEND_CONFIG.baseURL

// Melbourne CBD coordinates
const MELBOURNE_CBD = {
  center: [144.9631, -37.8136],
  zoom: 14
}

// Popular areas for quick navigation
const POPULAR_AREAS = [
  { name: 'CBD', center: [144.9631, -37.8136], zoom: 15 },
  { name: 'Docklands', center: [144.9450, -37.8160], zoom: 16 },
  { name: 'Southbank', center: [144.9600, -37.8200], zoom: 16 },
  { name: 'Carlton', center: [144.9700, -37.8000], zoom: 15 },
  { name: 'Fitzroy', center: [144.9800, -37.8000], zoom: 15 },
  { name: 'St Kilda', center: [144.9800, -37.8600], zoom: 15 }
]

console.log('Environment debug info:')
console.log('  - Mode:', import.meta.env.MODE)
console.log('  - Prod:', import.meta.env.PROD)
console.log('  - VITE_BACKEND_URL:', import.meta.env.VITE_BACKEND_URL)
console.log('  - Window origin:', window.location.origin)
console.log('  - Final backend URL:', BACKEND_URL)

onMounted(() => {
  initializeMap()
})

onUnmounted(() => {
  if (map) {
    map.remove()
  }
})

// Watch for selectedSpot changes
watch(() => props.selectedSpot, (newSpot, oldSpot) => {
  console.log('selectedSpot changed:', newSpot, 'old:', oldSpot)
  if (newSpot && map && map.isStyleLoaded()) {
    console.log('Showing selected spot on map:', newSpot)
    showSelectedSpotOnMap(newSpot)
  } else if (newSpot && map && !map.isStyleLoaded()) {
    console.log('Map not ready, waiting for style to load...')
    map.once('styledata', () => {
      console.log('Map style loaded, showing selected spot')
      showSelectedSpotOnMap(newSpot)
    })
  }
}, { immediate: true })

// NEW: Extract suburbs from parking data
const extractSuburbs = (parkingSpots) => {
  const suburbs = new Set()
  
  // Debug: Log some sample data to see what we're working with
  console.log('Extracting suburbs from parking data...')
  console.log('Sample parking spots:', parkingSpots.slice(0, 3))
  
  parkingSpots.forEach(spot => {
    // Check multiple possible fields for suburb/area information
    const area = spot.properties.area || 
                 spot.properties.suburb || 
                 spot.properties.zone_name ||
                 spot.properties.street_name?.split(' ').pop() || // Try to extract from street name
                 'Unknown Area'
    
    if (area && area !== 'Unknown Area' && area !== 'Melbourne CBD') {
      suburbs.add(area.trim())
    }
  })
  
  // If no suburbs found, create them based on geographic coordinates
  if (suburbs.size === 0) {
    console.log('No suburb data found, creating geographic-based suburbs...')
    
    // Define geographic boundaries for major Melbourne areas
    const geographicSuburbs = {
      'Melbourne CBD': { 
        minLat: -37.82, maxLat: -37.80, 
        minLng: 144.95, maxLng: 144.97 
      },
      'Docklands': { 
        minLat: -37.82, maxLat: -37.80, 
        minLng: 144.93, maxLng: 144.95 
      },
      'Southbank': { 
        minLat: -37.82, maxLat: -37.80, 
        minLng: 144.97, maxLng: 144.99 
      },
      'Carlton': { 
        minLat: -37.80, maxLat: -37.78, 
        minLng: 144.95, maxLng: 144.97 
      },
      'Fitzroy': { 
        minLat: -37.80, maxLat: -37.78, 
        minLng: 144.97, maxLng: 144.99 
      },
      'Richmond': { 
        minLat: -37.82, maxLat: -37.80, 
        minLng: 144.99, maxLng: 145.01 
      },
      'South Yarra': { 
        minLat: -37.84, maxLat: -37.82, 
        minLng: 144.99, maxLng: 145.01 
      },
      'St Kilda': { 
        minLat: -37.86, maxLat: -37.84, 
        minLng: 144.97, maxLng: 144.99 
      }
    }
    
    // Categorize spots by geographic location
    parkingSpots.forEach(spot => {
      const [lng, lat] = spot.geometry.coordinates
      
      for (const [suburbName, bounds] of Object.entries(geographicSuburbs)) {
        if (lat >= bounds.minLat && lat <= bounds.maxLat && 
            lng >= bounds.minLng && lng <= bounds.maxLng) {
          suburbs.add(suburbName)
          break
        }
      }
    })
  }
  
  // If still no suburbs found, add some common Melbourne suburbs
  if (suburbs.size === 0) {
    console.log('Adding fallback common suburbs...')
    const commonSuburbs = [
      'Melbourne CBD', 'Docklands', 'Southbank', 'Carlton', 'Fitzroy',
      'Collingwood', 'Richmond', 'South Yarra', 'St Kilda', 'Port Melbourne',
      'North Melbourne', 'West Melbourne', 'East Melbourne', 'Kensington',
      'Flemington', 'Brunswick', 'Northcote', 'Thornbury', 'Preston'
    ]
    commonSuburbs.forEach(suburb => suburbs.add(suburb))
  }
  
  const suburbList = Array.from(suburbs).sort()
  console.log('Extracted suburbs:', suburbList)
  return suburbList
}

// NEW: Filter by suburb
const filterBySuburb = () => {
  console.log('Filtering by suburb:', selectedSuburb.value)
  
  if (!selectedSuburb.value || selectedSuburb.value === '') {
    console.log('Showing all suburbs - resetting to all parking spots')
    updateParkingLayer(allParkingSpots)
    updateParkingCounts()
    return
  }

  const filteredSpots = allParkingSpots.filter(spot => {
    // First try to match by area/suburb properties
    const spotArea = spot.properties.area || 
                    spot.properties.suburb || 
                    spot.properties.zone_name ||
                    spot.properties.street_name?.split(' ').pop()
    
    if (spotArea && spotArea.trim() === selectedSuburb.value.trim()) {
      return true
    }
    
    // If no match by properties, try geographic matching
    const [lng, lat] = spot.geometry.coordinates
    
    // Define geographic boundaries for major Melbourne areas
    const geographicSuburbs = {
      'Melbourne CBD': { 
        minLat: -37.82, maxLat: -37.80, 
        minLng: 144.95, maxLng: 144.97 
      },
      'Docklands': { 
        minLat: -37.82, maxLat: -37.80, 
        minLng: 144.93, maxLng: 144.95 
      },
      'Southbank': { 
        minLat: -37.82, maxLat: -37.80, 
        minLng: 144.97, maxLng: 144.99 
      },
      'Carlton': { 
        minLat: -37.80, maxLat: -37.78, 
        minLng: 144.95, maxLng: 144.97 
      },
      'Fitzroy': { 
        minLat: -37.80, maxLat: -37.78, 
        minLng: 144.97, maxLng: 144.99 
      },
      'Richmond': { 
        minLat: -37.82, maxLat: -37.80, 
        minLng: 144.99, maxLng: 145.01 
      },
      'South Yarra': { 
        minLat: -37.84, maxLat: -37.82, 
        minLng: 144.99, maxLng: 145.01 
      },
      'St Kilda': { 
        minLat: -37.86, maxLat: -37.84, 
        minLng: 144.97, maxLng: 144.99 
      }
    }
    
    const bounds = geographicSuburbs[selectedSuburb.value]
    if (bounds) {
      return lat >= bounds.minLat && lat <= bounds.maxLat && 
             lng >= bounds.minLng && lng <= bounds.maxLng
    }
    
    return false
  })

  console.log(`Filtered ${filteredSpots.length} spots for suburb: ${selectedSuburb.value}`)
  console.log('Sample filtered spots:', filteredSpots.slice(0, 3))

  updateParkingLayer(filteredSpots)
  updateParkingCounts()

  if (filteredSpots.length > 0) {
    const coordinates = filteredSpots.map(spot => spot.geometry.coordinates)
    const lngs = coordinates.map(coord => coord[0])
    const lats = coordinates.map(coord => coord[1])

    const bounds = [
      [Math.min(...lngs), Math.min(...lats)],
      [Math.max(...lngs), Math.max(...lats)]
    ]

    map.fitBounds(bounds, {
      padding: { top: 80, bottom: 80, left: 80, right: 80 },
      maxZoom: 16,
      duration: 1500
    })
  } else {
    console.log('No spots found for selected suburb, staying at current view')
  }
}

// NEW: Quick action functions
const zoomToCBD = () => {
  map.flyTo({
    center: MELBOURNE_CBD.center,
    zoom: MELBOURNE_CBD.zoom,
    duration: 2000
  })
}

const toggleHeatmap = () => {
  heatmapMode.value = !heatmapMode.value
  if (heatmapMode.value) {
    map.setStyle('mapbox://styles/mapbox/dark-v11')
  } else {
    map.setStyle(MAPBOX_CONFIG.styles.streets)
  }
}

const showPopularAreas = () => {
  const popup = new mapboxgl.Popup()
    .setLngLat(MELBOURNE_CBD.center)
    .setHTML(`
      <div class="popular-areas-popup">
        <h3>Popular Areas</h3>
        <div class="areas-list">
          ${POPULAR_AREAS.map(area => `
            <button onclick="window.zoomToArea('${area.name}', ${area.center[0]}, ${area.center[1]}, ${area.zoom})" class="area-btn">
              ${area.name}
            </button>
          `).join('')}
        </div>
      </div>
    `)
    .addTo(map)
}

// Add global function for area navigation
window.zoomToArea = (name, lng, lat, zoom) => {
  map.flyTo({
    center: [lng, lat],
    zoom: zoom,
    duration: 2000
  })
}

const updateMapStyle = () => {
  if (!map) return

  if (heatmapMode.value) {
    // Switch to heatmap style
    map.setStyle('mapbox://styles/mapbox/dark-v11')
  } else {
    // Switch back to streets style
    map.setStyle(MAPBOX_CONFIG.styles.streets)
  }
}

// Show selected parking spot on map
const showSelectedSpotOnMap = (spotInfo) => {
  console.log('showSelectedSpotOnMap called with:', spotInfo)
  if (!map) {
    console.log('Map not available')
    return
  }

  const { lat, lng, name, spotId } = spotInfo
  console.log('Coordinates:', lat, lng, 'Name:', name, 'ID:', spotId)

  if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
    console.error('Invalid coordinates:', lat, lng)
    return
  }

  if (map.getLayer('selected-spot-marker')) {
    map.removeLayer('selected-spot-marker')
  }
  if (map.getSource('selected-spot')) {
    map.removeSource('selected-spot')
  }

  try {
    map.addSource('selected-spot', {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [lng, lat]
        },
        properties: {
          name: name,
          id: spotId
        }
      }
    })

    map.addLayer({
      id: 'selected-spot-marker',
      type: 'circle',
      source: 'selected-spot',
      paint: {
        'circle-radius': 12,
        'circle-color': '#FF6B6B',
        'circle-stroke-width': 3,
        'circle-stroke-color': '#ffffff'
      }
    })

    console.log('Added selected spot marker')

    map.flyTo({
      center: [lng, lat],
      zoom: 18,
      duration: 2000
    })

    console.log('Flying to location')

    setTimeout(() => {
      const popup = new mapboxgl.Popup()
        .setLngLat([lng, lat])
        .setHTML(`
          <div class="selected-spot-popup">
            <h3>LOCATION ${name}</h3>
            <p><strong>ID:</strong> ${spotId}</p>
            <p><strong>Coordinates:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}</p>
            <p><em>Selected from Parking Info</em></p>
          </div>
        `)
        .addTo(map)
      
      console.log('Added popup')
    }, 2100)
  } catch (error) {
    console.error('Error showing selected spot on map:', error)
  }
}

const loadBuildingParkingData = async () => {
  try {
    const response = await fetch('/data/building-parking.json')
    buildingParkingData = await response.json()
    addBuildingParkingLayer()
  } catch (error) {
    console.error('Error loading building parking data:', error)
  }
}

const addBuildingParkingLayer = () => {
  if (!map || !buildingParkingData) return

  if (map.getLayer('building-parking-points')) {
    map.removeLayer('building-parking-points')
  }
  if (map.getSource('building-parking')) {
    map.removeSource('building-parking')
  }

  map.addSource('building-parking', {
    type: 'geojson',
    data: buildingParkingData
  })

  map.addLayer({
    id: 'building-parking-points',
    type: 'circle',
    source: 'building-parking',
    paint: {
      'circle-radius': [
        'interpolate',
        ['linear'],
        ['get', 'parking_spaces'],
        0, 5,
        100, 10,
        500, 15
      ],
      'circle-color': '#4264fb',
      'circle-opacity': 0.8,
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff'
    }
  })

  map.on('click', 'building-parking-points', (e) => {
    if (!e.features.length) return

    const feature = e.features[0]
    const coordinates = feature.geometry.coordinates.slice()
    const properties = feature.properties

    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
    }

    new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(`
        <h3>Building Parking Details</h3>
        <p><strong>Address:</strong> ${properties.building_address}</p>
        <p><strong>Parking Type:</strong> ${properties.parking_type}</p>
        <p><strong>Parking Spaces:</strong> ${properties.parking_spaces}</p>
      `)
      .addTo(map)
  })

  map.on('mouseenter', 'building-parking-points', () => {
    map.getCanvas().style.cursor = 'pointer'
  })

  map.on('mouseleave', 'building-parking-points', () => {
    map.getCanvas().style.cursor = ''
  })
}

const initializeMap = () => {
  console.log('Initializing map with token:', MAPBOX_CONFIG.accessToken.substring(0, 10) + '...')
  
  if (!MAPBOX_CONFIG.accessToken || MAPBOX_CONFIG.accessToken === 'your-mapbox-token-here') {
    console.error('Invalid Mapbox token')
    alert('Mapbox token configuration error, please check environment variable VITE_MAPBOX_ACCESS_TOKEN')
    return
  }

  mapboxgl.accessToken = MAPBOX_CONFIG.accessToken

  map = new mapboxgl.Map({
    container: 'map',
    style: MAPBOX_CONFIG.styles.streets,
    center: MAPBOX_CONFIG.melbourne.center,
    zoom: MAPBOX_CONFIG.melbourne.zoom
  });

  map.addControl(new mapboxgl.NavigationControl());
  map.addControl(new mapboxgl.FullscreenControl())

  map.on('error', (e) => {
    console.error('Map error:', e.error)
    alert(`Map loading error: ${e.error.message}\n\nPlease check:\n1. Mapbox token is valid\n2. Network connection is normal`)
  })

  map.on('load', () => {
    console.log('Map loaded')
    loadParkingData()
    loadBuildingParkingData()
    
    if (props.selectedSpot) {
      console.log('Map loaded with selectedSpot:', props.selectedSpot)
      setTimeout(() => {
        showSelectedSpotOnMap(props.selectedSpot)
      }, 1000)
    }
  })

  map.on('styledata', () => {
    console.log('Map style loaded')
    if (props.selectedSpot && map.isStyleLoaded()) {
      console.log('Style loaded with selectedSpot:', props.selectedSpot)
      setTimeout(() => {
        showSelectedSpotOnMap(props.selectedSpot)
      }, 500)
    }
  })
}

// Load parking data from backend API
const loadParkingData = async () => {
  if (!map || loading.value) return

  console.log('Loading parking data from backend API...')
  loading.value = true
  parkingCount.value = 0
  availableCount.value = 0
  occupiedCount.value = 0
  dataSource.value = 'Loading from backend...'

  try {
    const startTime = Date.now()
    const response = await fetch(`${BACKEND_URL}/api/parking`)
    const duration = Date.now() - startTime

    if (!response.ok) {
      throw new Error(`Backend API call failed: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()
    console.log(`Backend API call successful! Duration: ${duration}ms`, result)

    if (!result.success) {
      throw new Error(result.error || 'Backend returned error')
    }

    const parkingSpots = result.data || []
    console.log(`Retrieved ${parkingSpots.length} parking spots`)

    // Debug: Log sample data to see what fields are available
    console.log('Sample parking spot data:', parkingSpots.slice(0, 2))

    const geoJsonFeatures = parkingSpots.map(spot => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [parseFloat(spot.longitude), parseFloat(spot.latitude)]
      },
      properties: {
        id: spot.id,
        name: spot.name || 'Unknown Parking Spot',
        status: spot.status || 'Available',
        street_name: spot.street_name || 'Unknown Street',
        zone_number: spot.zone_number,
        area: spot.area || 'Melbourne CBD',
        restrictions: typeof spot.restrictions === 'string' ? spot.restrictions : JSON.stringify(spot.restrictions || {}),
        cost: typeof spot.cost_info === 'string' ? spot.cost_info : 'Varies by location',
        sensor_id: spot.sensor_id,
        bay_id: spot.bay_id,
        last_updated: spot.last_updated
      }
    }))

    allParkingSpots = geoJsonFeatures

    // NEW: Extract and set available suburbs
    availableSuburbs.value = extractSuburbs(geoJsonFeatures)
    console.log('Available suburbs for dropdown:', availableSuburbs.value)

    parkingCount.value = geoJsonFeatures.length
    availableCount.value = geoJsonFeatures.filter(spot => spot.properties.status === 'Available').length
    occupiedCount.value = geoJsonFeatures.filter(spot => spot.properties.status === 'Occupied').length

    usingRealData.value = true
    const source = result.meta?.cached ? 'Cached' : 'Live'
    dataSource.value = source

    console.log(`Data statistics: Available ${availableCount.value}, Occupied ${occupiedCount.value}`)

    if (map.getSource('parking-spots')) {
      map.removeLayer('parking-spots-layer')
      map.removeSource('parking-spots')
    }

    map.addSource('parking-spots', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: geoJsonFeatures
      }
    })

    map.addLayer({
      id: 'parking-spots-layer',
      type: 'circle',
      source: 'parking-spots',
      paint: {
        'circle-radius': 8,
        'circle-color': [
          'case',
          ['==', ['get', 'status'], 'Available'], '#28a745',
          ['==', ['get', 'status'], 'Occupied'], '#dc3545',
          '#28a745'
        ],
        'circle-stroke-width': 2,
        'circle-stroke-color': '#fff'
      }
    })

    addMapEventListeners()

    console.log('Parking data loading completed!')

  } catch (error) {
    console.error('Failed to load parking data:', error)
    dataSource.value = `Error: ${error.message}`

    console.error('Debug info:')
    console.error('  - Backend URL:', BACKEND_URL)
    console.error('  - Full request URL:', `${BACKEND_URL}/api/parking`)
    console.error('  - Error type:', error.name)
    console.error('  - Error message:', error.message)
    
    if (error.message.includes('fetch') || error.name === 'TypeError') {
      dataSource.value = 'Network Error: Cannot connect to backend'
      alert(`Network connection error: Cannot connect to backend server\n\nPlease check:\n1. Backend server is running\n2. URL is correct: ${BACKEND_URL}\n3. CORS issues\n\nCurrent environment: ${import.meta.env.MODE}`)
    } else {
      alert(`Failed to load data: ${error.message}\n\nBackend URL: ${BACKEND_URL}\nEnvironment: ${import.meta.env.MODE}`)
    }
  } finally {
    loading.value = false
  }
}

// Enhanced search function
const searchLocation = async () => {
  if (!searchQuery.value.trim() || searching.value) return

  searching.value = true

  try {
    const query = encodeURIComponent(searchQuery.value.trim())
    const geocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${MAPBOX_CONFIG.accessToken}&proximity=144.9631,-37.8136&country=AU&bbox=144.5937,-38.4339,145.5125,-37.5113`

    console.log('Searching address:', searchQuery.value)
    const response = await fetch(geocodingUrl)

    if (!response.ok) {
      throw new Error('Geocoding request failed')
    }

    const data = await response.json()

    if (data.features && data.features.length > 0) {
      const feature = data.features[0]
      const [lng, lat] = feature.center

      console.log('Location found:', feature.place_name, 'Coordinates:', [lng, lat])

      if (searchMarker) {
        searchMarker.remove()
      }

      searchMarker = new mapboxgl.Marker({
        color: '#FF6B6B',
        scale: 1.2
      })
        .setLngLat([lng, lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div class="search-popup">
                <h3>Search Location</h3>
                <p><strong>${feature.place_name}</strong></p>
                <p>COORDS ${lat.toFixed(6)}, ${lng.toFixed(6)}</p>
                <p><em>Searching for parking spots within 300m</em></p>
              </div>
            `)
        )
        .addTo(map)

      let zoomLevel = 18

      const addressText = feature.place_name.toLowerCase()
      if (addressText.includes('street') || addressText.includes('road') || addressText.includes('avenue')) {
        zoomLevel = 19
      } else if (addressText.includes('suburb') || addressText.includes('vic')) {
        zoomLevel = 16
      } else if (feature.bbox) {
        const bbox = feature.bbox
        const latDiff = Math.abs(bbox[3] - bbox[1])
        const lngDiff = Math.abs(bbox[2] - bbox[0])
        const maxDiff = Math.max(latDiff, lngDiff)

        if (maxDiff > 0.1) zoomLevel = 13
        else if (maxDiff > 0.05) zoomLevel = 15
        else if (maxDiff > 0.01) zoomLevel = 17
        else zoomLevel = 19
      }

      console.log(`Super zoom to zoom level ${zoomLevel}`)

      map.flyTo({
        center: [lng, lat],
        zoom: zoomLevel,
        duration: 2500,
        essential: true
      })

      filterParkingByLocation(lng, lat, feature.place_name)

    } else {
      alert('Location not found. Please try a different search term.')
    }
  } catch (error) {
    console.error('Search failed:', error)
    console.error('Search error details:')
    console.error('  - Search term:', searchQuery.value)
    console.error('  - Mapbox token:', MAPBOX_CONFIG.accessToken.substring(0, 10) + '...')
    console.error('  - Error type:', error.name)
    console.error('  - Error message:', error.message)
    
    let errorMessage = 'Search failed, please check network connection or try again later'
    
    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      errorMessage = 'Mapbox API authentication failed, please check if the token is valid'
    } else if (error.message.includes('network') || error.name === 'TypeError') {
      errorMessage = 'Network connection failed, please check network status'
    }
    
    alert(errorMessage)
  } finally {
    searching.value = false
  }
}

// Filter parking spots by distance from searched location
const filterParkingByLocation = (lng, lat, locationName) => {
  const radiusKm = 0.3

  console.log(`Starting filter: Search location [${lng}, ${lat}], radius ${radiusKm}km (${radiusKm * 1000}m)`)
  console.log(`Total parking spots: ${allParkingSpots.length}`)

  isFiltered.value = true
  searchLocationName.value = locationName

  const filteredStreetSpots = allParkingSpots.filter((spot) => {
    const [spotLng, spotLat] = spot.geometry.coordinates
    const distance = calculateDistance(lat, lng, spotLat, spotLng)
    return distance <= radiusKm
  })

  let filteredBuildingSpots = []
  if (buildingParkingData && buildingParkingData.features) {
    filteredBuildingSpots = buildingParkingData.features.filter((spot) => {
      const [spotLng, spotLat] = spot.geometry.coordinates
      const distance = calculateDistance(lat, lng, spotLat, spotLng)
      return distance <= radiusKm
    })
  }

  console.log(`Filter result: ${filteredStreetSpots.length} street parking spots, ${filteredBuildingSpots.length} building parking spots within ${radiusKm}km range`)

  updateParkingLayer(filteredStreetSpots)
  
  if (map.getSource('building-parking')) {
    const filteredBuildingData = {
      type: 'FeatureCollection',
      features: filteredBuildingSpots
    }
    map.getSource('building-parking').setData(filteredBuildingData)
  }

  const totalCount = filteredStreetSpots.length + filteredBuildingSpots.length
  parkingCount.value = totalCount

  const filteredStatusCounts = {}
  filteredStreetSpots.forEach(spot => {
    const status = spot.properties.status
    filteredStatusCounts[status] = (filteredStatusCounts[status] || 0) + 1
  })
  filteredStatusCounts['Available'] = (filteredStatusCounts['Available'] || 0) + filteredBuildingSpots.length
  
  availableCount.value = filteredStatusCounts['Available'] || 0
  occupiedCount.value = filteredStatusCounts['Occupied'] || 0

  console.log(`Found ${totalCount} parking spots within 300m of ${locationName}`)
  console.log(`Available: ${availableCount.value}, Occupied: ${occupiedCount.value}`)

  if (totalCount === 0) {
    console.log('No parking spots found within 300m, but staying at search location')
    setTimeout(() => {
      alert(`No parking spots found within 300m of ${locationName}. Map has been zoomed to search location, you can manually check nearby areas.`)
    }, 1000)
  }

  setTimeout(() => {
    if (totalCount > 0) {
      const coordinates = [...filteredStreetSpots.map(spot => spot.geometry.coordinates), 
                           ...filteredBuildingSpots.map(spot => spot.geometry.coordinates)]
      coordinates.push([lng, lat])

      const lngs = coordinates.map(coord => coord[0])
      const lats = coordinates.map(coord => coord[1])

      const bounds = [
        [Math.min(...lngs), Math.min(...lats)],
        [Math.max(...lngs), Math.max(...lats)]
      ]

      const latRange = Math.max(...lats) - Math.min(...lats)
      const lngRange = Math.max(...lngs) - Math.min(...lngs)
      const maxRange = Math.max(latRange, lngRange)

      const padding = { top: 80, bottom: 80, left: 80, right: 80 }
      const maxZoom = maxRange < 0.01 ? 18 : 17

      map.fitBounds(bounds, {
        padding,
        maxZoom,
        duration: 2000
      })
    } else {
      console.log('Maintaining zoom effect at search location')
    }
  }, 3000)
}

// Update parking layer with new data
const updateParkingLayer = (spots) => {
  if (map.getSource('parking-spots')) {
    map.getSource('parking-spots').setData({
      type: 'FeatureCollection',
      features: spots
    })
  }
}

// Add map event listeners
const addMapEventListeners = () => {
  map.on('click', 'parking-spots-layer', (e) => {
    const coordinates = e.features[0].geometry.coordinates.slice()
    const properties = e.features[0].properties

    const statusColor = properties.status === 'Available' ? 'green' : 'red'
    const displayName = getDisplayName(properties)

    const popupContent = `
      <div class="parking-popup">
        <h3>${displayName}</h3>
        <p><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${properties.status}</span></p>
        <p><strong>Location:</strong> ${displayName}</p>
        <p><strong>Area:</strong> ${properties.area}</p>
        <p><strong>Zone:</strong> ${properties.zone_number || 'N/A'}</p>
        ${properties.last_updated ? `<p><strong>Last Updated:</strong> ${properties.last_updated}</p>` : ''}
        <p><em>Data from Backend API</em></p>
      </div>
    `

    new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(popupContent)
      .addTo(map)
  })

  map.on('mouseenter', 'parking-spots-layer', () => {
    map.getCanvas().style.cursor = 'pointer'
  })

  map.on('mouseleave', 'parking-spots-layer', () => {
    map.getCanvas().style.cursor = ''
  })
}

// Reset view to show all parking spots
const resetView = () => {
  if (searchMarker) {
    searchMarker.remove()
    searchMarker = null
  }

  isFiltered.value = false
  searchLocationName.value = ''
  selectedSuburb.value = ''

  updateParkingLayer(allParkingSpots)
  
  if (map.getSource('building-parking') && buildingParkingData) {
    map.getSource('building-parking').setData(buildingParkingData)
  }

  const totalCount = allParkingSpots.length + (buildingParkingData ? buildingParkingData.features.length : 0)
  parkingCount.value = totalCount

  const allStatusCounts = {}
  allParkingSpots.forEach(spot => {
    const status = spot.properties.status
    allStatusCounts[status] = (allStatusCounts[status] || 0) + 1
  })
  if (buildingParkingData && buildingParkingData.features) {
    allStatusCounts['Available'] = (allStatusCounts['Available'] || 0) + buildingParkingData.features.length
  }
  
  availableCount.value = allStatusCounts['Available'] || 0
  occupiedCount.value = allStatusCounts['Occupied'] || 0

  searchQuery.value = ''

  if (totalCount > 0) {
    const coordinates = [...allParkingSpots.map(spot => spot.geometry.coordinates)]
    
    if (buildingParkingData && buildingParkingData.features) {
      coordinates.push(...buildingParkingData.features.map(spot => spot.geometry.coordinates))
    }

    const lngs = coordinates.map(coord => coord[0])
    const lats = coordinates.map(coord => coord[1])

    const bounds = [
      [Math.min(...lngs), Math.min(...lats)],
      [Math.max(...lngs), Math.max(...lats)]
    ]

    map.fitBounds(bounds, {
      padding: { top: 80, bottom: 80, left: 80, right: 80 },
      maxZoom: 15,
      duration: 1500
    })
  } else {
    map.flyTo({
      center: MAPBOX_CONFIG.melbourne.center,
      zoom: MAPBOX_CONFIG.melbourne.zoom,
      duration: 1500
    })
  }

  console.log('View has been reset, showing all parking spots')
}

// Set parking type filter
const setParkingTypeFilter = (type) => {
  parkingTypeFilter.value = type
  updateParkingLayerVisibility()
  console.log(`Parking type filter set to: ${type}`)
}

// Update parking layer visibility
const updateParkingLayerVisibility = () => {
  if (!map) return
  
  const showStreet = parkingTypeFilter.value === 'all' || parkingTypeFilter.value === 'street'
  const showBuilding = parkingTypeFilter.value === 'all' || parkingTypeFilter.value === 'building'
  
  if (map.getLayer('parking-spots-layer')) {
    map.setLayoutProperty('parking-spots-layer', 'visibility', showStreet ? 'visible' : 'none')
  }
  
  if (map.getLayer('building-parking-points')) {
    map.setLayoutProperty('building-parking-points', 'visibility', showBuilding ? 'visible' : 'none')
  }
  
  updateParkingCounts()
}

// Update parking statistics data
const updateParkingCounts = () => {
  let totalCount = 0
  let availableCountLocal = 0
  let occupiedCountLocal = 0
  
  let currentStreetSpots = allParkingSpots
  let currentBuildingSpots = []
  
  if (map.getSource('parking-spots')) {
    const streetData = map.getSource('parking-spots')._data
    if (streetData && streetData.features) {
      currentStreetSpots = streetData.features
    }
  }
  
  if (map.getSource('building-parking')) {
    const buildingData = map.getSource('building-parking')._data
    if (buildingData && buildingData.features) {
      currentBuildingSpots = buildingData.features
    }
  }
  
  if (parkingTypeFilter.value === 'all' || parkingTypeFilter.value === 'street') {
    currentStreetSpots.forEach(spot => {
      totalCount++
      const status = spot.properties.status
      if (status === 'Available') {
        availableCountLocal++
      } else if (status === 'Occupied') {
        occupiedCountLocal++
      }
    })
  }
  
  if (parkingTypeFilter.value === 'all' || parkingTypeFilter.value === 'building') {
    currentBuildingSpots.forEach(spot => {
      totalCount++
      availableCountLocal++
    })
  }
  
  parkingCount.value = totalCount
  availableCount.value = availableCountLocal
  occupiedCount.value = occupiedCountLocal
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

.map-container {
  width: 100%;
  height: 100vh;
  position: relative;
  font-family: 'Inter', sans-serif;
}

/* Modern Header Panel */
.map-header {
  position: absolute;
  top: 100px;
  left: 20px;
  right: 20px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-left h1 {
  margin: 0 0 4px 0;
  font-size: 1.8rem;
  font-weight: 700;
  color: #1f2937;
  background: linear-gradient(135deg, #1f2937, #374151);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-subtitle {
  margin: 0;
  font-size: 0.9rem;
  color: #6b7280;
  font-weight: 400;
}

/* Live Stats */
.live-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  padding: 8px 12px;
  min-width: 80px;
}

.stat-icon {
  font-size: 1.2rem;
}

.stat-content {
  text-align: center;
}

.stat-value {
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
}

.stat-label {
  font-size: 0.7rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 2px;
}

/* Enhanced Search Section */
.search-section {
  margin-bottom: 20px;
}

.search-container {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-input-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.search-input-wrapper:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #9ca3af;
  z-index: 1;
}

.search-input {
  flex: 1;
  padding: 12px 12px 12px 40px;
  border: none;
  outline: none;
  font-size: 0.9rem;
  background: transparent;
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-btn {
  position: absolute;
  right: 8px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-btn:hover:not(:disabled) {
  background: #2563eb;
  transform: scale(1.05);
}

.search-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.search-spinner {
  width: 12px;
  height: 12px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: white;
  color: #374151;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.action-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  transform: translateY(-1px);
}

.reset-btn {
  color: #059669;
  border-color: #d1fae5;
  background: #f0fdf4;
}

.reset-btn:hover {
  background: #d1fae5;
  color: #047857;
}

.refresh-btn {
  color: #3b82f6;
  border-color: #dbeafe;
  background: #eff6ff;
}

.refresh-btn:hover {
  background: #dbeafe;
  color: #2563eb;
}

.refresh-spinner {
  width: 12px;
  height: 12px;
  border: 2px solid transparent;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Enhanced Filters */
.filters-section {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-buttons {
  display: flex;
  gap: 8px;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  color: #6b7280;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.filter-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.filter-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.filter-btn.active:hover {
  background: #2563eb;
}

.suburb-filter {
  min-width: 150px;
}

.suburb-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  color: #374151;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.suburb-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Status Section */
.status-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.status-indicators {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 500;
}

.status-badge.filter-active {
  background: rgba(59, 130, 246, 0.1);
  color: #2563eb;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.status-badge.data-source {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.status-badge.data-source.mock-data {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
  border: 1px solid rgba(245, 158, 11, 0.2);
}

/* Enhanced Legend */
.legend {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.legend-dot.available {
  background-color: #28a745;
}

.legend-dot.occupied {
  background-color: #dc3545;
}

.legend-dot.building {
  background-color: #4264fb;
}

/* Map Container */
.map {
  width: 100%;
  height: 100%;
}

/* Loading Overlay */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.loading-content {
  text-align: center;
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.loading-content h3 {
  margin: 0 0 8px 0;
  color: #1f2937;
  font-weight: 600;
}

.loading-content p {
  margin: 0;
  color: #6b7280;
  font-size: 0.9rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

/* Quick Actions */
.quick-actions {
  position: absolute;
  top: 100px;
  right: 20px;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quick-action-btn {
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: #374151;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.quick-action-btn:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

/* Animations */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Popup Styles */
:deep(.mapboxgl-popup-content) {
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

:deep(.parking-popup h3) {
  margin: 0 0 12px 0;
  color: #1f2937;
  font-size: 1.1rem;
  font-weight: 600;
}

:deep(.parking-popup p) {
  margin: 6px 0;
  font-size: 0.85rem;
  line-height: 1.4;
  color: #6b7280;
}

:deep(.search-popup h3) {
  margin: 0 0 12px 0;
  color: #dc2626;
  font-size: 1.1rem;
  font-weight: 600;
}

:deep(.search-popup p) {
  margin: 6px 0;
  font-size: 0.85rem;
  line-height: 1.4;
  color: #6b7280;
}

:deep(.popular-areas-popup h3) {
  margin: 0 0 12px 0;
  color: #1f2937;
  font-size: 1.1rem;
  font-weight: 600;
}

.areas-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.area-btn {
  padding: 8px 12px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #374151;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.area-btn:hover {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .map-header {
    padding: 20px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .live-stats {
    width: 100%;
    justify-content: space-between;
  }
  
  .search-container {
    flex-direction: column;
    gap: 12px;
  }
  
  .action-buttons {
    width: 100%;
    justify-content: space-between;
  }
  
  .filters-section {
    flex-direction: column;
    gap: 16px;
  }
  
  .filter-buttons {
    flex-wrap: wrap;
  }
  
  .status-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}

@media (max-width: 768px) {
  .map-header {
    top: 80px;
    left: 10px;
    right: 10px;
    padding: 16px;
  }
  
  .header-left h1 {
    font-size: 1.4rem;
  }
  
  .live-stats {
    gap: 8px;
  }
  
  .stat-item {
    padding: 6px 8px;
    min-width: 60px;
  }
  
  .stat-value {
    font-size: 0.9rem;
  }
  
  .stat-label {
    font-size: 0.6rem;
  }
  
  .search-input-wrapper {
    border-radius: 10px;
  }
  
  .search-input {
    padding: 10px 10px 10px 36px;
    font-size: 0.85rem;
  }
  
  .action-btn {
    padding: 8px 12px;
    font-size: 0.8rem;
  }
  
  .filter-btn {
    padding: 6px 10px;
    font-size: 0.75rem;
  }
  
  .suburb-select {
    padding: 6px 10px;
    font-size: 0.75rem;
  }
  
  .quick-actions {
    top: 80px;
    right: 10px;
  }
  
  .quick-action-btn {
    width: 40px;
    height: 40px;
  }
}

@media (max-width: 480px) {
  .map-header {
    top: 70px;
    padding: 12px;
  }
  
  .header-left h1 {
    font-size: 1.2rem;
  }
  
  .header-subtitle {
    font-size: 0.8rem;
  }
  
  .live-stats {
    flex-direction: column;
    gap: 6px;
  }
  
  .stat-item {
    width: 100%;
    justify-content: center;
  }
  
  .search-container {
    gap: 8px;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 8px;
  }
  
  .action-btn {
    width: 100%;
    justify-content: center;
  }
  
  .filter-buttons {
    flex-direction: column;
    gap: 6px;
  }
  
  .filter-btn {
    width: 100%;
    justify-content: center;
  }
  
  .suburb-select {
    width: 100%;
  }
  
  .legend {
    flex-direction: column;
    gap: 6px;
  }
  
  .legend-item {
    justify-content: center;
  }
}
</style>
