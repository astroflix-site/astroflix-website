const express = require('express')
const router = express.Router
const User = require('../models/user')
// add bookmark 
router.post('/bookmark', async (req, res) => {
    const { userId, contentId } = req.body;
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
        res.status(500).json({ message: 'Internal server error', error });
    }
});

//remove bookmark
router.post('/unbookmark', async (req, res) => {
    const { userId, contentId } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        user.bookmarks = user.bookmarks.filter((id) => id.toString() !== contentId);
        await user.save();
        return res.status(200).json({ message: 'Bookmark removed' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
});

//fetch bookmarks of a particular user
router.get('/bookmarks/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('bookmarks');
        if (!user) return res.status(404).json({ message: 'User not found' });
        return res.status(200).json(user.bookmarks);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
});

module.exports = router;