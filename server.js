require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const PORT = process.env.PORT || 5000
app.use(express.json())
app.use(cookieParser())
app.use(
    cors({
        origin: [
            `${process.env.BACKEND_URL}`,
            `${process.env.FRONTEND_URL}`,
            `app.${process.env.FRONTEND_URL}`,
        ],
        allowCredentials: true,
        credentials: true,
        allowedHeaders: [
            'Access-Control-Allow-Headers',
            'Origin',
            'X-Requested-With',
            'Content-Type',
            'ACCESS-CONTROL-ALLOW-CREDENTIAL',
            'Access-Control-Allow-Headers',
            'Content-Type',
            'Set-Cookie',
            'Cookie',
            'cookie',
            'Authorization',
            'XMLHttpRequest',
            'X-Requested-With',
            'Accept',
        ],
        allowCredentials: true,
    })
)

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI)
    } catch (err) {
        console.log(err)
    }
}
connectDB()

mongoose.connection.once('open', () => {
    console.log(`Connected to Mongo DB`)

    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`)
    })
})

mongoose.connection.on('error', (err) => {
    console.log(err)
})

//Routes
app.use('/api/people', require('./routes/peopleRoute'))
app.use('/api/post', require('./routes/postRoute'))
app.use('/api/auth', require('./routes/authRoutes'))
