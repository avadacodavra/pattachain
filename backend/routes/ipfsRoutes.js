const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { uploadFile, uploadMetadata } = require('../controllers/ipfsController');

router.post('/upload-file', upload.single('file'), uploadFile);
router.post('/upload-metadata', uploadMetadata);

module.exports = router;