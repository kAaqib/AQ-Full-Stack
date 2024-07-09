const express = require('express');
const { getQuiz, saveQuiz, getScore, getTopScores, getMyQuizzes, getResponses } = require('../controllers/quizController');
const router = express.Router();

router.post('/getQuiz', getQuiz);
router.post('/saveQuiz', saveQuiz);
router.post('/getScore', getScore);
router.post('/leaderboard', getTopScores);
router.post('/myquizzes', getMyQuizzes);
router.get('/responsesData', getResponses);

module.exports = router;