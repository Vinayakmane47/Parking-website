<template>
  <div class="home-page">
    <!-- Animated Background -->
    <div class="animated-background">
      <div class="gradient-overlay"></div>
      <div class="particles">
        <div class="particle" v-for="n in 20" :key="n" :style="{ 
          left: Math.random() * 100 + '%', 
          animationDelay: Math.random() * 10 + 's',
          animationDuration: (Math.random() * 10 + 10) + 's'
        }"></div>
      </div>
    </div>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            <span class="title-line">Smart Parking</span>
            <span class="title-line">Melbourne</span>
          </h1>
          <p class="hero-subtitle">Real-time parking insights for a smarter city experience</p>
          
          <!-- Live Stats -->
          <div class="live-stats">
            <div class="stat-badge">
              <div class="stat-pulse"></div>
              <span class="stat-value">{{ liveStats.total }}</span>
              <span class="stat-label">Total Spots</span>
            </div>
            <div class="stat-badge">
              <div class="stat-pulse"></div>
              <span class="stat-value">{{ liveStats.available }}</span>
              <span class="stat-label">Available</span>
            </div>
            <div class="stat-badge">
              <div class="stat-pulse"></div>
              <span class="stat-value">{{ liveStats.utilization }}%</span>
              <span class="stat-label">Utilization</span>
            </div>
          </div>
        </div>

        <!-- Smart Navigation Cards -->
        <div class="smart-nav">
          <div class="nav-card primary" @click="navigateToMap">
            <div class="card-content">
              <div class="card-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  <circle cx="12" cy="9" r="2.5"/>
                </svg>
              </div>
              <div class="card-text">
                <h3>Find Parking</h3>
                <p>Real-time availability & smart recommendations</p>
              </div>
              <div class="card-arrow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
            <div class="card-glow"></div>
          </div>

          <div class="nav-card secondary" @click="navigateToDashboard">
            <div class="card-content">
              <div class="card-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 3v18h18"/>
                  <path d="M9 9h6v6H9z"/>
                  <path d="M9 3v6"/>
                  <path d="M15 3v6"/>
                  <path d="M3 9h6"/>
                  <path d="M15 9h6"/>
                </svg>
              </div>
              <div class="card-text">
                <h3>Analytics</h3>
                <p>Urban mobility insights & trends</p>
              </div>
              <div class="card-arrow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
            <div class="card-glow"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Insights Section -->
    <section class="insights">
      <div class="insights-header">
        <h2>Melbourne Parking Insights</h2>
        <p>Key metrics and urban mobility trends</p>
      </div>
      
      <div class="insights-grid">
        <div class="insight-card">
          <div class="insight-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
            </svg>
          </div>
          <div class="insight-content">
            <div class="insight-value">4.98M</div>
            <div class="insight-label">Metro Population</div>
            <div class="insight-trend positive">+3.3% growth</div>
          </div>
        </div>

        <div class="insight-card">
          <div class="insight-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.6-.4-1-1-1h-2"/>
              <path d="M5 17H3c-.6 0-1-.4-1-1v-3c0-.6.4-1 1-1h2"/>
              <path d="M3 9h18"/>
            </svg>
          </div>
          <div class="insight-content">
            <div class="insight-value">189K</div>
            <div class="insight-label">Registered Vehicles</div>
            <div class="insight-trend negative">-20.1% since 2019</div>
          </div>
        </div>

        <div class="insight-card">
          <div class="insight-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 3v18h18"/>
              <path d="M9 9h6v6H9z"/>
            </svg>
          </div>
          <div class="insight-content">
            <div class="insight-value">38.0</div>
            <div class="insight-label">Vehicles per 1K</div>
            <div class="insight-trend positive">Sustainable trend</div>
          </div>
        </div>

        <div class="insight-card">
          <div class="insight-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2v20M2 12h20"/>
            </svg>
          </div>
          <div class="insight-content">
            <div class="insight-value">3,309</div>
            <div class="insight-label">Active Sensors</div>
            <div class="insight-trend positive">Real-time data</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Smart Features Preview -->
    <section class="features">
      <div class="features-header">
        <h2>Smart Features</h2>
        <p>Powered by real-time data and AI insights</p>
      </div>
      
      <div class="features-showcase">
        <div class="feature-item">
          <div class="feature-badge">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2v20M2 12h20"/>
            </svg>
          </div>
          <span>Live Availability</span>
        </div>
        <div class="feature-item">
          <div class="feature-badge">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 3v18h18"/>
              <path d="M9 9h6v6H9z"/>
            </svg>
          </div>
          <span>Smart Analytics</span>
        </div>
        <div class="feature-item">
          <div class="feature-badge">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <span>Verified Data</span>
        </div>
        <div class="feature-item">
          <div class="feature-badge">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
          </div>
          <span>Instant Updates</span>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-info">
          <p>Data sourced from Melbourne Open Data Portal & Australian Bureau of Statistics</p>
          <p>For informational purposes only. Not intended for real-time parking decisions.</p>
        </div>
        <div class="footer-links">
          <button class="footer-link" @click="navigateToMap">Map</button>
          <button class="footer-link" @click="navigateToDashboard">Analytics</button>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits(['navigate'])

// Live stats with simulated real-time updates
const liveStats = ref({
  total: 3309,
  available: 1319,
  utilization: 60
})

const navigateToMap = () => {
  emit('navigate', 'map')
}

const navigateToDashboard = () => {
  emit('navigate', 'dashboard')
}

// Simulate real-time updates
onMounted(() => {
  setInterval(() => {
    const change = Math.floor(Math.random() * 20) - 10
    liveStats.value.available = Math.max(0, liveStats.value.available + change)
    liveStats.value.utilization = Math.round(
      ((liveStats.value.total - liveStats.value.available) / liveStats.value.total) * 100
    )
  }, 5000)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

.home-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  color: white;
  font-family: 'Inter', sans-serif;
  position: relative;
  overflow-x: hidden;
}

/* Animated Background */
.animated-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%);
}

.particles {
  position: absolute;
  width: 100%;
  height: 100%;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: float-particle linear infinite;
}

@keyframes float-particle {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) rotate(360deg);
    opacity: 0;
  }
}

/* Hero Section */
.hero {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
}

.hero-content {
  max-width: 1200px;
  width: 100%;
  text-align: center;
}

.hero-text {
  margin-bottom: 60px;
}

.hero-title {
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 900;
  line-height: 0.9;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-line {
  display: block;
  animation: slideInUp 0.8s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);
}

.title-line:nth-child(2) {
  animation-delay: 0.2s;
}

@keyframes slideInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-subtitle {
  font-size: clamp(1.1rem, 3vw, 1.5rem);
  font-weight: 300;
  opacity: 0.8;
  margin-bottom: 40px;
  animation: fadeIn 1s ease-out 0.5s forwards;
  opacity: 0;
}

@keyframes fadeIn {
  to {
    opacity: 0.8;
  }
}

/* Live Stats */
.live-stats {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 60px;
  animation: slideInUp 1s ease-out 0.8s forwards;
  opacity: 0;
  transform: translateY(30px);
}

.stat-badge {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 20px;
  min-width: 120px;
  position: relative;
  overflow: hidden;
}

.stat-pulse {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #10b981;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.8rem;
  opacity: 0.7;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Smart Navigation */
.smart-nav {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  max-width: 800px;
  margin: 0 auto;
  animation: slideInUp 1s ease-out 1.2s forwards;
  opacity: 0;
  transform: translateY(30px);
}

.nav-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 30px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.nav-card:hover {
  transform: translateY(-10px);
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.nav-card.primary:hover {
  box-shadow: 0 20px 40px rgba(16, 185, 129, 0.3);
}

.nav-card.secondary:hover {
  box-shadow: 0 20px 40px rgba(59, 130, 246, 0.3);
}

.card-content {
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
  z-index: 2;
}

.card-icon {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: transform 0.3s ease;
}

.nav-card:hover .card-icon {
  transform: scale(1.1);
}

.card-text h3 {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 5px;
  color: white;
}

.card-text p {
  font-size: 0.9rem;
  opacity: 0.7;
  margin: 0;
}

.card-arrow {
  margin-left: auto;
  color: rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
}

.nav-card:hover .card-arrow {
  color: white;
  transform: translateX(5px);
}

.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.nav-card:hover .card-glow {
  opacity: 1;
}

/* Insights Section */
.insights {
  position: relative;
  z-index: 1;
  padding: 80px 20px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
}

.insights-header {
  text-align: center;
  margin-bottom: 50px;
}

.insights-header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.insights-header p {
  font-size: 1.1rem;
  opacity: 0.7;
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.insight-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 25px;
  text-align: center;
  transition: transform 0.3s ease;
}

.insight-card:hover {
  transform: translateY(-5px);
}

.insight-icon {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  color: #10b981;
}

.insight-value {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 5px;
}

.insight-label {
  font-size: 0.9rem;
  opacity: 0.7;
  margin-bottom: 10px;
}

.insight-trend {
  font-size: 0.8rem;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 6px;
  display: inline-block;
}

.insight-trend.positive {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.insight-trend.negative {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

/* Features Section */
.features {
  position: relative;
  z-index: 1;
  padding: 60px 20px;
}

.features-header {
  text-align: center;
  margin-bottom: 40px;
}

.features-header h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: white;
}

.features-header p {
  font-size: 1rem;
  opacity: 0.7;
}

.features-showcase {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
  max-width: 800px;
  margin: 0 auto;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 12px 20px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: transform 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-2px);
}

.feature-badge {
  width: 30px;
  height: 30px;
  background: rgba(16, 185, 129, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #10b981;
}

/* Footer */
.footer {
  position: relative;
  z-index: 1;
  padding: 40px 20px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.footer-info {
  flex: 1;
  min-width: 300px;
}

.footer-info p {
  font-size: 0.8rem;
  opacity: 0.6;
  margin: 0 0 5px 0;
  line-height: 1.4;
}

.footer-links {
  display: flex;
  gap: 15px;
}

.footer-link {
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 8px 16px;
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.footer-link:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero {
    padding: 0 15px;
  }
  
  .live-stats {
    flex-direction: column;
    gap: 15px;
    align-items: center;
  }
  
  .stat-badge {
    min-width: 200px;
  }
  
  .smart-nav {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .nav-card {
    padding: 20px;
  }
  
  .card-content {
    gap: 15px;
  }
  
  .insights {
    padding: 60px 15px;
  }
  
  .insights-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  
  .features-showcase {
    gap: 15px;
  }
  
  .footer-content {
    flex-direction: column;
    text-align: center;
  }
  
  .footer-info {
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .insights-grid {
    grid-template-columns: 1fr;
  }
  
  .features-showcase {
    flex-direction: column;
    align-items: center;
  }
  
  .feature-item {
    width: 100%;
    max-width: 300px;
  }
}
</style>
