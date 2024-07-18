const express = require('express');
const { getQuiz, checkCode, saveQuiz, getScore, getTopScores, getResponses, deleteQuiz, getReview, getViewQuiz, getEditQuiz, toggleStatus } = require('../controllers/quizController');
const router = express.Router();

/**
 * @swagger
 * /api/v1/quizzes/{code}:
 *   get:
 *     tags: [Quizzes]
 *     summary: Get quiz by code.
 *     description: Get quiz by code.
 *     parameters:
 *       - in: path
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: Quiz code
 *     responses:
 *       '200':
 *         description: A successful response
 *       '400':
 *         description: Code not sent
 *       '404':
 *         description: Quiz not found
 *       '500':
 *         description: Internal server error
 */
router.get('/api/v1/quizzes/:code', getQuiz);

/**
 * @swagger
 * /api/v1/quizzes/{code}/leaderboard:
 *   get:
 *     tags: [Quizzes]
 *     summary: Get top scores of a quiz.
 *     description: Get the top 10 scores of a quiz by its code.
 *     parameters:
 *       - in: path
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: Quiz code
 *     responses:
 *       '200':
 *         description: A successful response with the top 10 scores
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Top10:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 *                       score:
 *                         type: number
 *                       lastanswered:
 *                         type: string
 *                         format: date-time
 *       '400':
 *         description: Code not sent
 *       '404':
 *         description: Quiz not found
 *       '500':
 *         description: Internal server error
 */
router.get('/api/v1/quizzes/:code/leaderboard', getTopScores);

/**
 * @swagger
 * /api/v1/quizzes/{code}/responses:
 *   get:
 *     tags: [Quizzes]
 *     summary: Get responses of a quiz.
 *     description: Get all responses of a quiz by its code.
 *     parameters:
 *       - in: path
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: Quiz code
 *     responses:
 *       '200':
 *         description: A successful response with the quiz responses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 Scores:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 *                       score:
 *                         type: number
 *                       lastanswered:
 *                         type: string
 *                         format: date-time
 *       '404':
 *         description: Quiz not found
 *       '500':
 *         description: Internal server error
 */
router.get('/api/v1/quizzes/:code/responses', getResponses);

/**
 * @swagger
 * /api/v1/quizzes/{code}/view:
 *   get:
 *     tags: [Quizzes]
 *     summary: View quiz questions by code.
 *     description: Retrieve the questions of a quiz by its code.
 *     parameters:
 *       - in: path
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: Quiz code
 *     responses:
 *       '200':
 *         description: A successful response with the quiz questions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   question:
 *                     type: string
 *                   a:
 *                     type: string
 *                   b:
 *                     type: string
 *                   c:
 *                     type: string
 *                   d:
 *                     type: string
 *       '400':
 *         description: Code not sent
 *       '404':
 *         description: Quiz not found
 *       '500':
 *         description: Internal server error
 */
router.get('/api/v1/quizzes/:code/view', getViewQuiz);

/**
 * @swagger
 * /api/v1/quizzes:
 *   put:
 *     tags: [Quizzes]
 *     summary: Edit quiz by code.
 *     description: Retrieve quiz details for editing by its code.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: Quiz code
 *     responses:
 *       '200':
 *         description: A successful response with the quiz details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 questions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       question:
 *                         type: string
 *                       a:
 *                         type: string
 *                       b:
 *                         type: string
 *                       c:
 *                         type: string
 *                       d:
 *                         type: string
 *       '400':
 *         description: Code not sent
 *       '404':
 *         description: Quiz not found
 *       '500':
 *         description: Internal server error
 */
router.put('/api/v1/quizzes', getEditQuiz);

/**
 * @swagger
 * /api/v1/quizzes/status:
 *   put:
 *     tags: [Quizzes]
 *     summary: Toggle quiz status.
 *     description: Toggle the status of a quiz between active and inactive.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: Quiz code
 *               username:
 *                 type: string
 *                 description: Username of the quiz owner
 *             required:
 *               - code
 *               - username
 *     responses:
 *       '200':
 *         description: Successfully toggled quiz status
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                   status:
 *                     type: boolean
 *       '400':
 *         description: Quiz code or username not sent
 *       '404':
 *         description: User or quiz not found
 *       '500':
 *         description: Internal server error
 */
router.put('/api/v1/quizzes/status', toggleStatus);

/**
 * @swagger
 * /api/v1/quizzes/review:
 *   post:
 *     tags: [Quizzes]
 *     summary: Get quiz review.
 *     description: Retrieve the review for a specific quiz answered by the user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: Quiz code
 *               username:
 *                 type: string
 *                 description: Username of the user
 *             required:
 *               - code
 *               - username
 *     responses:
 *       '200':
 *         description: Successfully retrieved quiz review
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   qna:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         question:
 *                           type: string
 *                         answer:
 *                           type: string
 *       '400':
 *         description: Code not sent or quiz not attempted by the user
 *       '404':
 *         description: User has not answered any quizzes
 *       '500':
 *         description: Server error
 */
router.post('/api/v1/quizzes/review', getReview);

/**
 * @swagger
 * /api/v1/quizzes/check-code:
 *   post:
 *     tags: [Quizzes]
 *     summary: Check quiz code.
 *     description: Verify if the provided quiz code exists and its status.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: Quiz code
 *             required:
 *               - code
 *     responses:
 *       '200':
 *         description: Quiz code is valid and active
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Quiz code exists
 *       '400':
 *         description: Bad request or Quiz code is invalid/inactive
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Quiz is inactive or Code should contain alphabets
 *       '500':
 *         description: Server error
 */
router.post('/api/v1/quizzes/check-code', checkCode);

/**
 * @swagger
 * /api/v1/quizzes:
 *   post:
 *     tags: [Quizzes]
 *     summary: Save or update a quiz.
 *     description: Save a new quiz or update an existing quiz.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username of the quiz creator
 *               quizCode:
 *                 type: string
 *                 description: Code of the quiz
 *               questions:
 *                 type: object
 *                 description: Quiz questions
 *               editflag:
 *                 type: string
 *                 description: Flag indicating if the quiz is being edited
 *             required:
 *               - username
 *               - quizCode
 *               - questions
 *               - editflag
 *     responses:
 *       '201':
 *         description: Quiz saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Quiz saved successfully!
 *                 Code:
 *                   type: string
 *                   example: quiz123
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Code already exists
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.post('/api/v1/quizzes', saveQuiz);

/**
 * @swagger
 * /api/v1/quizzes/score:
 *   post:
 *     tags: [Quizzes]
 *     summary: Submit answers and get quiz score.
 *     description: Submit answers for a quiz and get the score.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: Quiz code
 *               name:
 *                 type: string
 *                 description: Username of the quiz taker
 *               answers:
 *                 type: object
 *                 description: Answers provided by the user
 *             required:
 *               - code
 *               - name
 *               - answers
 *     responses:
 *       '200':
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 score:
 *                   type: integer
 *                   example: 5
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Code not sent
 *       '404':
 *         description: Quiz not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Quiz not found
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
router.post('/api/v1/quizzes/score', getScore);

/**
 * @swagger
 * /api/v1/quizzes/delete:
 *   post:
 *     tags: [Quizzes]
 *     summary: Delete a quiz by code.
 *     description: Delete a quiz by its code.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: Quiz code
 *               username:
 *                 type: string
 *                 description: Username of the quiz creator
 *             required:
 *               - code
 *               - username
 *     responses:
 *       '200':
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                     example: quiz123
 *                   status:
 *                     type: boolean
 *                     example: true
 *                   lastupdate:
 *                     type: string
 *                     format: date-time
 *                     example: 2024-07-16T12:34:56.789Z
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Quiz code cannot be empty
 *       '404':
 *         description: User or quiz not found
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
 *                   example: Quiz not found
 */
router.post('/api/v1/quizzes/delete', deleteQuiz);

module.exports = router;