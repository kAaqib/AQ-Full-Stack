const express = require('express');
const { getQuiz, checkCode, saveQuiz, getScore, getTopScores, getMyQuizzes, getMyAnswers, getResponses, deleteQuiz, getReview, getViewQuiz, getEditQuiz } = require('../controllers/quizController');
const router = express.Router();

router.get('/api/v1/quizzes/:code', getQuiz);
router.get('/api/v1/quizzes/:code/leaderboard', getTopScores);
router.get('/api/v1/quizzes/:code/responses', getResponses);
router.get('/api/v1/quizzes/:username/:code/review', getReview);
router.get('/api/v1/quizzes/:code/view', getViewQuiz);

router.put('/api/v1/quizzes/:code', getEditQuiz);

router.post('/api/v1/quizzes/check-code', checkCode);
router.post('/api/v1/quizzes', saveQuiz);
router.post('/api/v1/quizzes/score', getScore);

router.delete('/api/v1/quizzes/:username/:code', deleteQuiz);

module.exports = router;