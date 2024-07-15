const Draft = require("../models/draftModel");
const Quiz = require("../models/quizModel");
const Login = require("../models/loginModel");
const transformFormData = require('../utils/transformFormData');

exports.getSaveDraft = async (req, res) => {
    let date = Date();
    const transformedData = transformFormData(req.body);
    const code = transformedData.quizCode;
    const uname = transformedData.username;
    const user = await Login.findOne({username: uname});
    let quizCodenDate = {
        code: code,
        lastupdate: date
    }
    if (user) {
        user.myquizzes = user.myquizzes.filter(arr => arr.code !== transformedData.quizCode);
        user.mydrafts.push(quizCodenDate);
        user.save();
    }
    const dquiz = await Draft.findOne({code: code});
    if (dquiz) {
        dquiz.questions = Object.values(transformedData.questions);
        dquiz.lastupdate = date;
        dquiz.save()
        .then(() => res.status(201).json({ message: 'Quiz saved successfully!', Code: quizCode }))
    } else {
        const newdquiz = new Draft({
            username: transformedData.username,
            code: code,
            questions: Object.values(transformedData.questions),
            lastupdate: date
        });
        newdquiz.save()
        .then(async () => {
            await Quiz.deleteOne({code: code});
        })
        .then(() => res.status(201).json({ message: 'Quiz saved successfully!', Code: code }))
    }
}

exports.getMyDrafts = async (req, res) => {
    const username = req.body.username;
    try {
        const user = await Login.findOne({ username: username });
        if (user) {
            res.json(user.mydrafts);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.getViewDQuiz = async (req, res) => {
    let code = req.body.code;
    if (code.includes('"')) {
        code = code.slice(1, code.length-1);
    }
    try {
        const quiz = await Draft.findOne({ code: code });
        res.json(quiz.questions);
    } catch (error) {
        res.status(500).json({error: 'Server error'});
    }
}

exports.getEditDQuiz = async (req, res) => {
    let code = req.body.code;
    try {
        const quiz = await Draft.findOne({ code: code });
        res.json({ code: code, questions: quiz.questions });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

exports.deleteDQuiz = async (req, res) => {
    const quizCode = req.query.quizCode;
    const uname = req.query.uname;
    try {
        await Draft.deleteOne({ code: quizCode });
        const user = await Login.findOne({ username: uname});
        user.mydrafts = user.mydrafts.filter(arr => arr.code !== quizCode);
        user.save();
        res.json(user.mydrafts);
    } catch (error) {
        res.status(500).json({error: 'Server error'});
    }
}