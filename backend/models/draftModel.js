const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    question: String,
    a: String,
    b: String,
    c: String,
    d: String,
    ans: String
});

const QuizSchema = new mongoose.Schema({
    username: String,
    code: { type: String, unique: true },
    questions: [QuestionSchema],
    lastupdate: Date
});

module.exports = mongoose.model('Draft', QuizSchema);