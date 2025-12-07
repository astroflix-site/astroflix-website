const mongoose = require('mongoose');

const seriesSchema = new mongoose.Schema({
    imageURL: { type: String, required: true, },
    backdrop: { type: String },
    title: { type: String, required: true, unique: true },
    description: { type: String },
    genre: { type: String },
    releaseDate: { type: Date },
    status: { type: String },
    rating: { type: Number },
    totalEpisodes: { type: Number, default: 0 },
    episodes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Episode' }],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Series', seriesSchema);
