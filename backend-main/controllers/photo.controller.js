const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require("./sql");
const port=5555;

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
  const fileUrl = `http://localhost:${port}/uploads/photo/${req.file.filename}`;
  res.json({ url: fileUrl });
};

// Controller for multiple file uploads
const uploadMultipleFiles = (req, res) => {
  const complaint_id = req.body.complaint_id;

  if (!complaint_id || !req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'Complaint ID and files are required.' });
  }

  const insertLinks = `
      INSERT INTO links (complaint_id, link) VALUES ?
    `;
  const fileLinks = req.files.map(file => [
    complaint_id,
    `http://localhost:${port}/uploads/evidence/${file.filename}`
  ]);

  db.query(insertLinks, [fileLinks], (err, result) => {
    if (err) {
      console.error('Error inserting file links:', err);
      return res.status(500).json({ error: 'Database error inserting links.' });
    }
    res.status(200).json({ message: 'Files linked to complaint successfully' });
  });
};

const getFilesById = (req, res) => {
  const { id } = req.params;
  db.query(`SELECT link FROM links WHERE complaint_id = ?`, [id], (error, results) => {
    if (error) {
      res.json({ message: "Error getting files police", error });
    } else if (results.affectedRows === 0) {
      res.json({ message: "No ticket found with the given complaint ID" });
    } else {
      res.json(results);
    }
  }
  );
}




module.exports = {
  upload,
  uploadSingleFile,
  uploadMultipleFiles,
  getFilesById
};