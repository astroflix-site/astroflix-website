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
        const newSeries = new Series({ title, description, imageURL, backdrop, genre, releaseDate, status, rating, totalEpisodes });
        await newSeries.save();
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
        // Save episode info to MongoDB
        const newEpisode = new Episode({
            url: slug,  // Save the full video URL
            title: title, // Title from the form data
            episodeNumber: episodeNumber,
            season: season || 1
        });

        if (seriesId) {
            // Check if the series exists
            const series = await Series.findById(seriesId);
            if (!series) {
                return res.status(404).json({ error: "Series not found." });
            }

            // Associate episode with series
            series.episodes.push(newEpisode._id); // Add episode to series's list of episodes
            newEpisode.series = series._id; // Link back from the episode to the series

            await series.save(); // Save series with new episode
        }

        await newEpisode.save(); // Save the episode

        res.json({ message: "Episode uploaded and saved!", episode: newEpisode });
    } catch (error) {
        console.error("Error uploading to PlayerX:", error.response?.data || error);
        res.status(500).json({ error: "Failed to upload episode." });
    }
});


// api to create episode directly (e.g. from URL)
router.post('/new-episode', IsAuth, IsAdmin, async (req, res) => {
    const { title, episodeNumber, url, seriesId, season } = req.body;

    if (!title || !episodeNumber || !url) {
        return res.status(400).json({ error: 'Title, Episode Number, and URL are required.' });
    }

    try {
        const newEpisode = new Episode({
            title,
            episodeNumber,
            url,
            series: seriesId || null,
            season: season || 1
        });

        if (seriesId) {
            const series = await Series.findById(seriesId);
            if (series) {
                series.episodes.push(newEpisode._id);
                await series.save();
            }
        }

        await newEpisode.save();
        res.json({ message: 'Episode created successfully!', episode: newEpisode });
    } catch (error) {
        console.error('Error creating episode:', error.message);
        res.status(500).json({ error: 'Failed to create episode.' });
    }
});

//series search
router.get('/search-series', async (req, res) => {
    const { title } = req.query; // Get title from query parameter

    try {
        // Find series with title matching the search term (case-insensitive)
        const seriesList = await Series.find({ title: { $regex: title, $options: 'i' } });

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
        const episode = await Episode.findOne({ title: episode_title });
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

        // Associate the episode with the series
        series.episodes.push(episode._id);
        episode.series = series._id;

        await series.save();
        await episode.save();

        res.json({ message: 'Episode added to series!', series });
    } catch (error) {
        console.error('Error adding episode to series:', error.message);
        res.status(500).json({ error: 'Failed to add episode to series.' });
    }
});


router.get('/series/:seriesId', async (req, res) => {
    const { seriesId } = req.params;

    try {
        const series = await Series.findById(seriesId).populate('episodes');
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
        const series = await Series.findByIdAndUpdate(id, updates, { new: true });
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
        const series = await Series.findByIdAndDelete(id);
        if (!series) {
            return res.status(404).json({ error: 'Series not found.' });
        }
        // Optional: Delete associated episodes if needed, but for now just the series doc
        // await Episode.deleteMany({ series: id }); 

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
        const episode = await Episode.findByIdAndUpdate(id, updates, { new: true });
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
        const episode = await Episode.findByIdAndDelete(id);
        if (!episode) {
            return res.status(404).json({ error: 'Episode not found.' });
        }

        // Remove from series if associated
        if (episode.series) {
            await Series.findByIdAndUpdate(episode.series, { $pull: { episodes: id } });
        }

        res.json({ message: 'Episode deleted successfully!' });
    } catch (error) {
        console.error('Error deleting episode:', error.message);
        res.status(500).json({ error: 'Failed to delete episode.' });
    }
});

module.exports = router;
