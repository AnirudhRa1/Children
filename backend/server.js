const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const { execFile } = require('child_process');
const ChildrenResult = require('./models/ChildrenResult');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connect without dotenv
mongoose.connect('mongodb://127.0.0.1:27017/readingApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB connected');
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.resolve('uploads')));

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `audio-${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

// Health check
app.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  res.status(200).json({
    status: 'ok',
    database: dbState === 1 ? 'connected' : 'disconnected',
    dbState
  });
});

// Upload audio
app.post('/api/upload', upload.single('audio'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({
    message: 'Audio uploaded successfully',
    filename: req.file.filename,
    path: req.file.path
  });
});

// Analyze & save
app.post('/api/analyze/:filename', (req, res) => {
  const filename = req.params.filename;
  const { childId, name, prompt } = req.body;
  const filePath = path.join(__dirname, 'uploads', filename);
  const scriptPath = path.join(__dirname, 'whisper_transcribe.py');

  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Audio file not found' });
  if (!childId || !name || !prompt) return res.status(400).json({ error: 'Missing childId, name, or prompt' });

  execFile('python', [scriptPath, filePath], { timeout: 120000 }, async (err, stdout, stderr) => {
    if (err) {
      console.error('[❌] Whisper error:', stderr || err.message);
      return res.status(500).json({ error: 'Transcription failed' });
    }

    const transcript = stdout.trim();
    const promptWords = prompt.trim().toLowerCase().split(/\s+/);
    const transcriptWords = transcript.trim().toLowerCase().split(/\s+/);
    const matchingWords = transcriptWords.filter(word => promptWords.includes(word)).length;
    const accuracy = matchingWords / promptWords.length;

    const hesitationScore = transcriptWords.length > 1
      ? 1 - (Math.abs(transcriptWords.length - promptWords.length) / promptWords.length)
      : 0.5;

    const pronunciationScore = accuracy * 0.9 + 0.1;
    const expressionFeedback = accuracy > 0.8 ? 'Clear and expressive' : 'Needs improvement';
    const proficiencyLevel = prompt.length < 10 ? 'Letters'
      : prompt.length < 25 ? 'Words'
      : prompt.length < 60 ? 'Sentences'
      : 'Paragraphs';

    try {
      const result = await ChildrenResult.create({
        childId,
        name,
        prompt,
        transcript,
        accuracy,
        pronunciationScore,
        hesitationScore,
        expressionFeedback,
        proficiencyLevel,
        recordingUrl: `uploads/${filename}`
      });
      console.log('[🗃️] MongoDB Record Saved:', result);
      return res.json({ message: '✅ Analysis saved', data: result });
    } catch (saveErr) {
      console.error('[❌] DB Save Error:', saveErr);
      return res.status(500).json({ error: 'Failed to save to DB' });
    }
  });
});

// View all results
app.get('/childrenresults', async (req, res) => {
  try {
    const results = await ChildrenResult.find();
    res.json(results);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

// View result by childId
app.get('/childrenresults/:childId', async (req, res) => {
  try {
    const result = await ChildrenResult.findOne({ childId: req.params.childId });
    if (!result) return res.status(404).json({ error: 'Child not found' });
    res.json(result);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch child result' });
  }
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.path });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
