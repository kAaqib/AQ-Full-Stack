const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");

const arr = mongoose.Schema ({
    question: String,
    a: String,
    b: String,
    c: String,
    d: String,
    ans: String,
    userans: String
})

const answered = mongoose.Schema ({
    code: String,
    qna: [arr],
    score: Number,
    date: Date,
})

const ansSchema = mongoose.Schema ({
    username: String,
    answered: [answered]
})

module.exports = mongoose.model('answered', ansSchema);