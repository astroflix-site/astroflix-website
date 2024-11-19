const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  imageURL: {type: String,required: true,},
  title: { type: String, required: true, unique:true }, // Playlist title (e.g., anime series name)
  description: { type: String },          // Optional description
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }], // Array of video references
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Playlist', playlistSchema);
