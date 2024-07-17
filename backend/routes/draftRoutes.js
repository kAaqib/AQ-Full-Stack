const express = require('express');
const { getSaveDraft, getViewDQuiz, getEditDQuiz, deleteDQuiz } = require('../controllers/draftController');
const router = express.Router();


router.get('/api/v1/drafts/:code', getViewDQuiz);
router.get('/api/v1/drafts/:code/edit', getEditDQuiz);

router.post('/api/v1/drafts', getSaveDraft);

router.delete('/api/v1/drafts/:username/:code', deleteDQuiz);

module.exports = router;