const express = require('express');
const path = require('path');
const { registerUser, validateUser, getMyQuizzes, getMyAnswers } = require('../controllers/userController');
const router = express.Router();

/**
 * @swagger
 * /register:
 *   post:
 *     tags: [Users]
 *     summary: Register a new user.
 *     description: Register a new user with a username and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username for the new user
 *               password:
 *                 type: string
 *                 description: Password for the new user
 *             required:
 *               - username
 *               - password
 *     responses:
 *       '201':
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Success
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Username exists
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
router.post('/register', registerUser);

/**
 * @swagger
 * /login:
 *   post:
 *     tags: [Users]
 *     summary: Validate user credentials.
 *     description: Authenticate a user with username and password.
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
 *               password:
 *                 type: string
 *                 description: Password of the user
 *             required:
 *               - username
 *               - password
 *     responses:
 *       '200':
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Success
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid input
 *       '401':
 *         description: Unauthorized, invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 *                   example: Invalid Credentials
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 *                   example: User does not exist
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
router.post('/login', validateUser);

/**
 * @swagger
 * /api/v1/users/quizzes:
 *   post:
 *     tags: [Users]
 *     summary: Get quizzes created by a user.
 *     description: Retrieve a list of quizzes created by the specified user.
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
 *             required:
 *               - username
 *     responses:
 *       '200':
 *         description: A successful response with a list of quizzes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                     description: Quiz code
 *                   status:
 *                     type: boolean
 *                     description: Quiz status (true for active, false for inactive)
 *                   lastupdate:
 *                     type: string
 *                     format: date-time
 *                     description: Last update time of the quiz
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
 *                   example: Internal server error
 */
router.post('/api/v1/users/quizzes', getMyQuizzes);

/**
 * @swagger
 * /api/v1/users/answers:
 *   post:
 *     tags: [Users]
 *     summary: Get answers submitted by a user.
 *     description: Retrieve a list of quizzes answered by the specified user along with their responses.
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
 *             required:
 *               - username
 *     responses:
 *       '200':
 *         description: A successful response with a list of answered quizzes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                     description: Quiz code
 *                   qna:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         question:
 *                           type: string
 *                           description: The quiz question
 *                         a:
 *                           type: string
 *                           description: Option A
 *                         b:
 *                           type: string
 *                           description: Option B
 *                         c:
 *                           type: string
 *                           description: Option C
 *                         d:
 *                           type: string
 *                           description: Option D
 *                         ans:
 *                           type: string
 *                           description: The correct answer
 *                         userans:
 *                           type: string
 *                           description: The user's answer
 *                   score:
 *                     type: integer
 *                     description: The user's score for the quiz
 *                   date:
 *                     type: string
 *                     format: date-time
 *                     description: The date when the quiz was answered
 *       '404':
 *         description: No quizzes attempted by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: You have not attempted any quizzes
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.post('/api/v1/users/answers', getMyAnswers);

module.exports = router;