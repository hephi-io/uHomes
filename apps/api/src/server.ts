import 'dotenv/config'
import https from 'https'
import fs from 'fs'
import app from './app'
import connectDB from './config/db'

const PORT = process.env.PORT || 7000

let httpsServer: https.Server

if (process.env.NODE_ENV === 'test') {
  console.log('Test environment detected — skipping HTTPS server and DB connection')
} else {
  const key = fs.readFileSync('./cert/key.pem')
  const cert = fs.readFileSync('./cert/cert.pem')

  httpsServer = https.createServer({ key, cert }, app)

  connectDB()
    .then(() => {
      httpsServer.listen(PORT, () => {
        console.log(`HTTPS Server running at https://localhost:${PORT}`)
      })
    })
    .catch((error) => {
      console.error('Failed to connect to the database', error)
      process.exit(1)
    })
}
