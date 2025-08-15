import pool from '../utils/db.js';

export async function getDashboardMetrics() {
  if (!pool) {
    console.log('Using fallback dashboard metrics (no database connection)');
    return {
      populationGrowth: 2.1,
      vehicleChange: 1.8,
      vehicleDensityChange: -0.3,
    };
  }

  try {
    const { rows } = await pool.query(
      `SELECT population_growth, vehicle_change, vehicle_density_change FROM dashboard_metrics LIMIT 1`
    );

    const row = rows[0] || {};
    return {
      populationGrowth: row.population_growth ?? null,
      vehicleChange: row.vehicle_change ?? null,
      vehicleDensityChange: row.vehicle_density_change ?? null,
    };
  } catch (error) {
    console.error('Failed to get dashboard metrics from database:', error.message);
    console.log('Using fallback dashboard metrics');
    return {
      populationGrowth: 2.1,
      vehicleChange: 1.8,
      vehicleDensityChange: -0.3,
    };
  }
}
