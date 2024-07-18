const express = require('express');
const { getSaveDraft } = require('../controllers/draftController');
const router = express.Router();

/**
 * @swagger
 * /api/v1/drafts:
 *   post:
 *     tags: [Quizzes]
 *     summary: Save quiz as a draft.
 *     description: Save the provided quiz data as a draft for the specified user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username of the user
 *               code:
 *                 type: string
 *                 description: Quiz code
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     question:
 *                       type: string
 *                       description: The quiz question
 *                     a:
 *                       type: string
 *                       description: Option A
 *                     b:
 *                       type: string
 *                       description: Option B
 *                     c:
 *                       type: string
 *                       description: Option C
 *                     d:
 *                       type: string
 *                       description: Option D
 *                     ans:
 *                       type: string
 *                       description: The correct answer
 *               editflag:
 *                 type: string
 *                 description: Flag to indicate if this is an edit of an existing draft
 *             required:
 *               - username
 *               - code
 *               - questions
 *     responses:
 *       '201':
 *         description: Draft saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Draft saved successfully!
 *                 Code:
 *                   type: string
 *                   example: quizCode
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Server error
 */
router.post('/api/v1/drafts', getSaveDraft);

module.exports = router;