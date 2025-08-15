<template>
  <div class="mm-dashboard">
    <!-- Top Section: Navigation Header -->
    <div class="top-header">
      <div class="nav-container">
        <div class="nav-buttons">
          <button @click="navigateToHome" class="nav-btn home" title="Home">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9,22 9,12 15,12 15,22"/>
            </svg>
            Home
          </button>
          <button class="nav-btn active" title="Data Insights">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 20V10"/>
              <path d="M12 20V4"/>
              <path d="M6 20v-6"/>
            </svg>
            Data Insights
          </button>
          <button @click="navigateToMap" class="nav-btn map" title="Map">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              <circle cx="12" cy="9" r="2.5"/>
            </svg>
            Map
          </button>
          <button @click="navigateToInfrastructure" class="nav-btn infrastructure" title="Infrastructure">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 3v18h18"/>
              <path d="M9 9h6v6H9z"/>
              <path d="M9 3v6"/>
              <path d="M15 3v6"/>
              <path d="M3 9h6"/>
              <path d="M15 9h6"/>
            </svg>
            Infrastructure
          </button>
        </div>
      </div>
    </div>

    <!-- Enhanced Header with Interactive Elements -->
    <div class="mm-header">
      <div class="header-content">
        <div class="header-left">
          <h1>Melbourne Metro Insights</h1>
          <p class="subtitle">Real-time analytics & trend analysis</p>
        </div>

        <div class="header-stats">
          <div class="header-stat">
            <span class="stat-number">{{ totalPopulation }}</span>
            <span class="stat-label">Population</span>
          </div>
          <div class="header-stat">
            <span class="stat-number">{{ totalVehicles }}</span>
            <span class="stat-label">Vehicles</span>
          </div>
          <div class="header-stat">
            <span class="stat-number">{{ totalParkingSpots }}</span>
            <span class="stat-label">Parking Spots</span>
          </div>
        </div>
      </div>

    </div>

    <!-- Real-Time Analytics Component -->
    <RealTimeAnalytics />

    <!-- Enhanced KPI Cards with Animations -->
    <section class="kpi-section">
      <div class="kpi-grid">
        <div class="kpi-card enhanced" v-for="kpi in kpiData" :key="kpi.id">
          <div class="kpi-icon" :style="{ background: kpi.gradient }">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path v-if="kpi.id === 1" d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle v-if="kpi.id === 1" cx="9" cy="7" r="4"/>
              <path v-if="kpi.id === 2" d="M19 17h2c.6 0 1-.4 1-1v-3c0-.6-.4-1-1-1h-2"/>
              <path v-if="kpi.id === 2" d="M5 17H3c-.6 0-1-.4-1-1v-3c0-.6.4-1 1-1h2"/>
              <path v-if="kpi.id === 2" d="M3 9h18"/>
              <path v-if="kpi.id === 3" d="M3 3v18h18"/>
              <path v-if="kpi.id === 3" d="M9 9h6v6H9z"/>
              <path v-if="kpi.id === 4" d="M12 2v20M2 12h20"/>
            </svg>
      </div>
          <div class="kpi-content">
            <div class="kpi-main">
              <span class="kpi-value" :class="kpi.trend">{{ kpi.value }}</span>
              <span class="kpi-change" :class="kpi.trend">{{ kpi.change }}</span>
      </div>
            <div class="kpi-label">{{ kpi.label }}</div>
            <div class="kpi-subtitle">{{ kpi.subtitle }}</div>
        </div>
          <div class="kpi-chart">
            <div class="mini-chart" :style="{ '--progress': kpi.progress + '%' }"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Interactive Trend Analysis -->
    <section class="trend-section">
      <div class="section-header">
        <h2>Trend Analysis 
          <span class="period-indicator" v-if="selectedPeriod !== 'all'">
            ({{ selectedPeriod.toUpperCase() }})
          </span>
        </h2>
        <div class="view-toggle">
          <button 
            @click="chartView = 'population'"
            :class="{ active: chartView === 'population' }"
            class="toggle-btn"
          >
            Population
          </button>
          <button 
            @click="chartView = 'vehicles'"
            :class="{ active: chartView === 'vehicles' }"
            class="toggle-btn"
          >
            Vehicles
          </button>
          <button 
            @click="chartView = 'density'"
            :class="{ active: chartView === 'density' }"
            class="toggle-btn"
          >
            Density
          </button>
      </div>
      </div>

      <div class="chart-container">
        <LineChart :data="currentChartData" :options="enhancedChartOptions" />
      </div>

      <div class="trend-insights">
        <div class="insight-card" v-for="insight in currentInsights" :key="insight.id">
          <div class="insight-icon" :class="insight.type">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path v-if="insight.type === 'positive'" d="M23 6l-9.5 9.5-5-5L1 18"/>
              <path v-if="insight.type === 'negative'" d="M18 6L6 18M6 6l12 12"/>
              <path v-if="insight.type === 'warning'" d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line v-if="insight.type === 'warning'" x1="12" y1="9" x2="12" y2="13"/>
              <line v-if="insight.type === 'warning'" x1="12" y1="17" x2="12.01" y2="17"/>
              <circle v-if="insight.type === 'info'" cx="12" cy="12" r="10"/>
              <path v-if="insight.type === 'info'" d="M12 16v-4M12 8h.01"/>
            </svg>
          </div>
          <div class="insight-content">
            <h4>{{ insight.title }}</h4>
            <p>{{ insight.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Enhanced Distribution Analysis -->
    <section class="distribution-section">
      <div class="section-header">
        <h2>Distribution Analysis</h2>
        <div class="filter-controls">
          <select v-model="selectedYear" class="year-select">
            <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
          </select>
        </div>
      </div>

      <div class="distribution-grid">
        <div class="distribution-chart">
          <DoughnutChart :data="distributionData" :options="distributionOptions" />
          </div>
        <div class="distribution-breakdown">
          <div class="breakdown-item" v-for="item in breakdownData" :key="item.label">
            <div class="breakdown-header">
              <div class="breakdown-color" :style="{ background: item.color }"></div>
              <span class="breakdown-label">{{ item.label }}</span>
              <span class="breakdown-value">{{ item.value }}</span>
            </div>
            <div class="breakdown-bar">
              <div class="bar-fill" :style="{ width: item.percentage + '%', background: item.color }"></div>
            </div>
          </div>
        </div>
      </div>
    </section>


  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import RealTimeAnalytics from './RealTimeAnalytics.vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js'
import { Line as LineChart, Bar as BarChart, Doughnut as DoughnutChart } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
)

// Define emits
const emit = defineEmits(['navigate'])

// Reactive data
const populationData = ref([])
const vehicleData = ref([])
const densityData = ref([])
const loading = ref(true)
const error = ref(null)
const selectedPeriod = ref('5y')
const chartView = ref('population')
const selectedYear = ref(2021)



// Available years for distribution analysis
const availableYears = [2017, 2018, 2019, 2020, 2021]

// Enhanced KPI data based on selected time period
const kpiData = computed(() => {
  const currentYear = new Date().getFullYear()
  let periodLabel = ''
  let periodYears = 0
  
  switch (selectedPeriod.value) {
    case '1y':
      periodLabel = `${currentYear - 1}-${currentYear}`
      periodYears = 1
      break
    case '3y':
      periodLabel = `${currentYear - 3}-${currentYear}`
      periodYears = 3
      break
    case '5y':
      periodLabel = `${currentYear - 5}-${currentYear}`
      periodYears = 5
      break
    case 'all':
      periodLabel = '2017-2021'
      periodYears = 5
      break
    default:
      periodLabel = `${currentYear - 5}-${currentYear}`
      periodYears = 5
  }

  return [
    {
      id: 1,
      label: 'Population Growth',
      value: periodYears === 1 ? '+1.2%' : periodYears === 3 ? '+2.8%' : '+3.3%',
      change: periodYears === 1 ? '+1.2%' : periodYears === 3 ? '+2.8%' : '+2.1%',
      subtitle: periodLabel,
      trend: 'positive',
      progress: periodYears === 1 ? 60 : periodYears === 3 ? 70 : 75,
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
      icon: 'PopulationIcon'
    },
    {
      id: 2,
      label: 'Vehicle Registrations',
      value: periodYears === 1 ? '-5.2%' : periodYears === 3 ? '-7.8%' : '-9.9%',
      change: periodYears === 1 ? '-5.2%' : periodYears === 3 ? '-7.8%' : '-20.1%',
      subtitle: periodYears === 1 ? 'Last year' : periodYears === 3 ? 'Last 3 years' : 'From 2019 peak',
      trend: 'negative',
      progress: periodYears === 1 ? 55 : periodYears === 3 ? 50 : 45,
      gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
      icon: 'VehicleIcon'
    },
    {
      id: 3,
      label: 'Vehicle Density',
      value: periodYears === 1 ? '37.2' : periodYears === 3 ? '38.5' : '38.0',
      change: periodYears === 1 ? '-2.1%' : periodYears === 3 ? '-8.2%' : '-12.6%',
      subtitle: 'Per 1,000 people',
      trend: 'neutral',
      progress: periodYears === 1 ? 65 : periodYears === 3 ? 62 : 60,
      gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      icon: 'DensityIcon'
    },
    {
      id: 4,
      label: 'Utilization Rate',
      value: periodYears === 1 ? '41.2%' : periodYears === 3 ? '40.1%' : '39.7%',
      change: periodYears === 1 ? '+3.2%' : periodYears === 3 ? '+2.8%' : '+2.1%',
      subtitle: 'Current parking',
      trend: 'positive',
      progress: periodYears === 1 ? 45 : periodYears === 3 ? 42 : 40,
      gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      icon: 'UtilizationIcon'
    }
  ]
})

// Chart data based on selected view and time period
const currentChartData = computed(() => {
  const data = chartView.value === 'population' ? populationData.value :
               chartView.value === 'vehicles' ? vehicleData.value :
               densityData.value

  // Ensure we have data and extract labels and values correctly
  if (!data || data.length === 0) {
    // Return empty chart data if no data available
    return {
      labels: [],
      datasets: [{
        label: chartView.value === 'population' ? 'Population (millions)' :
               chartView.value === 'vehicles' ? 'Vehicles (thousands)' :
               'Density per 1,000',
        data: [],
        borderColor: chartView.value === 'population' ? '#3b82f6' :
                    chartView.value === 'vehicles' ? '#ef4444' :
                    '#10b981',
        backgroundColor: chartView.value === 'population' ? 'rgba(59, 130, 246, 0.1)' :
                        chartView.value === 'vehicles' ? 'rgba(239, 68, 68, 0.1)' :
                        'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 3
      }]
    }
  }

  // Filter data based on selected time period
  let filteredData = [...data]
  const currentYear = new Date().getFullYear()
  
  switch (selectedPeriod.value) {
    case '1y':
      filteredData = data.filter(d => d.year >= currentYear - 1)
      break
    case '3y':
      filteredData = data.filter(d => d.year >= currentYear - 3)
      break
    case '5y':
      filteredData = data.filter(d => d.year >= currentYear - 5)
      break
    case 'all':
      // Use all data (no filtering)
      break
    default:
      // Default to 5y if invalid selection
      filteredData = data.filter(d => d.year >= currentYear - 5)
  }

  const labels = filteredData.map(d => d.year)
  const values = filteredData.map(d => 
    chartView.value === 'population' ? d.population_count / 1_000_000 :
    chartView.value === 'vehicles' ? d.count / 1_000 :
    d.density
  )

  return {
    labels,
    datasets: [{
      label: chartView.value === 'population' ? 'Population (millions)' :
             chartView.value === 'vehicles' ? 'Vehicles (thousands)' :
             'Density per 1,000',
      data: values,
      borderColor: chartView.value === 'population' ? '#3b82f6' :
                  chartView.value === 'vehicles' ? '#ef4444' :
                  '#10b981',
      backgroundColor: chartView.value === 'population' ? 'rgba(59, 130, 246, 0.1)' :
                      chartView.value === 'vehicles' ? 'rgba(239, 68, 68, 0.1)' :
                      'rgba(16, 185, 129, 0.1)',
      fill: true,
      tension: 0.4,
      borderWidth: 3
    }]
  }
})

// Enhanced chart options
const enhancedChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top'
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      borderColor: '#3b82f6',
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: false
    }
  },
  scales: {
    y: {
      beginAtZero: false,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      },
      ticks: {
        color: '#6b7280'
      },
      title: {
        display: true,
        text: chartView.value === 'population' ? 'Population (millions)' :
              chartView.value === 'vehicles' ? 'Vehicles (thousands)' :
              'Density per 1,000',
        color: '#6b7280'
      }
    },
    x: {
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      },
      ticks: {
        color: '#6b7280'
      },
      title: {
        display: true,
        text: 'Year',
        color: '#6b7280'
      }
    }
  },
  elements: {
    point: {
      radius: 6,
      hoverRadius: 8,
      backgroundColor: '#ffffff',
      borderWidth: 2
    }
  }
}))

// Current insights based on selected chart view and time period
const currentInsights = computed(() => {
  const currentYear = new Date().getFullYear()
  let periodYears = 0
  
  switch (selectedPeriod.value) {
    case '1y':
      periodYears = 1
      break
    case '3y':
      periodYears = 3
      break
    case '5y':
      periodYears = 5
      break
    case 'all':
      periodYears = 5
      break
    default:
      periodYears = 5
  }

  const insights = {
    population: [
      {
        id: 1,
        title: periodYears === 1 ? 'Recent Growth' : periodYears === 3 ? 'Steady Growth' : 'Long-term Growth',
        description: periodYears === 1 ? 'Population shows positive growth in the last year' : 
                    periodYears === 3 ? 'Consistent population growth over the past 3 years' :
                    'Population grew consistently until 2020, showing urban resilience',
        type: 'positive',
        icon: 'TrendUpIcon'
      },
      {
        id: 2,
        title: periodYears === 1 ? 'Current Trends' : 'Recovery Signs',
        description: periodYears === 1 ? 'Recent data indicates continued urban development' :
                    '2021 shows recovery from pandemic impacts with positive growth',
        type: 'info',
        icon: 'InfoIcon'
      }
    ],
    vehicles: [
      {
        id: 1,
        title: periodYears === 1 ? 'Recent Decline' : 'Peak Decline',
        description: periodYears === 1 ? 'Vehicle registrations decreased in the last year' :
                    'Sharp decline from 2019 peak indicates changing mobility patterns',
        type: 'warning',
        icon: 'AlertIcon'
      },
      {
        id: 2,
        title: periodYears === 1 ? 'Mobility Shift' : 'Remote Work Impact',
        description: periodYears === 1 ? 'Recent decline suggests changing transport preferences' :
                    '20% decline suggests successful adoption of alternative transport',
        type: 'positive',
        icon: 'CheckIcon'
      }
    ],
    density: [
      {
        id: 1,
        title: 'Low Urban Density',
        description: periodYears === 1 ? 'Current density remains below typical urban levels' :
                    '38 vehicles per 1,000 people is well below typical urban levels',
        type: 'info',
        icon: 'InfoIcon'
      },
      {
        id: 2,
        title: 'Sustainable Trend',
        description: periodYears === 1 ? 'Recent density trends support sustainability goals' :
                    'Declining density supports Melbourne\'s sustainability goals',
        type: 'positive',
        icon: 'LeafIcon'
      }
    ]
  }
  return insights[chartView.value] || []
})

// Helper function to generate year-based distribution data
const getDistributionForYear = (year) => {
  // Generate realistic year-based parking distribution data
  const yearData = {
    2017: { street: 42, building: 28, underground: 18, surface: 12 },
    2018: { street: 43, building: 29, underground: 17, surface: 11 },
    2019: { street: 45, building: 30, underground: 15, surface: 10 },
    2020: { street: 47, building: 31, underground: 14, surface: 8 },
    2021: { street: 48, building: 32, underground: 13, surface: 7 }
  }
  
  return yearData[year] || yearData[2021]
}

// Distribution data - now reactive to selected year
const distributionData = computed(() => {
  const yearDistribution = getDistributionForYear(selectedYear.value)
  const { street, building, underground, surface } = yearDistribution
  
  return {
    labels: ['Street Parking', 'Building Parking', 'Underground', 'Surface Lots'],
    datasets: [{
      data: [street, building, underground, surface],
      backgroundColor: ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'],
      borderWidth: 0,
      hoverOffset: 4
    }]
  }
})

const distributionOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  }
}

const breakdownData = computed(() => {
  const yearDistribution = getDistributionForYear(selectedYear.value)
  const { street, building, underground, surface } = yearDistribution
  
  return [
    { label: 'Street Parking', value: `${street}%`, percentage: street, color: '#3b82f6' },
    { label: 'Building Parking', value: `${building}%`, percentage: building, color: '#10b981' },
    { label: 'Underground', value: `${underground}%`, percentage: underground, color: '#8b5cf6' },
    { label: 'Surface Lots', value: `${surface}%`, percentage: surface, color: '#f59e0b' }
  ]
})

// Computed values for header based on selected time period
const totalPopulation = computed(() => {
  const currentYear = new Date().getFullYear()
  let filteredData = [...populationData.value]
  
  switch (selectedPeriod.value) {
    case '1y':
      filteredData = populationData.value.filter(d => d.year >= currentYear - 1)
      break
    case '3y':
      filteredData = populationData.value.filter(d => d.year >= currentYear - 3)
      break
    case '5y':
      filteredData = populationData.value.filter(d => d.year >= currentYear - 5)
      break
    case 'all':
      // Use all data
      break
  }
  
  const latest = filteredData[filteredData.length - 1]
  return latest ? (latest.population_count / 1_000_000).toFixed(1) + 'M' : '4.9M'
})

const totalVehicles = computed(() => {
  const currentYear = new Date().getFullYear()
  let filteredData = [...vehicleData.value]
  
  switch (selectedPeriod.value) {
    case '1y':
      filteredData = vehicleData.value.filter(d => d.year >= currentYear - 1)
      break
    case '3y':
      filteredData = vehicleData.value.filter(d => d.year >= currentYear - 3)
      break
    case '5y':
      filteredData = vehicleData.value.filter(d => d.year >= currentYear - 5)
      break
    case 'all':
      // Use all data
      break
  }
  
  const latest = filteredData[filteredData.length - 1]
  return latest ? (latest.count / 1_000).toFixed(0) + 'K' : '189K'
})

const currentDensity = computed(() => {
  const currentYear = new Date().getFullYear()
  let filteredData = [...densityData.value]
  
  switch (selectedPeriod.value) {
    case '1y':
      filteredData = densityData.value.filter(d => d.year >= currentYear - 1)
      break
    case '3y':
      filteredData = densityData.value.filter(d => d.year >= currentYear - 3)
      break
    case '5y':
      filteredData = densityData.value.filter(d => d.year >= currentYear - 5)
      break
    case 'all':
      // Use all data
      break
  }
  
  const latest = filteredData[filteredData.length - 1]
  return latest ? latest.density.toFixed(1) : '38.0'
})

// Parking spots count - always show the full count
const totalParkingSpots = computed(() => {
  return '3,309'
})

// Load data from API
const loadChartData = async () => {
  try {
    loading.value = true
    
    const response = await fetch('/api/chart-data')
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Non-JSON response from API')
    }
    
    const result = await response.json()
    
    // Check if API response is successful
    if (response.ok && result.success && result.data) {
      populationData.value = result.data.population || []
      vehicleData.value = result.data.vehicle || []
      densityData.value = result.data.density || []
    } else {
      throw new Error('API returned unsuccessful response')
    }
    
  } catch (err) {
    error.value = err.message
    
    // Always load fallback data on any error
    populationData.value = [
      { year: 2017, population_count: 4818100 },
      { year: 2018, population_count: 4913138 },
      { year: 2019, population_count: 5001917 },
      { year: 2020, population_count: 5054839 },
      { year: 2021, population_count: 4976157 }
    ]
    vehicleData.value = [
      { year: 2017, count: 209495 },
      { year: 2018, count: 214408 },
      { year: 2019, count: 236429 },
      { year: 2020, count: 215728 },
      { year: 2021, count: 188855 }
    ]
    densityData.value = [
      { year: 2017, density: 43.5 },
      { year: 2018, density: 43.2 },
      { year: 2019, density: 47.3 },
      { year: 2020, density: 41.0 },
      { year: 2021, density: 38.0 }
    ]
  } finally {
    loading.value = false
  }
  
}



// Navigation methods
const navigateToHome = () => {
  emit('navigate', 'home')
}

const navigateToMap = () => {
  emit('navigate', 'map')
}

const navigateToInfrastructure = () => {
  emit('navigate', 'infrastructure')
}

onMounted(loadChartData)
</script>

<style scoped>
.mm-dashboard {
  width: 100%;
  margin: 0;
  padding: 0;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
  margin-top: 65px;
}

.top-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  z-index: 1000;
  padding: 8px 16px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.nav-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-buttons {
  display: flex;
  gap: 8px;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  color: #374151;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.nav-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  transform: translateY(-1px);
}

.nav-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.nav-btn.active:hover {
  background: #2563eb;
}

.nav-btn.home {
  color: #059669;
  border-color: #d1fae5;
  background: #f0fdf4;
}

.nav-btn.home:hover {
  background: #d1fae5;
  color: #047857;
}

.nav-btn.map {
  color: #d97706;
  border-color: #fef3c7;
  background: #fffbeb;
}

.nav-btn.map:hover {
  background: #fef3c7;
  color: #d97706;
}

.nav-btn.infrastructure {
  color: #8b5cf6;
  border-color: #ede9fe;
  background: #faf5ff;
}

.nav-btn.infrastructure:hover {
  background: #ede9fe;
  color: #7c3aed;
}

.mm-header {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 0;
  padding: 32px;
  margin-top: 60px;
  margin-bottom: 0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 24px;
  width: 100%;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  flex-wrap: wrap;
  gap: 24px;
}

.header-left {
  flex: 1;
  min-width: 300px;
}

.header-left h1 {
  margin: 0 0 8px 0;
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e293b, #475569);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}

.subtitle {
  margin: 0 0 24px 0;
  color: #64748b;
  font-size: 1.1rem;
}

.header-stats {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  justify-content: center;
  min-width: 300px;
}

.header-stat {
  text-align: center;
  min-width: 80px;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.2;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 4px;
}



.kpi-section {
  margin-bottom: 0;
  padding: 24px 32px;
  background: white;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.kpi-card.enhanced {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.kpi-card.enhanced:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.kpi-card.enhanced::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--gradient, linear-gradient(135deg, #3b82f6, #1d4ed8));
}

.kpi-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.kpi-content {
  flex: 1;
}

.kpi-main {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 8px;
}

.kpi-value {
  font-size: 2rem;
  font-weight: 800;
}

.kpi-value.positive { color: #059669; }
.kpi-value.negative { color: #dc2626; }
.kpi-value.neutral { color: #3b82f6; }

.kpi-change {
  font-size: 0.875rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 8px;
}

.kpi-change.positive {
  background: #f0fdf4;
  color: #059669;
}

.kpi-change.negative {
  background: #fef2f2;
  color: #dc2626;
}

.kpi-change.neutral {
  background: #eff6ff;
  color: #3b82f6;
}

.kpi-label {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.kpi-subtitle {
  font-size: 0.875rem;
  color: #64748b;
}

.kpi-chart {
  width: 80px;
  height: 40px;
  position: relative;
}

.mini-chart {
  width: 100%;
  height: 100%;
  background: #f1f5f9;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
}

.mini-chart::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: var(--progress);
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  border-radius: 20px;
  transition: width 0.3s ease;
}

.trend-section, .distribution-section {
  background: white;
  border-radius: 0;
  padding: 32px;
  margin-bottom: 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  width: 100%;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 8px;
}

.period-indicator {
  font-size: 0.875rem;
  font-weight: 500;
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.view-toggle, .filter-controls {
  display: flex;
  gap: 8px;
}

.toggle-btn {
  padding: 8px 16px;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-btn:hover {
  border-color: #3b82f6;
}

.toggle-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.year-select {
  padding: 8px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  font-weight: 600;
  cursor: pointer;
}

.chart-container {
  height: 400px;
  margin-bottom: 24px;
}

.trend-insights {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.insight-card {
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
}

.insight-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.insight-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
}

.insight-icon.positive { background: #10b981; }
.insight-icon.negative { background: #ef4444; }
.insight-icon.warning { background: #f59e0b; }
.insight-icon.info { background: #3b82f6; }

.insight-content h4 {
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
}

.insight-content p {
  margin: 0;
  color: #64748b;
  line-height: 1.5;
}

.distribution-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  align-items: start;
}

.distribution-chart {
  height: 300px;
}

.distribution-breakdown {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.breakdown-item {
  background: #f8fafc;
  border-radius: 12px;
  padding: 16px;
}

.breakdown-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.breakdown-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.breakdown-label {
  flex: 1;
  font-weight: 600;
  color: #1e293b;
}

.breakdown-value {
  font-weight: 700;
  color: #3b82f6;
}

.breakdown-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}



/* Responsive Design */
@media (max-width: 1024px) {
  .top-header {
    padding: 6px 12px;
  }

  .nav-buttons {
    gap: 6px;
  }

  .nav-btn {
    padding: 5px 8px;
    font-size: 0.7rem;
  }

  .mm-header {
    margin-top: 50px;
    padding: 20px;
  }

  .header-content {
    gap: 16px;
  }
  
  .header-left h1 {
    font-size: 1.8rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }

  .header-stats {
    min-width: auto;
    width: 100%;
    justify-content: center;
    gap: 20px;
  }
  
  .header-stat {
    min-width: auto;
    width: 100%;
  }
  

}

@media (max-width: 768px) {
  .top-header {
    padding: 5px 10px;
  }

  .nav-buttons {
    gap: 4px;
  }

  .nav-btn {
    padding: 4px 6px;
    font-size: 0.65rem;
  }

  .mm-header {
    margin-top: 45px;
    padding: 16px;
    gap: 16px;
  }
  
  .header-content {
    gap: 16px;
  }
  
  .header-left h1 {
    font-size: 1.5rem;
  }
  
  .subtitle {
    font-size: 0.9rem;
  }
  
  .header-stats {
    gap: 12px;
  }
  
  .header-stat {
    text-align: center;
  }
  
  .stat-number {
    font-size: 1.2rem;
  }
  
  .stat-label {
    font-size: 0.8rem;
  }
  

}

@media (max-width: 480px) {
  .top-header {
    padding: 4px 6px;
  }

  .nav-buttons {
    flex-direction: column;
    gap: 2px;
  }

  .nav-btn {
    width: 100%;
    justify-content: center;
    padding: 3px 4px;
    font-size: 0.6rem;
  }

  .mm-header {
    margin-top: 40px;
    padding: 12px;
    gap: 12px;
  }
  
  .header-content {
    gap: 12px;
  }
  
  .header-left h1 {
    font-size: 1.2rem;
  }
  
  .subtitle {
    font-size: 0.8rem;
  }
  
  .header-stats {
    flex-direction: column;
    gap: 8px;
  }
  
  .header-stat {
    text-align: center;
  }
  
  .stat-number {
    font-size: 1rem;
  }
  
  .stat-label {
    font-size: 0.7rem;
  }
  

}
</style>
