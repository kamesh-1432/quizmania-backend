const express = require('express');
const router = express.Router();
const Score = require('../models/Score');
const User = require('../models/User');

// Get leaderboard
router.get('/', async (req, res) => {
  try {
    const leaderboard = await Score.aggregate([
      {
        $group: {
          _id: '$user',
          totalQuizzes: { $sum: 1 },
          totalScore: { $sum: '$score' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          name: '$user.name',
          totalQuizzes: 1,
          totalScore: 1,
        },
      },
      { $sort: { totalScore: -1, totalQuizzes: -1 } },
      { $limit: 10 },
    ]);

    console.log('Leaderboard:', leaderboard);
    res.json(leaderboard);
  } catch (err) {
    console.error('Leaderboard fetch error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;