import 'dotenv/config';
import https from 'https';
import fs from 'fs';
import app from './app';
import connectDB from './config/db';

const PORT = process.env.PORT || 7000;

// Load SSL certificate and key
const httpsServer = https.createServer(
  {
    key: fs.readFileSync("./cert/key.pem"),
    cert: fs.readFileSync("./cert/cert.pem"),
  },
  app
);


connectDB()
  .then(() => {
    httpsServer.listen(PORT, () => {
      console.log(` HTTPS Server running at https://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to the database', error);
    process.exit(1);
  });
