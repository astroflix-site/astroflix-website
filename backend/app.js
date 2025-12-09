const express = require('express')
const app = express()
require("dotenv").config()
const connectDB = require('./db')
const userApi = require('./api/user')
const cookieParser = require('cookie-parser')
app.use(express.json());
app.use(cookieParser());
const cors = require('cors');
const contentApi = require('./api/content')
app.use(cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [
        'https://cbpsc3gn-5173.inc1.devtunnels.ms',
        'http://localhost:5173',
        'http://localhost:5174'
    ], // Frontend origins from env or default
    credentials: true, // Allow credentials (cookies) to be sent
}));

//all routes
app.use('/api', userApi)
app.use('/api', contentApi)
const bookmarkApi = require('./api/bookmark')
app.use('/api', bookmarkApi)
app.get('/',)

app.listen(process.env.PORT, () => {
    console.log('Server Started On ' + process.env.PORT)
})


export default app;
