const multer = require('multer');
const path = require('path');

// Define storage options for Multer (e.g., to save files to a directory)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/videos'); // Define the directory for video uploads
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    cb(null, Date.now() + fileExtension); // Save the file with a timestamp to avoid name conflicts
  }
});

// Video file validation (for example, allow only mp4 and webm files)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['video/mp4', 'video/webm'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only mp4 and webm are allowed.'));
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // Max file size 500MB
  fileFilter: fileFilter,
});

module.exports = upload;
