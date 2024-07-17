const express = require('express');
const path = require('path');
const { registerUser, validateUser, getMyQuizzes, getMyAnswers, getMyDrafts } = require('../controllers/userController');
const router = express.Router();


router.get('/api/v1/users/:username/quizzes', getMyQuizzes);
router.get('/api/v1/users/:username/answers', getMyAnswers);
router.get('/api/v1/users/:username/drafts', getMyDrafts);

router.post('/register', registerUser);
router.post('/login', validateUser);

module.exports = router;