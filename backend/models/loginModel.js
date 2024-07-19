const mongoose = require('mongoose');

/**
 * @typedef {Object} QuizInfo
 * @property {string} code - The unique code of the quiz.
 * @property {boolean} status - The status of the quiz.
 * @property {Date} lastupdate - The date when the quiz was last updated.
 */

/**
 * Schema representing the structure of quiz information.
 * @type {mongoose.Schema<QuizInfo>}
 */
const quizzes = mongoose.Schema({
    code: String,
    status: Boolean,
    lastupdate: Date
});

/**
 * @typedef {Object} Login
 * @property {string} username - The username of the user.
 * @property {string} password - The password of the user.
 * @property {QuizInfo[]} myquizzes - Array of quizzes associated with the user.
 */

/**
 * Schema representing the structure of the login information.
 * @type {mongoose.Schema<Login>}
 */
const loginSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
    myquizzes: [quizzes]
});

/**
 * Mongoose model for the Login schema.
 * @type {mongoose.Model<Login>}
 */
module.exports = mongoose.model('Login', loginSchema);