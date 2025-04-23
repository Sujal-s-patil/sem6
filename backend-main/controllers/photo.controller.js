const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure "uploads" directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Controller for single file upload
const uploadSingleFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const fileUrl = `http://localhost:5555/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
};

// Controller for multiple file uploads
const uploadMultipleFiles = (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }

  const fileUrls = req.files.map(file => ({
    originalName: file.originalname,
    url: `http://localhost:5555/uploads/${file.filename}`
  }));

  res.json({ files: fileUrls });
};

module.exports = {
  upload,
  uploadSingleFile,
  uploadMultipleFiles
};