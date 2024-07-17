const Draft = require("../models/draftModel");
const Quiz = require("../models/quizModel");
const Login = require("../models/loginModel");
const transformFormData = require('../utils/transformFormData');

exports.getSaveDraft = async (req, res) => {
    let date = new Date();
    const transformedData = transformFormData(req.body);
    const code = transformedData.quizCode;
    const uname = transformedData.username;

    try {
        const user = await Login.findOne({ username: uname });
        let quizCodenDate = {
            code: code,
            lastupdate: date
        };

        if (user) {
            user.myquizzes = user.myquizzes.filter(arr => arr.code !== code);
            user.mydrafts = user.mydrafts.filter(arr => arr.code !== code);
            user.mydrafts.push(quizCodenDate);
            await user.save();
        } else {
            return res.status(404).json({ error: 'User not found' });
        }

        const dquiz = await Draft.findOne({ code: code });

        if (dquiz) {
            dquiz.questions = Object.values(transformedData.questions);
            dquiz.lastupdate = date;
            await dquiz.save();
            res.status(201).json({ message: 'Draft saved successfully!', Code: code });
        } else {
            const newdquiz = new Draft({
                username: uname,
                code: code,
                questions: Object.values(transformedData.questions),
                lastupdate: date
            });
            await newdquiz.save();
            await Quiz.deleteOne({ code: code });
            res.status(201).json({ message: 'Draft saved successfully!', Code: code });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getViewDQuiz = async (req, res) => {
    let code = req.params.code;
    if (code !== undefined) {
        if (code.includes('"')) {
            code = code.slice(1, code.length - 1);
        }
        try {
            const quiz = await Draft.findOne({ code: code });
            if (quiz) {
                res.status(200).json(quiz.questions);
            } else {
                res.status(404).json({ error: 'No drafts with this code' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    } else {
        res.status(400).json({error: "Code not sent"});
    }
};

exports.getEditDQuiz = async (req, res) => {
    let code = req.params.code;
    if (code !== undefined) {
        try {
            const quiz = await Draft.findOne({ code: code });
            if (quiz) {
                res.status(200).json({ code: code, questions: quiz.questions });
            } else {
                res.status(404).json({ error: 'No drafts with this code' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    } else {
        res.status(400).json({error: "Code not sent"});
    }
};

exports.deleteDQuiz = async (req, res) => {
    const quizCode = req.params.code;
    const uname = req.params.username;
    try {
        await Draft.deleteOne({ code: quizCode });
        const user = await Login.findOne({ username: uname });
        if (user) {
            user.mydrafts = user.mydrafts.filter(arr => arr.code !== quizCode);
            await user.save();
            res.status(200).json(user.mydrafts);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};