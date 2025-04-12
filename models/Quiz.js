const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['General Knowledge', 'Technology', 'Science', 'History', 'Other'],
  },
  difficulty: {
    type: String,
    required: [true, 'Difficulty is required'],
    enum: ['easy', 'medium', 'hard'],
  },
  questions: [
    {
      questionText: {
        type: String,
        required: [true, 'Question text is required'],
      },
      options: {
        type: [String],
        required: [true, 'Options are required'],
        validate: {
          validator: function (v) {
            return v.length >= 2;
          },
          message: 'At least 2 options required',
        },
      },
      correctAnswer: {
        type: String,
        required: [true, 'Correct answer is required'],
      },
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Quiz', quizSchema);