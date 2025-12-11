const pool = require('../db');

/**
 * Episode Model for PostgreSQL
 * Provides methods to interact with the episodes table
 */
const Episode = {
    /**
     * Create a new episode
     * @param {Object} episodeData - Episode data
     * @returns {Object} Created episode
     */
    async create(episodeData) {
        const { url, servers, title, episodeNumber, season = 1, series } = episodeData;

        // Handle both old format (single url) and new format (servers array)
        let serversData;
        if (servers && Array.isArray(servers)) {
            serversData = servers;
        } else if (url) {
            // Backward compatibility: convert single URL to servers array
            serversData = [{ name: 'Server 1', url: url }];
        } else {
            serversData = [];
        }

        const query = `
            INSERT INTO episodes (url, title, episode_number, season, series_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        const values = [JSON.stringify(serversData), title, episodeNumber, season, series || null];
        const result = await pool.query(query, values);

        return this._formatEpisode(result.rows[0]);
    },

    /**
     * Find episode by ID
     * @param {number} id - Episode ID
     * @returns {Object|null} Episode object or null
     */
    async findById(id) {
        const query = 'SELECT * FROM episodes WHERE id = $1';
        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) return null;
        return this._formatEpisode(result.rows[0]);
    },

    /**
     * Find episode by title
     * @param {string} title - Episode title
     * @returns {Object|null} Episode object or null
     */
    async findByTitle(title) {
        const query = 'SELECT * FROM episodes WHERE title = $1';
        const result = await pool.query(query, [title]);
        if (result.rows.length === 0) return null;
        return this._formatEpisode(result.rows[0]);
    },

    /**
     * Find episodes by series ID
     * @param {number} seriesId - Series ID
     * @returns {Array} Array of episodes
     */
    async findBySeries(seriesId) {
        const query = `
            SELECT * FROM episodes 
            WHERE series_id = $1 
            ORDER BY season ASC, episode_number ASC
        `;
        const result = await pool.query(query, [seriesId]);
        return result.rows.map(ep => this._formatEpisode(ep));
    },

    /**
     * Update episode
     * @param {number} id - Episode ID
     * @param {Object} updates - Fields to update
     * @returns {Object|null} Updated episode or null
     */
    async update(id, updates) {
        const allowedFields = ['url', 'servers', 'title', 'episodeNumber', 'season', 'series'];
        const fieldMap = {
            url: 'url',
            servers: 'url', // servers also maps to url column
            title: 'title',
            episodeNumber: 'episode_number',
            season: 'season',
            series: 'series_id'
        };

        const updateFields = [];
        const values = [];
        let paramCount = 1;

        for (const [key, value] of Object.entries(updates)) {
            if (allowedFields.includes(key)) {
                const dbField = fieldMap[key];
                updateFields.push(`${dbField} = $${paramCount}`);

                // Handle servers array or single URL
                if (key === 'servers') {
                    values.push(JSON.stringify(value));
                } else if (key === 'url' && typeof value === 'string') {
                    // Convert single URL to servers array format
                    values.push(JSON.stringify([{ name: 'Server 1', url: value }]));
                } else {
                    values.push(value);
                }
                paramCount++;
            }
        }

        if (updateFields.length === 0) return null;

        values.push(id);
        const query = `
            UPDATE episodes 
            SET ${updateFields.join(', ')}
            WHERE id = $${paramCount}
            RETURNING *
        `;

        const result = await pool.query(query, values);
        if (result.rows.length === 0) return null;
        return this._formatEpisode(result.rows[0]);
    },

    /**
     * Delete episode
     * @param {number} id - Episode ID
     * @returns {Object|null} Deleted episode info or null
     */
    async delete(id) {
        const query = 'DELETE FROM episodes WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) return null;
        return this._formatEpisode(result.rows[0]);
    },

    /**
     * Format episode object from database to match frontend expectations
     * Converts snake_case to camelCase and id to _id
     * @private
     */
    _formatEpisode(episode) {
        if (!episode) return null;

        // Parse servers from JSONB if it's a string
        let servers = episode.url;
        if (typeof servers === 'string') {
            try {
                servers = JSON.parse(servers);
            } catch (e) {
                // If parsing fails, treat as old single URL format
                servers = [{ name: 'Server 1', url: servers }];
            }
        }

        // Ensure servers is an array
        if (!Array.isArray(servers)) {
            servers = [{ name: 'Server 1', url: episode.url }];
        }

        return {
            _id: episode.id,
            url: servers.length > 0 ? servers[0].url : '', // First server URL for backward compatibility
            servers: servers, // Full servers array
            title: episode.title,
            episodeNumber: episode.episode_number,
            season: episode.season,
            series: episode.series_id,
            createdAt: episode.created_at
        };
    }
};

module.exports = Episode;
