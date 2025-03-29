const mongoose = require('mongoose');

const typingSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  wpm: {
    type: Number,
    required: true
  },
  accuracy: {
    type: Number,
    required: true
  },
  totalErrors: {
    type: Number,
    required: true
  },
  errorWords: [{
    word: String,
    count: Number
  }],
  typingDurations: [{
    word: String,
    duration: Number
  }],
  psychologicalInsights: {
    impulsivity: Number, // 0-100 scale
    cognitiveLoad: Number,
    resilience: Number,
    anxietyLevel: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
typingSessionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('TypingSession', typingSessionSchema); 