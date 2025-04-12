const mongoose = require('mongoose');
const Quiz = require('./models/Quiz.js');
require('dotenv').config();
console.log('Quiz model:', Quiz);

const quizzes = [
  {
    title: 'General Knowledge Trivia',
    category: 'General Knowledge',
    difficulty: 'easy',
    questions: [
      {
        questionText: 'What is the capital of France?',
        options: ['Paris', 'London', 'Berlin', 'Madrid'],
        correctAnswer: 'Paris',
      },
    ],
    createdBy: '000000000000000000000000',
  },
  {
    title: 'Tech Quiz',
    category: 'Technology',
    difficulty: 'medium',
    questions: [
      {
        questionText: 'What does HTML stand for?',
        options: [
          'HyperText Markup Language',
          'HighText Machine Language',
          'HyperTool Multi Language',
          'None of these',
        ],
        correctAnswer: 'HyperText Markup Language',
      },
    ],
    createdBy: '000000000000000000000000',
  },
  {
    title: 'Science Challenge',
    category: 'Science',
    difficulty: 'hard',
    questions: [
      {
        questionText: 'What is the chemical symbol for gold?',
        options: ['Au', 'Ag', 'Fe', 'Cu'],
        correctAnswer: 'Au',
      },
    ],
    createdBy: '000000000000000000000000',
  },
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    await Quiz.deleteMany({});
    await Quiz.insertMany(quizzes);
    console.log('Quizzes seeded');
    mongoose.connection.close();
  })
  .catch(err => console.error('Seed error:', err));