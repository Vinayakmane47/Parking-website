// MapBox Configuration File
// 
// Steps to get MapBox access token:
// 1. Visit https://www.mapbox.com/
// 2. Register an account (free)
// 3. Create access token in Dashboard
// 4. Replace the placeholder below with your actual token

export const MAPBOX_CONFIG = {
  // MapBox access token - ensure it's always available
  accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 
               import.meta.env.VITE_MAPBOX_TOKEN || 
               'pk.eyJ1Ijoid3hsMTIzNzg5IiwiYSI6ImNtZHlid2h1bDAwYmEya3BzMmpvbGFzb2UifQ.PNnx74NZhnHUfa5d1Q_c3w',
  
  // Map style options
  styles: {
    streets: 'mapbox://styles/mapbox/streets-v12',
    satellite: 'mapbox://styles/mapbox/satellite-v9',
    outdoors: 'mapbox://styles/mapbox/outdoors-v12',
    light: 'mapbox://styles/mapbox/light-v11',
    dark: 'mapbox://styles/mapbox/dark-v11'
  },
  
  // Melbourne center coordinates
  melbourne: {
    center: [144.9631, -37.8136],
    zoom: 12
  }
}

// Backend API configuration - supports multi-environment deployment
export const BACKEND_CONFIG = {
  // Auto-detect backend URL - supports environment variables or defaults to local
  baseURL: import.meta.env.VITE_BACKEND_URL || 
           (import.meta.env.PROD ? 'https://park-with-us.up.railway.app' : 'http://localhost:3001'),
  
  // API endpoints
  endpoints: {
    parking: '/api/parking',
    parkingRefresh: '/api/parking/refresh',
    parkingStats: '/api/parking/stats/overview',
    health: '/health'
  },
  
  // Supported backend environments
  environments: {
    local: 'http://localhost:3001',
    staging: 'https://parking-api-staging.railway.app',
    production: 'https://park-with-us.up.railway.app',
    custom: import.meta.env.VITE_BACKEND_URL
  }
}