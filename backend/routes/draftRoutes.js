const express = require('express');
const { getSaveDraft, getMyDrafts, getViewDQuiz, getEditDQuiz, deleteDQuiz } = require('../controllers/draftController');
const router = express.Router();

router.post('/savedraft', getSaveDraft);
router.post('/mydrafts', getMyDrafts);
router.post('/viewdraft', getViewDQuiz);
router.post('/editdraft', getEditDQuiz);
router.delete('/deletedraft', deleteDQuiz);

module.exports = router;