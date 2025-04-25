const express = require('express');
const { upload, uploadSingleFile, uploadMultipleFiles ,getFilesById} = require('../controllers/photo.controller.js');

const photoRouter = express.Router();

// Route to upload a single file
photoRouter.post('/upload', upload.single('photo'), uploadSingleFile);

// Route to upload multiple files
photoRouter.post('/upload-multiple', upload.array('files', 10), uploadMultipleFiles);

//Route to get all photos
photoRouter.get("/:id",getFilesById);

module.exports = photoRouter;