const express = require('express');
const router = express.Router();
const TypingSession = require('../models/TypingSession');
const auth = require('../middleware/auth');

// Store new typing session
router.post('/', auth, async (req, res) => {
  try {
    const {
      wpm,
      accuracy,
      totalErrors,
      errorWords,
      typingDurations,
      psychologicalInsights
    } = req.body;

    const session = new TypingSession({
      userId: req.user._id,
      wpm,
      accuracy,
      totalErrors,
      errorWords,
      typingDurations,
      psychologicalInsights
    });

    await session.save();
    res.status(201).json(session);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user's typing sessions
router.get('/', auth, async (req, res) => {
  try {
    const sessions = await TypingSession.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(sessions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get session analysis
router.get('/analysis/:sessionId', auth, async (req, res) => {
  try {
    const session = await TypingSession.findOne({
      _id: req.params.sessionId,
      userId: req.user._id
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Calculate additional insights
    const analysis = {
      ...session.toObject(),
      insights: {
        errorPatterns: analyzeErrorPatterns(session.errorWords),
        speedVariations: analyzeSpeedVariations(session.typingDurations),
        psychologicalProfile: analyzePsychologicalProfile(session.psychologicalInsights)
      }
    };

    res.json(analysis);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Helper functions for analysis
function analyzeErrorPatterns(errorWords) {
  const patterns = {
    mostCommonErrors: errorWords
      .sort((a, b) => b.count - a.count)
      .slice(0, 5),
    errorFrequency: errorWords.reduce((acc, curr) => acc + curr.count, 0) / errorWords.length
  };
  return patterns;
}

function analyzeSpeedVariations(typingDurations) {
  const speeds = typingDurations.map(d => d.duration);
  return {
    averageSpeed: speeds.reduce((a, b) => a + b, 0) / speeds.length,
    speedVariation: Math.max(...speeds) - Math.min(...speeds),
    slowestWords: typingDurations
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 5)
  };
}

function analyzePsychologicalProfile(insights) {
  return {
    typingStyle: determineTypingStyle(insights),
    pressureHandling: determinePressureHandling(insights),
    cognitiveLoad: determineCognitiveLoad(insights)
  };
}

function determineTypingStyle(insights) {
  if (insights.impulsivity > 70) return 'Impulsive';
  if (insights.impulsivity < 30) return 'Deliberate';
  return 'Balanced';
}

function determinePressureHandling(insights) {
  if (insights.anxietyLevel > 70) return 'High Pressure';
  if (insights.anxietyLevel < 30) return 'Calm Under Pressure';
  return 'Moderate Pressure';
}

function determineCognitiveLoad(insights) {
  if (insights.cognitiveLoad > 70) return 'High';
  if (insights.cognitiveLoad < 30) return 'Low';
  return 'Moderate';
}

module.exports = router; 