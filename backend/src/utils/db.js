/* eslint-env node */
/* global process */
import pg from 'pg';

let pool = null;

// Only create database connection if DATABASE_URL is provided
if (process.env.DATABASE_URL) {
  try {
    pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });
    
    // Test the connection
    pool.query('SELECT NOW()', (err) => {
      if (err) {
        console.warn('Database connection failed:', err.message);
        console.log('Some features may be limited without database access');
      } else {
        console.log('Database connection established successfully');
      }
    });
  } catch (error) {
    console.warn('Failed to initialize database pool:', error.message);
    console.log('Some features may be limited without database access');
  }
} else {
  console.log('No DATABASE_URL provided - using fallback data for charts and dashboard');
}

export default pool;
