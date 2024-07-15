const express = require('express');
const { getSaveDraft, getMyDrafts, getViewDQuiz, getEditDQuiz, deleteDQuiz } = require('../controllers/draftController');
const router = express.Router();

router.post('/savedraft', getSaveDraft);
router.post('/mydrafts', getMyDrafts);
router.post('/viewDquiz', getViewDQuiz);
router.post('/editDquiz', getEditDQuiz);
router.delete('/deleteDquizData', deleteDQuiz);
module.exports = router;