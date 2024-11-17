const express = require('express')
const app = express()
require("dotenv").config()
const connectDB = require('./db')
const userApi = require('./api/user')
const cookieParser = require('cookie-parser')
app.use(express.json());
app.use(cookieParser());
const cors = require('cors');

app.use(cors({
    origin: 'https://cbpsc3gn-5173.inc1.devtunnels.ms', // Frontend origin
    credentials: true, // Allow credentials (cookies) to be sent
}));
//all routes
app.use('/api', userApi)

app.get('/', )

app.listen(process.env.PORT, ()=>{
    console.log('Server Started On ' + process.env.PORT)
})