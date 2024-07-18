const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    question: String,
    a: String,
    b: String,
    c: String,
    d: String,
    ans: String
});

const ScoreSchema = new mongoose.Schema({
    username: String,
    score: Number,
    lastanswered: Date
});

const QuizSchema = new mongoose.Schema({
    code: { type: String, unique: true },
    questions: [QuestionSchema],
    scores: [ScoreSchema],
    status: Boolean,
    lastupdate: Date
});

module.exports = mongoose.model('Quiz', QuizSchema);