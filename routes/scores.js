const express = require('express');
const router = express.Router();
const Score = require('../models/Score');
const authMiddleware = require('../middleware/authMiddleware');

// Save score
router.post('/', authMiddleware, async (req, res) => {
  const { quizId, score, totalQuestions } = req.body;
  try {
    if (!quizId || score === undefined || !totalQuestions) {
      return res.status(400).json({ msg: 'All fields required' });
    }

    const newScore = new Score({
      user: req.user,
      quiz: quizId,
      score,
      totalQuestions,
    });

    await newScore.save();
    res.status(201).json({ msg: 'Score saved', score: newScore });
  } catch (err) {
    console.error('Score save error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get user scores
router.get('/', authMiddleware, async (req, res) => {
  try {
    const scores = await Score.find({ user: req.user })
      .populate('quiz', 'title')
      .sort({ createdAt: -1 });
    res.json(scores);
  } catch (err) {
    console.error('Score fetch error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;