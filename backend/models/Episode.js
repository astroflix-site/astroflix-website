const mongoose = require('mongoose')

const episodeSchema = new mongoose.Schema({
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
    episodeNumber: {
        type: Number,
        required: true
    },
    season: {
        type: Number,
        default: 1
    },
    series: { type: mongoose.Schema.Types.ObjectId, ref: 'Series' },
    createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model("Episode", episodeSchema);
