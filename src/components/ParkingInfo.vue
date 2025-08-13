<template>
  <div class="parking-info-container">
    <div class="info-header">
      <h2>Smart Parking Finder</h2>
      <p>Discover the best parking options near your destination with real-time availability and pricing</p>
    </div>

    <div class="search-section">
      <div class="search-form">
        <div class="form-group">
          <label for="destination">Destination</label>
          <div class="input-wrapper">
            <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
            </svg>
          <input
            id="destination"
            v-model="destination"
            @keyup.enter="searchParkingSpots"
            type="text"
              placeholder="Enter your destination (e.g., Flinders Street Station, Melbourne CBD)..."
            class="form-input"
          >
          </div>
        </div>
        <button @click="searchParkingSpots" :disabled="loading" class="search-btn">
          <svg v-if="!loading" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" stroke-width="2"/>
          </svg>
          <div v-else class="spinner"></div>
          {{ loading ? 'Searching...' : 'Find Parking' }}
        </button>
      </div>
    </div>

    <!-- Filters and Sorting -->
    <div v-if="parkingSpots.length > 0" class="filters-section">
      <div class="filters-row">
        <div class="filter-group">
          <label>Sort by:</label>
          <select v-model="sortBy" @change="sortResults" class="filter-select">
            <option value="distance">Distance</option>
            <option value="price">Price (Low to High)</option>
            <option value="availability">Availability</option>
            <option value="rating">Rating</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Filter by:</label>
          <select v-model="statusFilter" @change="filterResults" class="filter-select">
            <option value="all">All Spots</option>
            <option value="available">Available Only</option>
            <option value="occupied">Occupied Only</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Max Distance:</label>
          <select v-model="distanceFilter" @change="filterResults" class="filter-select">
            <option value="300">300m</option>
            <option value="500">500m</option>
            <option value="1000">1km</option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="parkingSpots.length > 0" class="results-section">
      <div class="results-header">
        <h3>Nearby Parking Spots</h3>
        <div class="results-meta">
          <span class="result-count">{{ filteredSpots.length }} spots found</span>
          <span class="search-radius">within {{ distanceFilter }}m</span>
        </div>
      </div>

      <div class="spots-list">
        <div
          v-for="(spot, index) in filteredSpots"
          :key="spot.id"
          class="spot-card"
          :class="{ 
            'best-option': index === 0 && sortBy === 'distance',
            'available': spot.status === 'Available',
            'occupied': spot.status === 'Occupied'
          }"
        >
          <div class="spot-header">
            <div class="spot-info">
              <h4>{{ getDisplayName(spot) }}</h4>
              <div class="spot-meta">
                <span class="distance">{{ spot.distance }}m away</span>
                <span class="rating" v-if="spot.rating">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
                  </svg>
                  {{ spot.rating }}
                </span>
              </div>
            </div>
            <div class="spot-status">
              <div class="status-indicator" :class="spot.status === 'Available' ? 'available' : 'occupied'">
                <span class="status-dot"></span>
                {{ spot.status }}
            </div>
            <div class="restriction-badge" :class="getRestrictionClass(spot.restriction_display)">
              {{ spot.restriction_display }}
              </div>
            </div>
          </div>
          
          <div class="spot-details">
            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">Location</span>
                <span class="detail-value">{{ getDisplayName(spot) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Time Restriction</span>
                <span class="detail-value">{{ formatTimeRestriction(spot) }}</span>
            </div>
              <div class="detail-item">
                <span class="detail-label">Days</span>
                <span class="detail-value">{{ spot.restriction_days || 'Daily' }}</span>
            </div>
              <div class="detail-item">
                <span class="detail-label">Type</span>
                <span class="detail-value">{{ spot.parking_type || 'Street' }}</span>
            </div>
            </div>
          </div>

          <div class="spot-actions">
            <button @click="showOnMap(spot)" class="action-btn map-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
              </svg>
              Show on Map
            </button>
            <button @click="getDirections(spot)" class="action-btn directions-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
              </svg>
              Directions
            </button>
          </div>

          <div v-if="index === 0 && sortBy === 'distance'" class="best-option-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
            </svg>
            Best Option
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="searched && !loading" class="no-results">
      <div class="no-results-content">
        <div class="no-results-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <h3>No parking spots found nearby</h3>
        <p>We couldn't find any parking spots within {{ distanceFilter }}m of your destination. Try expanding your search radius or choosing a different location.</p>
        <div class="no-results-actions">
        <button @click="resetSearch" class="reset-btn">Search Again</button>
          <button @click="increaseSearchRadius" class="expand-btn">Expand Search</button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading-section">
      <div class="loading-spinner"></div>
      <p>Searching for nearby parking spots...</p>
      <div class="loading-progress">
        <div class="progress-bar">
          <div class="progress-fill"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { calculateDistance, getDisplayName } from '../utils/common.js'

const emit = defineEmits(['navigate', 'showSpotOnMap'])

// Reactive data
const destination = ref('')
const parkingSpots = ref([])
const loading = ref(false)
const searched = ref(false)
const sortBy = ref('distance')
const statusFilter = ref('all')
const distanceFilter = ref('300')

// Computed properties
const filteredSpots = computed(() => {
  let spots = [...parkingSpots.value]
  
  // Apply status filter
  if (statusFilter.value !== 'all') {
    spots = spots.filter(spot => spot.status === statusFilter.value)
  }
  
  // Apply distance filter
  spots = spots.filter(spot => spot.distance <= parseInt(distanceFilter.value))
  
  return spots
})

// Methods
const searchParkingSpots = async () => {
  if (!destination.value.trim()) {
    alert('Please enter a destination')
    return
  }

  loading.value = true
  searched.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock data - in real app, this would come from API
    parkingSpots.value = [
      {
        id: 1,
        name: 'Collins Street Parking',
        distance: 150,
        status: 'Available',
        restriction_display: '2P',
        restriction_days: 'Mon-Fri',
        parking_type: 'Street',
        rating: 4.2,
        lat: -37.8136,
        lng: 144.9631
      },
      {
        id: 2,
        name: 'Flinders Street Station',
        distance: 280,
        status: 'Available',
        restriction_display: '4P',
        restriction_days: 'Daily',
        parking_type: 'Building',
        rating: 4.5,
        lat: -37.8183,
        lng: 144.9671
      },
      {
        id: 3,
        name: 'Bourke Street Mall',
        distance: 320,
        status: 'Occupied',
        restriction_display: '1P',
        restriction_days: 'Mon-Sat',
        parking_type: 'Street',
        rating: 3.8,
        lat: -37.8136,
        lng: 144.9584
      }
    ]
  } catch (error) {
    console.error('Error searching parking spots:', error)
    parkingSpots.value = []
  } finally {
    loading.value = false
  }
}

const sortResults = () => {
  // Sorting logic would be implemented here
  console.log('Sorting by:', sortBy.value)
}

const filterResults = () => {
  // Filtering logic is handled by computed property
  console.log('Filtering results')
}

const showOnMap = (spot) => {
  emit('showSpotOnMap', {
    lat: spot.lat,
    lng: spot.lng,
    name: getDisplayName(spot),
    spotId: spot.id
  })
  emit('navigate', 'map')
}

const getDirections = (spot) => {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`
  window.open(url, '_blank')
}

const resetSearch = () => {
  destination.value = ''
  parkingSpots.value = []
  searched.value = false
  sortBy.value = 'distance'
  statusFilter.value = 'all'
  distanceFilter.value = '300'
}

const increaseSearchRadius = () => {
  const currentRadius = parseInt(distanceFilter.value)
  if (currentRadius < 1000) {
    distanceFilter.value = currentRadius === 300 ? '500' : '1000'
  }
}

const formatTimeRestriction = (spot) => {
  const restriction = spot.restriction_display
  if (!restriction) return 'No time limit'
  
  // Parse restriction like "2P" to "2 hours"
  const match = restriction.match(/(\d+)P/)
  if (match) {
    return `${match[1]} hours`
  }
  
  return restriction
}

const getRestrictionClass = (restriction) => {
  if (!restriction) return 'no-restriction'
  
  const timeMatch = restriction.match(/(\d+)P/)
  if (timeMatch) {
    const hours = parseInt(timeMatch[1])
    if (hours <= 1) return 'short-term'
    if (hours <= 4) return 'medium-term'
    return 'long-term'
  }
  
  return 'standard'
}
</script>

<style scoped>
.parking-info-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
  background: #fafafa;
  min-height: calc(100vh - 65px);
  margin-top: 65px;
}

.info-header {
  text-align: center;
  margin-bottom: 40px;
}

.info-header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.info-header p {
  font-size: 1.1rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.search-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-bottom: 32px;
}

.search-form {
  display: flex;
  gap: 16px;
  align-items: end;
}

.form-group {
  flex: 1;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
  font-size: 0.875rem;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

.form-input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: #f9fafb;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  background: white;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 140px;
  justify-content: center;
}

.search-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

.search-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.filters-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.filters-row {
  display: flex;
  gap: 20px;
  align-items: center;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  font-size: 0.875rem;
  cursor: pointer;
}

.results-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.results-header h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.results-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.result-count {
  font-weight: 600;
  color: #059669;
}

.search-radius {
  font-size: 0.875rem;
  color: #6b7280;
}

.spots-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.spot-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  transition: all 0.2s ease;
  position: relative;
  background: white;
}

.spot-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.spot-card.best-option {
  border-color: #10b981;
  background: linear-gradient(135deg, #f0fdf4, #ffffff);
}

.spot-card.available {
  border-left: 4px solid #10b981;
}

.spot-card.occupied {
  border-left: 4px solid #ef4444;
  opacity: 0.8;
}

.spot-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.spot-info h4 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.spot-meta {
  display: flex;
  gap: 16px;
  align-items: center;
}

.distance {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.rating {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.875rem;
  color: #f59e0b;
  font-weight: 600;
}

.spot-status {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  font-weight: 600;
}

.status-indicator.available {
  color: #059669;
}

.status-indicator.occupied {
  color: #dc2626;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-indicator.available .status-dot {
  background: #10b981;
}

.status-indicator.occupied .status-dot {
  background: #ef4444;
}

.restriction-badge {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.restriction-badge.short-term {
  background: #fef3c7;
  color: #d97706;
}

.restriction-badge.medium-term {
  background: #dbeafe;
  color: #2563eb;
}

.restriction-badge.long-term {
  background: #dcfce7;
  color: #059669;
}

.restriction-badge.no-restriction {
  background: #f3f4f6;
  color: #6b7280;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
}

.spot-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.map-btn:hover {
  background: #eff6ff;
  border-color: #3b82f6;
  color: #3b82f6;
}

.directions-btn:hover {
  background: #f0fdf4;
  border-color: #10b981;
  color: #10b981;
}

.best-option-badge {
  position: absolute;
  top: -8px;
  right: 16px;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
}

.no-results {
  background: white;
  border-radius: 16px;
  padding: 60px 40px;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.no-results-icon {
  color: #9ca3af;
  margin-bottom: 24px;
}

.no-results h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 12px;
}

.no-results p {
  color: #6b7280;
  margin-bottom: 32px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.no-results-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.reset-btn, .expand-btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reset-btn {
  background: #3b82f6;
  color: white;
  border: none;
}

.reset-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.expand-btn {
  background: white;
  color: #3b82f6;
  border: 2px solid #3b82f6;
}

.expand-btn:hover {
  background: #3b82f6;
  color: white;
}

.loading-section {
  background: white;
  border-radius: 16px;
  padding: 60px 40px;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 24px;
}

.loading-progress {
  margin-top: 24px;
}

.progress-bar {
  width: 200px;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
  margin: 0 auto;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  animation: progress 2s ease-in-out infinite;
}

@keyframes progress {
  0% { width: 0%; }
  50% { width: 70%; }
  100% { width: 100%; }
}

@media (max-width: 768px) {
  .parking-info-container {
    padding: 20px 16px;
  }
  
  .info-header h2 {
    font-size: 2rem;
  }
  
  .search-form {
    flex-direction: column;
    gap: 20px;
  }
  
  .filters-row {
    flex-direction: column;
    gap: 16px;
  }
  
  .spot-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  
  .spot-status {
    align-items: flex-start;
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
  }
  
  .spot-actions {
    flex-direction: column;
  }
  
  .no-results-actions {
    flex-direction: column;
  }
}
</style>
