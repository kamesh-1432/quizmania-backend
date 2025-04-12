const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
  try {
    const { search, category, difficulty } = req.query;
    let query = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }
    if (difficulty) {
      query.difficulty = difficulty;
    }

    const quizzes = await Quiz.find(query)
      .select('title category difficulty createdAt createdBy')
      .populate('createdBy', 'name');
    res.json(quizzes);
  } catch (err) {
    console.error('Quiz fetch error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/:quizId', authMiddleware, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId).populate('createdBy', 'name');
    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (err) {
    console.error('Quiz fetch error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  const { title, category, difficulty, questions } = req.body;
  try {
    if (!title || !category || !difficulty || !questions || questions.length === 0) {
      return res.status(400).json({ msg: 'All fields required, including at least one question' });
    }

    for (const q of questions) {
      if (!q.questionText || !q.options || q.options.length < 2 || !q.correctAnswer) {
        return res.status(400).json({ msg: 'Each question needs text, at least 2 options, and a correct answer' });
      }
      if (!q.options.includes(q.correctAnswer)) {
        return res.status(400).json({ msg: 'Correct answer must be one of the options' });
      }
    }

    const quiz = new Quiz({
      title,
      category,
      difficulty,
      questions,
      createdBy: req.user,
    });

    await quiz.save();
    res.status(201).json({ msg: 'Quiz created', quiz });
  } catch (err) {
    console.error('Quiz create error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;