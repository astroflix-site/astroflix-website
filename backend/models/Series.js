const pool = require('../db');

/**
 * Series Model for PostgreSQL
 * Provides methods to interact with the series table
 */
const Series = {
    /**
     * Create a new series
     * @param {Object} seriesData - Series data
     * @returns {Object} Created series
     */
    async create(seriesData) {
        const {
            imageURL,
            backdrop,
            title,
            description,
            genre,
            releaseDate,
            status,
            rating,
            totalEpisodes = 0
        } = seriesData;

        const query = `
            INSERT INTO series (image_url, backdrop, title, description, genre, release_date, status, rating, total_episodes)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        `;
        const values = [imageURL, backdrop, title, description, genre, releaseDate, status, rating, totalEpisodes];
        const result = await pool.query(query, values);

        // Convert snake_case to camelCase for consistency with frontend
        const series = result.rows[0];
        return this._formatSeries(series);
    },

    /**
     * Find series by ID
     * @param {number} id - Series ID
     * @returns {Object|null} Series object or null
     */
    async findById(id) {
        const query = 'SELECT * FROM series WHERE id = $1';
        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) return null;
        return this._formatSeries(result.rows[0]);
    },

    /**
     * Find series by ID with episodes
     * @param {number} id - Series ID
     * @returns {Object|null} Series with episodes array
     */
    async getWithEpisodes(id) {
        // Get series
        const seriesQuery = 'SELECT * FROM series WHERE id = $1';
        const seriesResult = await pool.query(seriesQuery, [id]);

        if (seriesResult.rows.length === 0) return null;

        const series = this._formatSeries(seriesResult.rows[0]);

        // Get episodes for this series
        const episodesQuery = `
            SELECT * FROM episodes 
            WHERE series_id = $1 
            ORDER BY season ASC, episode_number ASC
        `;
        const episodesResult = await pool.query(episodesQuery, [id]);

        // Format episodes
        const Episode = require('./Episode');
        series.episodes = episodesResult.rows.map(ep => Episode._formatEpisode(ep));

        return series;
    },

    /**
     * Find all series
     * @returns {Array} Array of all series
     */
    async findAll() {
        const query = 'SELECT * FROM series ORDER BY created_at DESC';
        const result = await pool.query(query);
        return result.rows.map(series => this._formatSeries(series));
    },

    /**
     * Search series by title (case-insensitive)
     * @param {string} title - Search term
     * @returns {Array} Array of matching series
     */
    async search(title) {
        const query = 'SELECT * FROM series WHERE title ILIKE $1 ORDER BY title';
        const result = await pool.query(query, [`%${title}%`]);
        return result.rows.map(series => this._formatSeries(series));
    },

    /**
     * Update series
     * @param {number} id - Series ID
     * @param {Object} updates - Fields to update
     * @returns {Object|null} Updated series or null
     */
    async update(id, updates) {
        const allowedFields = ['imageURL', 'backdrop', 'title', 'description', 'genre', 'releaseDate', 'status', 'rating', 'totalEpisodes'];
        const fieldMap = {
            imageURL: 'image_url',
            backdrop: 'backdrop',
            title: 'title',
            description: 'description',
            genre: 'genre',
            releaseDate: 'release_date',
            status: 'status',
            rating: 'rating',
            totalEpisodes: 'total_episodes'
        };

        const updateFields = [];
        const values = [];
        let paramCount = 1;

        for (const [key, value] of Object.entries(updates)) {
            if (allowedFields.includes(key)) {
                const dbField = fieldMap[key];
                updateFields.push(`${dbField} = $${paramCount}`);
                values.push(value);
                paramCount++;
            }
        }

        if (updateFields.length === 0) return null;

        values.push(id);
        const query = `
            UPDATE series 
            SET ${updateFields.join(', ')}
            WHERE id = $${paramCount}
            RETURNING *
        `;

        const result = await pool.query(query, values);
        if (result.rows.length === 0) return null;
        return this._formatSeries(result.rows[0]);
    },

    /**
     * Delete series (will cascade delete episodes)
     * @param {number} id - Series ID
     * @returns {boolean} True if deleted, false otherwise
     */
    async delete(id) {
        const query = 'DELETE FROM series WHERE id = $1 RETURNING id';
        const result = await pool.query(query, [id]);
        return result.rowCount > 0;
    },

    /**
     * Format series object from database to match frontend expectations
     * Converts snake_case to camelCase and id to _id
     * @private
     */
    _formatSeries(series) {
        if (!series) return null;
        return {
            _id: series.id,
            imageURL: series.image_url,
            backdrop: series.backdrop,
            title: series.title,
            description: series.description,
            genre: series.genre,
            releaseDate: series.release_date,
            status: series.status,
            rating: series.rating,
            totalEpisodes: series.total_episodes,
            createdAt: series.created_at,
            episodes: [] // Will be populated if needed
        };
    }
};

module.exports = Series;
