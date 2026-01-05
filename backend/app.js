const express = require('express');
const app = express();
require('dotenv').config();

const pool = require('./db'); // PostgreSQL pool
const userApi = require('./api/user');
const contentApi = require('./api/content');
const bookmarkApi = require('./api/bookmark');

const cookieParser = require('cookie-parser');
const cors = require('cors');

app.use(express.json());
app.use(cookieParser());

/* =======================
   CORS CONFIG
======================= */

const allowedOrigins = [
  'https://astroflix-website.vercel.app',
  'http://localhost:5173'
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser clients (React Native, Postman)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, origin); // echo exact origin
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// IMPORTANT: handle preflight
app.options('*', cors(corsOptions));

/* =======================
   ROUTES
======================= */

app.use('/api', userApi);
app.use('/api', contentApi);
app.use('/api', bookmarkApi);

app.get('/', (req, res) => {
  res.send('API running');
});

/* =======================
   SERVER
======================= */

app.listen(process.env.PORT, () => {
  console.log('Server started on port', process.env.PORT);
});

module.exports = app;
