const { Pool } = require('pg');

// Create a connection pool
const pool = new Pool({
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT || 5432,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000, // Increased timeout for cloud connections
    ssl: process.env.POSTGRES_HOST !== 'localhost' ? {
        rejectUnauthorized: false,
        sslmode: 'require'
    } : false
});

// Test the connection
pool.on('connect', () => {
    console.log('PostgreSQL connected successfully');
});

pool.on('error', (err) => {
    console.error('Unexpected PostgreSQL error:', err);
    process.exit(-1);
});

// Test initial connection
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error connecting to PostgreSQL:', err);
    } else {
        console.log('DB connected at:', res.rows[0].now);
    }
});

module.exports = pool;