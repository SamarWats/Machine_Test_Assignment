const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const { uploadAndDistribute } = require('../controllers/uploadController');

router.post('/upload', protect, upload.single('file'), uploadAndDistribute);

module.exports = router;
