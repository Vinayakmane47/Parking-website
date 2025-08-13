<template>
  <div class="real-time-analytics">
    <div class="analytics-header">
      <h2>Real-Time Parking Analytics</h2>
      <div class="live-indicator">
        <span class="pulse"></span>
        Live Data
      </div>
    </div>

    <!-- Real-time Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" stroke-width="2"/>
            <circle cx="12" cy="9" r="2.5" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ totalSpots }}</div>
          <div class="stat-label">Total Spots</div>
        </div>
        <div class="stat-trend positive">+{{ newSpots }}</div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2"/>
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ availableSpots }}</div>
          <div class="stat-label">Available</div>
        </div>
        <div class="stat-trend positive">+{{ availableChange }}</div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ occupiedSpots }}</div>
          <div class="stat-label">Occupied</div>
        </div>
        <div class="stat-trend negative">-{{ occupiedChange }}</div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ utilizationRate }}%</div>
          <div class="stat-label">Utilization</div>
        </div>
        <div class="stat-trend" :class="utilizationTrend">{{ utilizationChange }}%</div>
      </div>
    </div>

    <!-- Hourly Usage Chart -->
    <div class="chart-section">
      <div class="chart-header">
        <h3>Hourly Parking Usage</h3>
        <div class="chart-controls">
          <button 
            @click="setTimeRange('today')" 
            :class="{ active: timeRange === 'today' }"
            class="time-btn"
          >
            Today
          </button>
          <button 
            @click="setTimeRange('week')" 
            :class="{ active: timeRange === 'week' }"
            class="time-btn"
          >
            Week
          </button>
          <button 
            @click="setTimeRange('month')" 
            :class="{ active: timeRange === 'month' }"
            class="time-btn"
          >
            Month
          </button>
        </div>
      </div>
      <div class="chart-container">
        <LineChart :data="hourlyData" :options="hourlyOptions" />
      </div>
    </div>

    <!-- Parking Type Distribution -->
    <div class="chart-section">
      <h3>Parking Type Distribution</h3>
      <div class="distribution-grid">
        <div class="pie-chart-container">
          <DoughnutChart :data="typeDistributionData" :options="pieOptions" />
        </div>
        <div class="distribution-legend">
          <div class="legend-item" v-for="item in typeLegend" :key="item.label">
            <div class="legend-color" :style="{ backgroundColor: item.color }"></div>
            <div class="legend-content">
              <div class="legend-label">{{ item.label }}</div>
              <div class="legend-value">{{ item.value }} spots</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity Feed -->
    <div class="activity-section">
      <h3>Recent Activity</h3>
      <div class="activity-feed">
        <div 
          v-for="activity in recentActivity" 
          :key="activity.id" 
          class="activity-item"
          :class="activity.type"
        >
          <div class="activity-icon">
            <svg v-if="activity.type === 'park'" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2"/>
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <div class="activity-content">
            <div class="activity-text">{{ activity.message }}</div>
            <div class="activity-time">{{ formatTime(activity.timestamp) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line as LineChart, Doughnut as DoughnutChart } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

// Reactive data
const totalSpots = ref(2047)
const availableSpots = ref(1234)
const occupiedSpots = ref(813)
const utilizationRate = ref(39.7)
const newSpots = ref(12)
const availableChange = ref(8)
const occupiedChange = ref(5)
const utilizationChange = ref(2.1)
const utilizationTrend = ref('positive')
const timeRange = ref('today')

// Activity feed
const recentActivity = ref([
  {
    id: 1,
    type: 'park',
    message: 'Vehicle parked at Collins Street Parking',
    timestamp: new Date(Date.now() - 2 * 60 * 1000)
  },
  {
    id: 2,
    type: 'leave',
    message: 'Vehicle left Flinders Street Station',
    timestamp: new Date(Date.now() - 5 * 60 * 1000)
  },
  {
    id: 3,
    type: 'park',
    message: 'Vehicle parked at Bourke Street Mall',
    timestamp: new Date(Date.now() - 8 * 60 * 1000)
  },
  {
    id: 4,
    type: 'leave',
    message: 'Vehicle left Docklands Parking',
    timestamp: new Date(Date.now() - 12 * 60 * 1000)
  }
])

// Chart data
const hourlyData = computed(() => {
  // Different data sets for different time ranges
  const dataSets = {
    today: {
      labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
      available: [1800, 1750, 1200, 800, 600, 1400],
      occupied: [247, 297, 847, 1247, 1447, 647]
    },
    week: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      available: [1600, 1550, 1400, 1300, 1100, 1800, 1900],
      occupied: [447, 497, 647, 747, 947, 247, 147]
    },
    month: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      available: [1500, 1400, 1600, 1700],
      occupied: [547, 647, 447, 347]
    }
  }

  const currentData = dataSets[timeRange.value] || dataSets.today

  return {
    labels: currentData.labels,
    datasets: [
      {
        label: 'Available Spots',
        data: currentData.available,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Occupied Spots',
        data: currentData.occupied,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }
})

const hourlyOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top'
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      max: timeRange.value === 'month' ? 2500 : 2000
    }
  }
}

const typeDistributionData = computed(() => ({
  labels: ['Street Parking', 'Building Parking', 'Underground', 'Surface Lots'],
  datasets: [
    {
      data: [45, 30, 15, 10],
      backgroundColor: [
        '#3b82f6',
        '#10b981',
        '#8b5cf6',
        '#f59e0b'
      ],
      borderWidth: 2,
      borderColor: '#ffffff'
    }
  ]
}))

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  }
}

const typeLegend = computed(() => [
  { label: 'Street Parking', value: 921, color: '#3b82f6' },
  { label: 'Building Parking', value: 614, color: '#10b981' },
  { label: 'Underground', value: 307, color: '#8b5cf6' },
  { label: 'Surface Lots', value: 205, color: '#f59e0b' }
])

// Methods
const setTimeRange = (range) => {
  timeRange.value = range
  console.log(`Time range changed to: ${range}`)
  // The chart will automatically update due to computed reactivity
}

const formatTime = (timestamp) => {
  const now = new Date()
  const diff = now - timestamp
  const minutes = Math.floor(diff / (1000 * 60))
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

// Simulate real-time updates
let updateInterval

onMounted(() => {
  updateInterval = setInterval(() => {
    // Simulate real-time data updates
    const change = Math.floor(Math.random() * 10) - 5
    availableSpots.value = Math.max(0, availableSpots.value + change)
    occupiedSpots.value = Math.max(0, occupiedSpots.value - change)
    utilizationRate.value = Math.round((occupiedSpots.value / totalSpots.value) * 100 * 10) / 10
    
    // Add new activity
    if (Math.random() > 0.7) {
      const newActivity = {
        id: Date.now(),
        type: Math.random() > 0.5 ? 'park' : 'leave',
        message: `Vehicle ${Math.random() > 0.5 ? 'parked at' : 'left'} ${['Collins Street', 'Flinders Street', 'Bourke Street', 'Docklands'][Math.floor(Math.random() * 4)]}`,
        timestamp: new Date()
      }
      recentActivity.value.unshift(newActivity)
      if (recentActivity.value.length > 10) {
        recentActivity.value.pop()
      }
    }
  }, 5000) // Update every 5 seconds
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
})
</script>

<style scoped>
.real-time-analytics {
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.analytics-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.analytics-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}

.live-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #059669;
}

.pulse {
  width: 8px;
  height: 8px;
  background-color: #059669;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(5, 150, 105, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(5, 150, 105, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(5, 150, 105, 0);
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.stat-trend {
  font-size: 0.875rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
}

.stat-trend.positive {
  color: #059669;
  background: #f0fdf4;
}

.stat-trend.negative {
  color: #dc2626;
  background: #fef2f2;
}

.chart-section {
  margin-bottom: 32px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.chart-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.chart-controls {
  display: flex;
  gap: 8px;
}

.time-btn {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.time-btn:hover {
  background: #f9fafb;
}

.time-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.chart-container {
  height: 300px;
  background: #f8fafc;
  border-radius: 12px;
  padding: 16px;
}

.distribution-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: center;
}

.pie-chart-container {
  height: 250px;
}

.distribution-legend {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 8px;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.legend-content {
  flex: 1;
}

.legend-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.legend-value {
  font-size: 0.75rem;
  color: #6b7280;
}

.activity-section h3 {
  margin: 0 0 16px 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.activity-feed {
  max-height: 300px;
  overflow-y: auto;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: background-color 0.2s ease;
}

.activity-item:hover {
  background: #f8fafc;
}

.activity-item.park {
  border-left: 4px solid #10b981;
}

.activity-item.leave {
  border-left: 4px solid #ef4444;
}

.activity-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.activity-item.park .activity-icon {
  background: #10b981;
}

.activity-item.leave .activity-icon {
  background: #ef4444;
}

.activity-content {
  flex: 1;
}

.activity-text {
  font-size: 0.875rem;
  color: #374151;
  margin-bottom: 2px;
}

.activity-time {
  font-size: 0.75rem;
  color: #6b7280;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .distribution-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .chart-controls {
    width: 100%;
    justify-content: space-between;
  }
}
</style> 