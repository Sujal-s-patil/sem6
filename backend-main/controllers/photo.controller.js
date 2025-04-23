const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure "uploads/photo" and "uploads/evidence" directories exist
const photoDir = path.join(__dirname, '../uploads/photo');
const evidenceDir = path.join(__dirname, '../uploads/evidence');

if (!fs.existsSync(photoDir)) {
  fs.mkdirSync(photoDir, { recursive: true });
}
if (!fs.existsSync(evidenceDir)) {
  fs.mkdirSync(evidenceDir, { recursive: true });
}

// Multer config for single and multiple uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (req.originalUrl.includes('/upload-multiple')) {
      cb(null, evidenceDir); // Multiple files upload
    } else if (req.originalUrl.includes('/upload')) {
      cb(null, photoDir); // Single photo upload
    } else {
      cb(new Error('Invalid upload route'), null);
    }
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
  const fileUrl = `http://localhost:5555/uploads/photo/${req.file.filename}`;
  res.json({ url: fileUrl });
};

// Controller for multiple file uploads
const uploadMultipleFiles = (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }

  const fileUrls = req.files.map(file => ({
    originalName: file.originalname,
    url: `http://localhost:5555/uploads/evidence/${file.filename}`
  }));

  res.json({ files: fileUrls });
};

module.exports = {
  upload,
  uploadSingleFile,
  uploadMultipleFiles
};