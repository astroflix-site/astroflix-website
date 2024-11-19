const mongoose = require('mongoose')

const Video = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    playlist: { type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' },
    createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model("Video", Video);