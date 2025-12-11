const express = require('express')
const router = express.Router();
const User = require('../models/User')
const IsAuth = require('../middleware/auth');

// add bookmark 
router.post('/bookmark', IsAuth, async (req, res) => {
    const { contentId } = req.body;
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Check if bookmark already exists
        const hasBookmark = await User.hasBookmark(userId, contentId);
        if (hasBookmark) {
            return res.status(400).json({ message: 'Already bookmarked' });
        }

        // Add bookmark
        await User.addBookmark(userId, contentId);
        return res.status(200).json({ message: 'Bookmark added' });
    } catch (error) {
        console.error("Bookmark error:", error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

//remove bookmark
router.post('/unbookmark', IsAuth, async (req, res) => {
    const { contentId } = req.body;
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Remove bookmark
        await User.removeBookmark(userId, contentId);
        return res.status(200).json({ message: 'Bookmark removed' });
    } catch (error) {
        console.error("Unbookmark error:", error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

//fetch bookmarks of the authenticated user
router.get('/bookmarks', IsAuth, async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Get bookmarks with series details
        const bookmarks = await User.getBookmarks(userId);

        // Format bookmarks to match MongoDB response structure
        const formattedBookmarks = bookmarks.map(bookmark => ({
            _id: bookmark.id,
            imageURL: bookmark.image_url,
            backdrop: bookmark.backdrop,
            title: bookmark.title,
            description: bookmark.description,
            genre: bookmark.genre,
            releaseDate: bookmark.release_date,
            status: bookmark.status,
            rating: bookmark.rating,
            totalEpisodes: bookmark.total_episodes,
            createdAt: bookmark.created_at
        }));

        return res.status(200).json({ bookmarks: formattedBookmarks });
    } catch (error) {
        console.error("Fetch bookmarks error:", error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = router;