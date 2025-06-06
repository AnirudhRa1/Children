import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Create a storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = './uploads/';
    fs.mkdirSync(uploadPath, { recursive: true }); // ensure directory exists
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `audio-${Date.now()}${ext}`);
  }
});

const upload = multer({ storage: storage });

// POST /api/upload
router.post('/upload', upload.single('audio'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No audio file uploaded' });
  }

  res.json({
    message: 'Audio uploaded successfully',
    filename: req.file.filename,
    path: req.file.path,
  });
});

export default router;
