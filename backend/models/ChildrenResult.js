const mongoose = require('mongoose');

const ChildrenResultSchema = new mongoose.Schema({
  childId: {
    type: String,
    required: true,
    unique: true // optional but recommended if childId is unique
  },
  name: {
    type: String,
    required: true
  },
  prompt: {
    type: String,
    required: true
  },
  transcript: {
    type: String,
    required: true
  },
  accuracy: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  pronunciationScore: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  hesitationScore: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  expressionFeedback: {
    type: String
  },
  proficiencyLevel: {
    type: String,
    enum: ['Letters', 'Words', 'Sentences', 'Paragraphs'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  recordingUrl: {
    type: String
  }
});

module.exports = mongoose.model('ChildrenResult', ChildrenResultSchema);
