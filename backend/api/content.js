const express = require('express')
const router = express.Router();
const Episode = require('../models/Episode')
const multer = require('multer');
const IsAuth = require('../middleware/auth');
const IsAdmin = require('../middleware/authtoken');
const FormData = require('form-data');
const Series = require('../models/Series');
const axios = require('axios')

// api to create series
router.post('/new-series', IsAuth, IsAdmin, async (req, res) => {
    const { title, description, imageURL, backdrop, genre, releaseDate, status, rating, totalEpisodes } = req.body;

    if (!title) {
        return res.status(400).json({ error: 'Title is required.' });
    }

    try {
        const newSeries = await Series.create({ title, description, imageURL, backdrop, genre, releaseDate, status, rating, totalEpisodes });
        res.json({ message: 'Series created successfully!', series: newSeries });
    } catch (error) {
        console.error('Error creating series:', error.message);
        res.status(500).json({ error: 'Failed to create series.' });
    }
});


//multer
const storage = multer.memoryStorage(); // Store file in memory temporarily
const upload = multer({ storage }); // Use memory storage


//upload api
router.post("/upload", IsAuth, IsAdmin, upload.single("video"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
    }

    const { seriesId, title, episodeNumber, season } = req.body; // Series and title provided by the user
    const fileBuffer = req.file.buffer;

    // Create FormData to send to PlayerX
    const formData = new FormData();
    formData.append("files[]", fileBuffer, req.file.originalname);
    formData.append("api_key", process.env.PLAYERX_API);
    formData.append("action", "upload_video");
    formData.append("raw", "0");

    try {
        // Send file to PlayerX
        const playerXResponse = await axios.post(
            "https://www.playerx.stream/api.php",
            formData,
            { headers: formData.getHeaders() }
        );
        console.log("PlayerX Response:", playerXResponse.data);

        // Extract the video URL (slug) from PlayerX response
        const { slug } = playerXResponse.data;

        // Check if required fields are present
        if (!slug || !title || !episodeNumber) {
            console.error("Missing required fields in PlayerX response or request:", playerXResponse.data);
            return res.status(500).json({ error: "Incomplete video data." });
        }

        // Save episode info to PostgreSQL
        const newEpisode = await Episode.create({
            url: slug,  // Save the full video URL
            title: title, // Title from the form data
            episodeNumber: episodeNumber,
            season: season || 1,
            series: seriesId || null
        });

        // No need to update series separately as we'll count episodes on query
        // But if you want to keep totalEpisodes synced, you can do it here

        res.json({ message: "Episode uploaded and saved!", episode: newEpisode });
    } catch (error) {
        console.error("Error uploading to PlayerX:", error.response?.data || error);
        res.status(500).json({ error: "Failed to upload episode." });
    }
});


// api to create episode directly (e.g. from URL)
router.post('/new-episode', IsAuth, IsAdmin, async (req, res) => {
    const { title, episodeNumber, url, servers, seriesId, season } = req.body;

    // Validate required fields - accept either url or servers
    if (!title || !episodeNumber) {
        return res.status(400).json({ error: 'Title and Episode Number are required.' });
    }

    if (!url && (!servers || servers.length === 0)) {
        return res.status(400).json({ error: 'At least one server URL is required.' });
    }

    try {
        const newEpisode = await Episode.create({
            title,
            episodeNumber,
            url,
            servers,
            series: seriesId || null,
            season: season || 1
        });

        res.json({ message: 'Episode created successfully!', episode: newEpisode });
    } catch (error) {
        console.error('Error creating episode:', error.message);
        res.status(500).json({ error: 'Failed to create episode.' });
    }
});

// Get all series
router.get('/all-series', async (req, res) => {
    try {
        const seriesList = await Series.findAll();
        res.json({ series: seriesList });
    } catch (error) {
        console.error('Error fetching all series:', error.message);
        res.status(500).json({ error: 'Failed to fetch series.' });
    }
});

//series search
router.get('/search-series', async (req, res) => {
    const { title } = req.query; // Get title from query parameter

    try {
        // Find series with title matching the search term (case-insensitive)
        const seriesList = await Series.search(title);

        if (seriesList.length === 0) {
            return res.status(404).json({ error: 'No series found.' });
        }

        res.json({ series: seriesList });
    } catch (error) {
        console.error('Error searching series:', error.message);
        res.status(500).json({ error: 'Failed to search series.' });
    }
});


// fetch episode api
router.get('/episodes/:episode_title', async (req, res) => {
    const { episode_title } = req.params;

    try {
        const episode = await Episode.findByTitle(episode_title);
        if (!episode) {
            return res.status(404).json({ error: 'Episode not found.' });
        }
        res.json({ episode });
    } catch (error) {
        console.error("Failed to fetch episode:", error.message);
        res.status(500).json({ error: "Failed to fetch episode." });
    }
});

// fetch episode by id
router.get('/episode/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const episode = await Episode.findById(id);
        if (!episode) {
            return res.status(404).json({ error: 'Episode not found.' });
        }
        res.json({ episode });
    } catch (error) {
        console.error("Failed to fetch episode:", error.message);
        res.status(500).json({ error: "Failed to fetch episode." });
    }
});



//add episode to series
router.post('/series/:seriesId/add-episode', IsAuth, IsAdmin, async (req, res) => {
    const { seriesId } = req.params;
    const { episodeId } = req.body;

    try {
        const series = await Series.findById(seriesId);
        if (!series) {
            return res.status(404).json({ error: 'Series not found.' });
        }

        const episode = await Episode.findById(episodeId);
        if (!episode) {
            return res.status(404).json({ error: 'Episode not found.' });
        }

        // Update episode to link to series
        await Episode.update(episodeId, { series: seriesId });

        // Fetch updated series with episodes
        const updatedSeries = await Series.getWithEpisodes(seriesId);

        res.json({ message: 'Episode added to series!', series: updatedSeries });
    } catch (error) {
        console.error('Error adding episode to series:', error.message);
        res.status(500).json({ error: 'Failed to add episode to series.' });
    }
});


router.get('/series/:seriesId', async (req, res) => {
    const { seriesId } = req.params;

    try {
        const series = await Series.getWithEpisodes(seriesId);
        if (!series) {
            return res.status(404).json({ error: 'Series not found.' });
        }

        res.json({ series });
    } catch (error) {
        console.error('Error fetching series:', error.message);
        res.status(500).json({ error: 'Failed to fetch series.' });
    }
});


// update series
router.put('/series/:id', IsAuth, IsAdmin, async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const series = await Series.update(id, updates);
        if (!series) {
            return res.status(404).json({ error: 'Series not found.' });
        }
        res.json({ message: 'Series updated successfully!', series });
    } catch (error) {
        console.error('Error updating series:', error.message);
        res.status(500).json({ error: 'Failed to update series.' });
    }
});

// delete series
router.delete('/series/:id', IsAuth, IsAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await Series.delete(id);
        if (!deleted) {
            return res.status(404).json({ error: 'Series not found.' });
        }
        // Episodes will be automatically deleted due to CASCADE constraint

        res.json({ message: 'Series deleted successfully!' });
    } catch (error) {
        console.error('Error deleting series:', error.message);
        res.status(500).json({ error: 'Failed to delete series.' });
    }
});

// update episode
router.put('/episode/:id', IsAuth, IsAdmin, async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const episode = await Episode.update(id, updates);
        if (!episode) {
            return res.status(404).json({ error: 'Episode not found.' });
        }
        res.json({ message: 'Episode updated successfully!', episode });
    } catch (error) {
        console.error('Error updating episode:', error.message);
        res.status(500).json({ error: 'Failed to update episode.' });
    }
});

// delete episode
router.delete('/episode/:id', IsAuth, IsAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const episode = await Episode.delete(id);
        if (!episode) {
            return res.status(404).json({ error: 'Episode not found.' });
        }

        res.json({ message: 'Episode deleted successfully!' });
    } catch (error) {
        console.error('Error deleting episode:', error.message);
        res.status(500).json({ error: 'Failed to delete episode.' });
    }
});

module.exports = router;
