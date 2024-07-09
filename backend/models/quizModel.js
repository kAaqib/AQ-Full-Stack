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
    score: Number
});

const QuizSchema = new mongoose.Schema({
    code: { type: String, unique: true },
    questions: [QuestionSchema],
    scores: [ScoreSchema]
});

module.exports = mongoose.model('Quiz', QuizSchema);