const express = require('express')
const app = express()
require("dotenv").config()
const connectDB = require('./db')


app.listen(process.env.PORT, ()=>{
    console.log('Server Started On ' + process.env.PORT)
})