const express = require('express');
const { getQuiz, checkCode, saveQuiz, getScore, getTopScores, getMyQuizzes, getMyAnswers, getResponses, deleteQuiz, getReview, getViewQuiz, getEditQuiz } = require('../controllers/quizController');
const router = express.Router();

router.post('/getQuiz', getQuiz);
router.post('/checkCode', checkCode);
router.post('/saveQuiz', saveQuiz);
router.post('/getScore', getScore);
router.post('/leaderboard', getTopScores);
router.post('/myquizzes', getMyQuizzes);
router.post('/myanswers', getMyAnswers);
router.get('/responsesData', getResponses);
router.delete('/deletequiz', deleteQuiz);
router.post('/review', getReview);
router.post('/viewquiz', getViewQuiz);
router.post('/editquiz', getEditQuiz);

module.exports = router;