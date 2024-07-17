const Quiz = require('../models/quizModel');
const Draft = require('../models/draftModel');
const Login = require('../models/loginModel');
const Answered = require('../models/answerModel');
const transformFormData = require('../utils/transformFormData');

exports.getQuiz = async (req, res) => {
    const code = req.params.code;
    if (code !== undefined) {
        try {
            const quiz = await Quiz.findOne({ code: code }).select('-questions.ans');
            if (quiz) {
                res.status(200).json({ code: code, questions: quiz.questions });
            } else {
                res.status(404).json({ msg: "Quiz does not exist" });
            }
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    } else {
        res.status(400).json({error: "Code not sent"});
    }
};

exports.checkCode = async (req, res) => {
    const code = req.body.code;
    if (/[a-zA-Z]/.test(code)) {
        try {
            let quiz = await Quiz.findOne({ code: code });
            let draft = await Draft.findOne({ code: code });
            if (quiz) {
                res.status(400).json({ message: "Quiz code exists" });
            } else if (draft) {
                res.status(200).json({ message: "Draft code exists" });
            } else {
                res.status(200).json({ message: "lesgooo" });
            }
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    } else {
        res.status(400).json({ message: "Code should contain alphabets" });
    }
};

exports.saveQuiz = async (req, res) => {
    let date = new Date();
    const transformedData = transformFormData(req.body);
    const username = transformedData.username;
    const quizCode = transformedData.quizCode;
    const questions = transformedData.questions;
    const editflag = transformedData.editflag;
    await Draft.deleteOne({ code: quizCode });
    const quiz = await Quiz.findOne({ code: quizCode });
    let quizCodenDate = {
        code: quizCode,
        lastupdate: date
    };
    if (editflag === "false" && !quiz) {
        const user = await Login.findOne({ username: username });
        user.mydrafts = user.mydrafts.filter(arr => arr.code !== quizCode);
        user.myquizzes.push(quizCodenDate);
        await user.save();

        const newQuiz = new Quiz({
            code: quizCode,
            questions: Object.values(questions)
        });

        newQuiz.save()
            .then(() => res.status(201).json({ message: 'Quiz saved successfully!', Code: quizCode }))
            .catch(error => res.status(500).json({ message: 'Internal server error' }));
    } else if (editflag === "true") {
        const user = await Login.findOne({ username: username });
        user.mydrafts = user.mydrafts.filter(arr => arr.code !== quizCode);
        user.myquizzes = user.myquizzes.filter(quiz => quiz.code !== quizCode);
        user.myquizzes.push(quizCodenDate);
        await user.save();

        const quiz = await Quiz.findOne({ code: quizCode });
        if (quiz) {
            quiz.questions = Object.values(questions);
            quiz.lastupdate = date;
            quiz.save()
                .then(() => res.status(201).json({ message: 'Quiz saved successfully!', Code: quizCode }))
                .catch(error => res.status(500).json({ message: 'Internal server error' }));
        } else {
            const newQuiz = new Quiz({
                code: quizCode,
                questions: Object.values(questions)
            });

            newQuiz.save()
                .then(() => res.status(201).json({ message: 'Quiz saved successfully!', Code: quizCode }))
                .catch(error => res.status(500).json({ message: 'Internal server error' }));
        }

    } else {
        res.status(400).json({ message: "Code already exists" });
    }
};

exports.getScore = async (req, res) => {
    let date = new Date();
    const answers = req.body;
    let qc = answers["code"];
    if (qc.includes('"')) {
        qc = qc.substring(1, answers["code"].length - 1);
    }
    const name = answers["name"];
    let score = 0;

    try {
        const qid = await Quiz.findOne({ code: qc });
        if (!qid) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        let qna = [];

        qid.questions.forEach(q => {
            let qqna = {};
            qqna.question = q.question;
            qqna.a = q.a;
            qqna.b = q.b;
            qqna.c = q.c;
            qqna.d = q.d;
            qqna.ans = q.ans;
            qqna.userans = answers[q._id];
            qna.push(qqna);
            let userAns = answers[q._id];
            if (userAns && userAns === q.ans) {
                score++;
            }
        });

        let answereds = {
            code: qc,
            qna: qna,
            score: score,
            date: date
        };

        const data = { username: name, score: score, lastanswered: date };
        qid.scores.push(data);
        await qid.save();

        const user = await Answered.findOne({ username: name });
        if (!user) {
            const ansdata = new Answered({
                username: name,
                answered: answereds
            });
            await ansdata.save();
        } else {
            user.answered = user.answered.filter(arr => arr.code !== qc);
            user.answered.push(answereds);
            await user.save();
        }
        res.status(200).json({ score: score });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getTopScores = async (req, res) => {
    let code = req.params.code;
    if (code !== undefined) {
        if (code.includes('"')) {
            code = code.substring(1, code.length - 1);
        }
        try {
            const quiz = await Quiz.findOne({ code: code });
            if (!quiz) {
                return res.status(404).json({ error: 'Quiz not found' });
            }
            let topScores = quiz.scores.sort((a, b) => b.score - a.score).slice(0, 10);
            res.status(200).json({ "Top10": topScores });
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    } else {
        res.status(400).json({error: "Code not sent"});
    }
};

exports.getResponses = async (req, res) => {
    const quizCode = req.params.code;
    try {
        const quiz = await Quiz.findOne({ code: quizCode });
        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }
        res.status(200).json({ "code": quizCode, "Scores": quiz.scores });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.deleteQuiz = async (req, res) => {
    const quizCode = req.params.code;
    const uname = req.params.username;
    if (uname !== "" && quizCode !== "") {
        try {
            await Quiz.deleteOne({ code: quizCode });
            const user = await Login.findOne({ username: uname });
            if (user) {
                user.myquizzes = user.myquizzes.filter(obj => obj.code !== quizCode);
                await user.save();
                res.status(200).json(user.myquizzes);
            } else {
                res.status(404).json({ error: "User not found" });
            }
        } catch (error) {
            res.status(500).json({ error: 'Quiz not found' });
        }
    } else {
        res.status(400).json({ error: "Quiz code cannot be empty" });
    }
};

exports.getReview = async (req, res) => {
    let username = req.params.username;
    let code = req.params.code;
    if (code !== undefined) {
        if (code.includes('"')) {
            code = code.slice(1, code.length - 1);
        }
        try {
            const user = await Answered.findOne({ username: username });
            if (user) {
                try {
                    let ans = user.answered.filter(arr => arr.code === code);
                    res.status(200).json(ans[0].qna);
                } catch (error) {
                    res.status(400).json({error : "You have not attempted this quiz"});
                }
            } else {
                res.status(404).json({ error: 'You have not answered any quizzes' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    } else {
        res.status(400).json({error: "Code not sent"});
    }
};

exports.getViewQuiz = async (req, res) => {
    let code = req.params.code;
    if (code !== undefined) {
        if (code.includes('"')) {
            code = code.slice(1, code.length - 1);
        }
        try {
            const quiz = await Quiz.findOne({ code: code });
            if (quiz) {
                res.status(200).json(quiz.questions);
            } else {
                res.status(404).json({ error: 'Quiz not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    } else {
        res.status(400).json({error: "Code not sent"});
    }
};

exports.getEditQuiz = async (req, res) => {
    let code = req.params.code;
    if (code !== undefined) {
        try {
            const quiz = await Quiz.findOne({ code: code });
            if (quiz) {
                res.status(200).json({ code: code, questions: quiz.questions });
            } else {
                res.status(404).json({ error: 'Quiz not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    } else {
        res.status(400).json({error: "Code not sent"});
    }
};