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

        if (!user.bookmarks.includes(contentId)) {
            user.bookmarks.push(contentId);
            await user.save();
            return res.status(200).json({ message: 'Bookmark added' });
        }
        return res.status(400).json({ message: 'Already bookmarked' });
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

        user.bookmarks = user.bookmarks.filter((id) => id.toString() !== contentId);
        await user.save();
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
        const user = await User.findById(userId).populate('bookmarks');
        if (!user) return res.status(404).json({ message: 'User not found' });
        return res.status(200).json({ bookmarks: user.bookmarks });
    } catch (error) {
        console.error("Fetch bookmarks error:", error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = router;