const pool = require('../db');

/**
 * User Model for PostgreSQL
 * Provides methods to interact with the users table
 */
const User = {
    /**
     * Create a new user
     * @param {Object} userData - User data {username, email, password}
     * @returns {Object} Created user
     */
    async create(userData) {
        const { username, email, password, role = 'user' } = userData;
        const query = `
            INSERT INTO users (username, email, password, role)
            VALUES ($1, $2, $3, $4)
            RETURNING id, username, email, role, created_at
        `;
        const values = [username, email, password, role];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    /**
     * Find user by email
     * @param {string} email - User email
     * @returns {Object|null} User object or null
     */
    async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await pool.query(query, [email]);
        return result.rows[0] || null;
    },

    /**
     * Find user by username
     * @param {string} username - Username
     * @returns {Object|null} User object or null
     */
    async findByUsername(username) {
        const query = 'SELECT * FROM users WHERE username = $1';
        const result = await pool.query(query, [username]);
        return result.rows[0] || null;
    },

    /**
     * Find user by ID
     * @param {number} id - User ID
     * @returns {Object|null} User object or null
     */
    async findById(id) {
        const query = 'SELECT * FROM users WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0] || null;
    },

    /**
     * Find all users
     * @returns {Array} Array of all users
     */
    async findAll() {
        const query = 'SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC';
        const result = await pool.query(query);
        return result.rows;
    },

    /**
     * Delete user by ID
     * @param {number} id - User ID
     * @returns {boolean} True if deleted, false otherwise
     */
    async delete(id) {
        const query = 'DELETE FROM users WHERE id = $1 RETURNING id';
        const result = await pool.query(query, [id]);
        return result.rowCount > 0;
    },

    /**
     * Add bookmark for user
     * @param {number} userId - User ID
     * @param {number} seriesId - Series ID
     * @returns {Object} Bookmark record
     */
    async addBookmark(userId, seriesId) {
        const query = `
            INSERT INTO bookmarks (user_id, series_id)
            VALUES ($1, $2)
            ON CONFLICT (user_id, series_id) DO NOTHING
            RETURNING user_id, series_id, created_at
        `;
        const result = await pool.query(query, [userId, seriesId]);
        return result.rows[0];
    },

    /**
     * Remove bookmark for user
     * @param {number} userId - User ID
     * @param {number} seriesId - Series ID
     * @returns {boolean} True if removed, false otherwise
     */
    async removeBookmark(userId, seriesId) {
        const query = 'DELETE FROM bookmarks WHERE user_id = $1 AND series_id = $2';
        const result = await pool.query(query, [userId, seriesId]);
        return result.rowCount > 0;
    },

    /**
     * Check if bookmark exists
     * @param {number} userId - User ID
     * @param {number} seriesId - Series ID
     * @returns {boolean} True if bookmark exists
     */
    async hasBookmark(userId, seriesId) {
        const query = 'SELECT 1 FROM bookmarks WHERE user_id = $1 AND series_id = $2';
        const result = await pool.query(query, [userId, seriesId]);
        return result.rowCount > 0;
    },

    /**
     * Get user's bookmarks with series details
     * @param {number} userId - User ID
     * @returns {Array} Array of bookmarked series
     */
    async getBookmarks(userId) {
        const query = `
            SELECT s.*, b.created_at as bookmarked_at
            FROM series s
            INNER JOIN bookmarks b ON s.id = b.series_id
            WHERE b.user_id = $1
            ORDER BY b.created_at DESC
        `;
        const result = await pool.query(query, [userId]);
        return result.rows;
    }
};

module.exports = User;
