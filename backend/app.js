1: const express = require('express')
2: const app = express()
3: require("dotenv").config()
4: const pool = require('./db') // Import PostgreSQL pool
5: const userApi = require('./api/user')
6: const cookieParser = require('cookie-parser')
7: app.use(express.json());
8: app.use(cookieParser());
9: const cors = require('cors');
10: const contentApi = require('./api/content')

const allowedOrigins = [
  'https://astroflix-website.vercel.app',
  'http://localhost:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    // React Native
    if (!origin) {
      return callback(null, false); // don't set ACAO at all
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, origin); // echo origin
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
31: 
32: //all routes
33: app.use('/api', userApi)
34: app.use('/api', contentApi)
35: const bookmarkApi = require('./api/bookmark')
36: app.use('/api', bookmarkApi)
37: app.get('/',)
38: 
39: app.listen(process.env.PORT, () => {
40:     console.log('Server Started On ' + process.env.PORT)
41: })
42: 
43: 
44: module.exports = app;
