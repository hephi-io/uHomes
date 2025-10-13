import 'dotenv/config'
import  app  from './app'
import connectDB from './config/db'

const PORT = process.env.PORT || 7000

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(` Server is running on ${PORT}`)
        })
    })
    .catch((error) => {
        console.error('Failed to connect to the database', error)
        process.exit(1)
    })