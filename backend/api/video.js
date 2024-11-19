const express = require('express')
const router = express.Router();
const Video = require('../models/videos')
const multer = require('multer');
const IsAuth = require('../middleware/auth');
const IsAdmin = require('../middleware/authtoken');
const FormData = require('form-data');
const Playlist = require('../models/playlist');
const axios = require('axios')
// api to create playlist/anime-series
router.post('/new-series', IsAuth, IsAdmin, async (req, res) => {
  const { title, description, imageURL } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required.' });
  }

  try {
    const newPlaylist = new Playlist({ title, description, imageURL });
    await newPlaylist.save();
    res.json({ message: 'Series created successfully!', playlist: newPlaylist });
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

  const { playlistId, title } = req.body; // Playlist and title provided by the user
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
      if (!slug || !title) {
          console.error("Missing required fields in PlayerX response or request:", playerXResponse.data);
          return res.status(500).json({ error: "Incomplete video data." });
      }
      // Save video info to MongoDB
      const newVideo = new Video({
          url: slug,  // Save the full video URL
          title: title, // Title from the form data
      });

      if (playlistId) {
          // Check if the playlist exists
          const playlist = await Playlist.findById(playlistId);
          if (!playlist) {
              return res.status(404).json({ error: "Playlist not found." });
          }

          // Associate video with playlist
          playlist.videos.push(newVideo._id); // Add video to playlist's list of videos
          newVideo.playlist = playlist._id; // Link back from the video to the playlist

          await playlist.save(); // Save playlist with new video
      }

      await newVideo.save(); // Save the video

      res.json({ message: "Video uploaded and saved!", video: newVideo });
  } catch (error) {
      console.error("Error uploading to PlayerX:", error.response?.data || error);
      res.status(500).json({ error: "Failed to upload video." });
  }
});


//playlist search
router.get('/search-playlists', async (req, res) => {
  const { title } = req.query; // Get title from query parameter

  try {
      // Find playlists with title matching the search term (case-insensitive)
      const playlists = await Playlist.find({ title: { $regex: title, $options: 'i' } });

      if (playlists.length === 0) {
          return res.status(404).json({ error: 'No playlists found.' });
      }

      res.json({ playlists });
  } catch (error) {
      console.error('Error searching playlists:', error.message);
      res.status(500).json({ error: 'Failed to search playlists.' });
  }
});


// fetch videos api
router.get('/videos/:video_title', async (req, res) => {
  const { video_title } = req.params;

  try {
    const video = await Video.findOne({ title: video_title });
    if (!video) {
      return res.status(404).json({ error: 'Video not found.' });
    }
    res.json({ video });
  } catch (error) {
    console.error("Failed to fetch video:", error.message);
    res.status(500).json({ error: "Failed to fetch video." });
  }
});



//add video to playlist
router.post('/playlist/:playlistId/add-video', IsAuth, IsAdmin, async (req, res) => {
    const { playlistId } = req.params;
    const { videoId } = req.body;
  
    try {
      const playlist = await Playlist.findById(playlistId);
      if (!playlist) {
        return res.status(404).json({ error: 'Playlist not found.' });
      }
  
      const video = await Video.findById(videoId);
      if (!video) {
        return res.status(404).json({ error: 'Video not found.' });
      }
  
      // Associate the video with the playlist
      playlist.videos.push(video._id);
      video.playlist = playlist._id;
  
      await playlist.save();
      await video.save();
  
      res.json({ message: 'Video added to playlist!', playlist });
    } catch (error) {
      console.error('Error adding video to playlist:', error.message);
      res.status(500).json({ error: 'Failed to add video to playlist.' });
    }
  });
  

  router.get('/playlist/:playlistId', async (req, res) => {
    const { playlistId } = req.params;
  
    try {
      const playlist = await Playlist.findById(playlistId).populate('videos');
      if (!playlist) {
        return res.status(404).json({ error: 'Playlist not found.' });
      }
  
      res.json({ playlist });
    } catch (error) {
      console.error('Error fetching playlist:', error.message);
      res.status(500).json({ error: 'Failed to fetch playlist.' });
    }
  });
  
module.exports = router;