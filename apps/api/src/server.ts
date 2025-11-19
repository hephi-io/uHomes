// Always load dotenv/config at the very top - it's safe because:
// - In local dev: loads .env file if it exists
// - On Render: no .env file exists, so it does nothing and preserves Render's env vars
// - dotenv doesn't override existing process.env values
import 'dotenv/config';

console.log('Environment check:');
console.log('DATABASE:', process.env.DATABASE ? 'SET' : 'NOT SET');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
console.log('NODE_ENV:', process.env.NODE_ENV);

import app from './app';
import connectDB from './config/db';

const PORT = process.env.PORT || 7000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`HTTP Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to the database', error);
    process.exit(1);
  });
