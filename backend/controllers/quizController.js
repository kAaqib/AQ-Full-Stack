const Quiz = require('../models/quizModel');
const Login = require('../models/loginModel');
const transformFormData = require('../utils/transformFormData');

exports.getQuiz = async (req, res) => {
    const code = req.body.code;
    try {
        const quiz = await Quiz.findOne({ code: code }).select('-questions.ans');
        res.json({ code: code, questions: quiz.questions });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.saveQuiz = async (req, res) => {
    const transformedData = transformFormData(req.body);
    const username = transformedData.username;
    const quizCode = transformedData.quizCode;
    const questions = transformedData.questions;

    const user = await Login.findOne({username: username});
    user.myquizzes.push(quizCode);
    await user.save();

    const newQuiz = new Quiz({
        code: quizCode,
        questions: Object.values(questions)
    });

    console.log(newQuiz);

    newQuiz.save()
        .then(() => res.status(201).json({ message: 'Quiz saved successfully!', Code: quizCode }))
        .catch(error => res.status(500).json({ message: 'Internal server error' }));
};

exports.getScore = async (req, res) => {
    let answers = req.body;
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

        qid.questions.forEach(q => {
            let userAns = answers[q._id];
            if (userAns && userAns === q.ans) {
                score++;
            }
        });

        const data = { username: name, score: score };
        qid.scores.push(data);
        await qid.save();

        res.json({ score: score });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getTopScores = async (req, res) => {
    let code = req.body.code;
    if (code.includes('"')) {
        code = code.substring(1, code.length - 1);
    }
    try {
        const quiz = await Quiz.findOne({ code: code });
        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }
        let topScores = quiz.scores.sort((a, b) => b.score - a.score).slice(0, 10);
        res.json({ "Top10": topScores });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getMyQuizzes = async (req, res) => {
    const username = req.body.username;
    try {
        const user = await Login.findOne({ username: username });
        if (user) {
            res.json(user.myquizzes);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.getResponses = async (req, res) => {
    const quizCode = req.query.quizCode;
    try {
        const quiz = await Quiz.findOne({ code: quizCode });
        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }
        res.json({ "Scores": quiz.scores });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}