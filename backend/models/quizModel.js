const mongoose = require('mongoose');

/**
 * @typedef {Object} Question
 * @property {string} question - The text of the question.
 * @property {string} a - The text for option A.
 * @property {string} b - The text for option B.
 * @property {string} c - The text for option C.
 * @property {string} d - The text for option D.
 * @property {string} ans - The correct answer for the question.
 */

/**
 * Schema representing a single quiz question.
 * @type {mongoose.Schema<Question>}
 */
const QuestionSchema = new mongoose.Schema({
    question: String,
    a: String,
    b: String,
    c: String,
    d: String,
    ans: String
});

/**
 * @typedef {Object} Score
 * @property {string} username - The username of the user who took the quiz.
 * @property {number} score - The score achieved by the user.
 * @property {Date} lastanswered - The date when the user last answered the quiz.
 */

/**
 * Schema representing a user's score on a quiz.
 * @type {mongoose.Schema<Score>}
 */
const ScoreSchema = new mongoose.Schema({
    username: String,
    score: Number,
    lastanswered: Date
});

/**
 * @typedef {Object} Quiz
 * @property {string} code - The unique code for the quiz.
 * @property {Question[]} questions - The list of questions in the quiz.
 * @property {Score[]} scores - The list of scores for the quiz.
 * @property {boolean} status - The status of the quiz.
 * @property {Date} lastupdate - The date when the quiz was last updated.
 */

/**
 * Schema representing a quiz.
 * @type {mongoose.Schema<Quiz>}
 */
const QuizSchema = new mongoose.Schema({
    code: { type: String, unique: true },
    questions: [QuestionSchema],
    scores: [ScoreSchema],
    status: Boolean,
    lastupdate: Date
});

/**
 * Mongoose model for the Quiz schema.
 * @type {mongoose.Model<Quiz>}
 */
module.exports = mongoose.model('Quiz', QuizSchema);