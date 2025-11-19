// Only load dotenv in non-production environments (where .env file exists)
// On Render/production, environment variables are set directly via dashboard
if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('dotenv/config');
}

import app from './app';
import connectDB from './config/db';

const PORT = process.env.PORT || 7000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log('process.env.NODE_ENV', process.env.NODE_ENV);
      console.log(`HTTP Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to the database', error);
    process.exit(1);
  });
