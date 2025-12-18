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
11: app.use(cors({
12:   origin: (origin, callback) => {
13:     // Allow requests with no origin (React Native, Postman, mobile apps)
14:     if (!origin) return callback(null, true);
15: 
16:     const allowedOrigins = [
17:       'https://astroflix-website.vercel.app',
18:       'http://localhost:5173'
19:     ];
20: 
21:     if (allowedOrigins.includes(origin)) {
22:       return callback(null, true);
23:     }
24: 
25:     return callback(new Error('Not allowed by CORS'));
26:   },
27:   credentials: true,
28:   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
29:   allowedHeaders: ['Content-Type', 'Authorization']
30: }));
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
