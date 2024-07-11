const express = require('express');
const { getQuiz, saveQuiz, getScore, getTopScores, getMyQuizzes, getMyAnswers, getResponses, deleteQuiz, getReview } = require('../controllers/quizController');
const router = express.Router();

router.post('/getQuiz', getQuiz);
router.post('/saveQuiz', saveQuiz);
router.post('/getScore', getScore);
router.post('/leaderboard', getTopScores);
router.post('/myquizzes', getMyQuizzes);
router.post('/myanswers', getMyAnswers);
router.get('/responsesData', getResponses);
router.delete('/deletequizData', deleteQuiz);
router.post('/review', getReview);

module.exports = router;