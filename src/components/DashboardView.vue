<template>
  <div class="mm-dashboard">
    <!-- Enhanced Header with Interactive Elements -->
    <div class="mm-header">
      <div class="header-content">
        <h1>Melbourne Metro Insights</h1>
        <p class="subtitle">Real-time analytics & trend analysis</p>
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
            <span class="stat-number">{{ currentDensity }}</span>
            <span class="stat-label">Density/1K</span>
          </div>
        </div>
      </div>
      <div class="header-actions">
        <div class="time-filter">
          <button 
            v-for="period in timePeriods" 
            :key="period.value"
            @click="selectedPeriod = period.value"
            :class="{ active: selectedPeriod === period.value }"
            class="period-btn"
          >
            {{ period.label }}
          </button>
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
        <h2>Trend Analysis</h2>
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

    <!-- Quick Actions Panel -->
    <section class="actions-section">
      <h2>Quick Actions</h2>
      <div class="actions-grid">
        <button class="action-btn" @click="exportData">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
          </svg>
          Export Data
        </button>
        <button class="action-btn" @click="generateReport">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10,9 9,9 8,9"/>
          </svg>
          Generate Report
        </button>
        <button class="action-btn" @click="shareInsights">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="18" cy="5" r="3"/>
            <circle cx="6" cy="12" r="3"/>
            <circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
          Share Insights
        </button>
        <button class="action-btn" @click="refreshData">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23,4 23,10 17,10"/>
            <polyline points="1,20 1,14 7,14"/>
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
          </svg>
          Refresh Data
        </button>
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

// Reactive data
const populationData = ref([])
const vehicleData = ref([])
const densityData = ref([])
const loading = ref(true)
const error = ref(null)
const selectedPeriod = ref('5y')
const chartView = ref('population')
const selectedYear = ref(2021)

// Time periods for filtering
const timePeriods = [
  { label: '1Y', value: '1y' },
  { label: '3Y', value: '3y' },
  { label: '5Y', value: '5y' },
  { label: 'All', value: 'all' }
]

// Available years for distribution analysis
const availableYears = [2017, 2018, 2019, 2020, 2021]

// Enhanced KPI data
const kpiData = computed(() => [
  {
    id: 1,
    label: 'Population Growth',
    value: '+3.3%',
    change: '+2.1%',
    subtitle: '2017-2021',
    trend: 'positive',
    progress: 75,
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    icon: 'PopulationIcon'
  },
  {
    id: 2,
    label: 'Vehicle Registrations',
    value: '-9.9%',
    change: '-20.1%',
    subtitle: 'From 2019 peak',
    trend: 'negative',
    progress: 45,
    gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
    icon: 'VehicleIcon'
  },
  {
    id: 3,
    label: 'Vehicle Density',
    value: '38.0',
    change: '-12.6%',
    subtitle: 'Per 1,000 people',
    trend: 'neutral',
    progress: 60,
    gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    icon: 'DensityIcon'
  },
  {
    id: 4,
    label: 'Utilization Rate',
    value: '39.7%',
    change: '+2.1%',
    subtitle: 'Current parking',
    trend: 'positive',
    progress: 40,
    gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    icon: 'UtilizationIcon'
  }
])

// Chart data based on selected view
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

  const labels = data.map(d => d.year)
  const values = data.map(d => 
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

// Current insights based on selected chart view
const currentInsights = computed(() => {
  const insights = {
    population: [
      {
        id: 1,
        title: 'Steady Growth',
        description: 'Population grew consistently until 2020, showing urban resilience',
        type: 'positive',
        icon: 'TrendUpIcon'
      },
      {
        id: 2,
        title: 'Recovery Signs',
        description: '2021 shows recovery from pandemic impacts with positive growth',
        type: 'info',
        icon: 'InfoIcon'
      }
    ],
    vehicles: [
      {
        id: 1,
        title: 'Peak Decline',
        description: 'Sharp decline from 2019 peak indicates changing mobility patterns',
        type: 'warning',
        icon: 'AlertIcon'
      },
      {
        id: 2,
        title: 'Remote Work Impact',
        description: '20% decline suggests successful adoption of alternative transport',
        type: 'positive',
        icon: 'CheckIcon'
      }
    ],
    density: [
      {
        id: 1,
        title: 'Low Urban Density',
        description: '38 vehicles per 1,000 people is well below typical urban levels',
        type: 'info',
        icon: 'InfoIcon'
      },
      {
        id: 2,
        title: 'Sustainable Trend',
        description: 'Declining density supports Melbourne\'s sustainability goals',
        type: 'positive',
        icon: 'LeafIcon'
      }
    ]
  }
  return insights[chartView.value] || []
})

// Distribution data
const distributionData = computed(() => ({
  labels: ['Street Parking', 'Building Parking', 'Underground', 'Surface Lots'],
  datasets: [{
    data: [45, 30, 15, 10],
    backgroundColor: ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'],
    borderWidth: 0,
    hoverOffset: 4
  }]
}))

const distributionOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  }
}

const breakdownData = computed(() => [
  { label: 'Street Parking', value: '45%', percentage: 45, color: '#3b82f6' },
  { label: 'Building Parking', value: '30%', percentage: 30, color: '#10b981' },
  { label: 'Underground', value: '15%', percentage: 15, color: '#8b5cf6' },
  { label: 'Surface Lots', value: '10%', percentage: 10, color: '#f59e0b' }
])

// Computed values for header
const totalPopulation = computed(() => {
  const latest = populationData.value[populationData.value.length - 1]
  return latest ? (latest.population_count / 1_000_000).toFixed(1) + 'M' : '4.9M'
})

const totalVehicles = computed(() => {
  const latest = vehicleData.value[vehicleData.value.length - 1]
  return latest ? (latest.count / 1_000).toFixed(0) + 'K' : '189K'
})

const currentDensity = computed(() => {
  const latest = densityData.value[densityData.value.length - 1]
  return latest ? latest.density.toFixed(1) : '38.0'
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

// Action methods
const exportData = () => {
  console.log('Exporting data...')
  // Implementation for data export
}

const generateReport = () => {
  console.log('Generating report...')
  // Implementation for report generation
}

const shareInsights = () => {
  console.log('Sharing insights...')
  // Implementation for sharing
}

const refreshData = () => {
  loadChartData()
}

onMounted(loadChartData)
</script>

<style scoped>
.mm-dashboard {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
  margin-top: 65px;
}

.mm-header {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h1 {
  margin: 0 0 8px 0;
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e293b, #475569);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  margin: 0 0 24px 0;
  color: #64748b;
  font-size: 1.1rem;
}

.header-stats {
  display: flex;
  gap: 32px;
}

.header-stat {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.header-actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.time-filter {
  display: flex;
  gap: 8px;
}

.period-btn {
  padding: 8px 16px;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.period-btn:hover {
  border-color: #3b82f6;
  transform: translateY(-2px);
}

.period-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.kpi-section {
  margin-bottom: 32px;
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

.trend-section, .distribution-section, .actions-section {
  background: white;
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
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

.actions-section h2 {
  margin: 0 0 24px 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.action-btn {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px 24px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

@media (max-width: 768px) {
  .mm-dashboard {
    padding: 16px;
  }
  
  .mm-header {
    flex-direction: column;
    gap: 24px;
    text-align: center;
  }
  
  .header-stats {
    justify-content: center;
  }
  
  .kpi-grid {
    grid-template-columns: 1fr;
  }
  
  .trend-insights {
    grid-template-columns: 1fr;
  }
  
  .distribution-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
}
</style>
