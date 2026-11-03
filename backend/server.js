require('dotenv').config();
const app = require('./app');
const pool = require('./config/db');

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await pool.query('SELECT 1');
    console.log('Database connected');
  } catch (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  }
  // Render requires binding to 0.0.0.0 and the PORT it provides
  app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
}

start();
