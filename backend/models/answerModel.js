const mongoose = require("mongoose");

/**
 * @typedef {Object} Question
 * @property {string} question - The text of the question.
 * @property {string} a - The text for option A.
 * @property {string} b - The text for option B.
 * @property {string} c - The text for option C.
 * @property {string} d - The text for option D.
 * @property {string} ans - The correct answer for the question.
 * @property {string} userans - The user's answer to the question.
 */

/**
 * Schema representing a single question and the user's answer to it.
 * @type {mongoose.Schema<Question>}
 */
const qna = mongoose.Schema({
    question: String,
    a: String,
    b: String,
    c: String,
    d: String,
    ans: String,
    userans: String
});

/**
 * @typedef {Object} AnsweredQuiz
 * @property {string} code - The unique code for the quiz.
 * @property {Question[]} qna - The list of questions and answers.
 * @property {number} score - The score achieved by the user.
 * @property {Date} date - The date when the quiz was answered.
 */

/**
 * Schema representing an answered quiz.
 * @type {mongoose.Schema<AnsweredQuiz>}
 */
const answered = mongoose.Schema({
    code: String,
    qna: [qna],
    score: Number,
    date: Date,
});

/**
 * @typedef {Object} UserAnswers
 * @property {string} username - The username of the user.
 * @property {AnsweredQuiz[]} answered - The list of quizzes answered by the user.
 */

/**
 * Schema representing a user's answered quizzes.
 * @type {mongoose.Schema<UserAnswers>}
 */
const ansSchema = mongoose.Schema({
    username: String,
    answered: [answered]
});

/**
 * Mongoose model for the UserAnswers schema.
 * @type {mongoose.Model<UserAnswers>}
 */
module.exports = mongoose.model('answered', ansSchema);