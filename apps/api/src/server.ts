import 'dotenv/config';

import https from 'https';
import fs from 'fs';
import path from 'path';
import app from './app';
import connectDB from './config/db';

const PORT = process.env.PORT || 7000;

// Certificate file paths using @cert alias
const certDir = path.join(__dirname, '../cert');
const keyPemPath = path.join(certDir, 'key.pem');
const certPemPath = path.join(certDir, 'cert.pem');

const getCertificateFiles = () => {
  if (fs.existsSync(keyPemPath) && fs.existsSync(certPemPath)) {
    return {
      key: fs.readFileSync(keyPemPath, 'utf8'),
      cert: fs.readFileSync(certPemPath, 'utf8'),
    };
  }
  return null;
};

connectDB()
  .then(() => {
    const certFiles = getCertificateFiles();

    if (certFiles) {
      // Create HTTPS server
      const httpsServer = https.createServer(certFiles, app);

      httpsServer.listen(PORT, () => {
        console.log(`HTTPS Server running at https://localhost:${PORT}`);
      });
    } else {
      // Fall back to HTTP server
      app.listen(PORT, () => {
        console.log(`HTTP Server running at http://localhost:${PORT}`);
        console.log(
          'Note: HTTPS certificates not found, using HTTP. Add certificates to cert/ directory to enable HTTPS.'
        );
      });
    }
  })
  .catch((error) => {
    console.error('Failed to connect to the database', error);
    process.exit(1);
  });
