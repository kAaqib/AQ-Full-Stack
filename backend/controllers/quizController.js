const Quiz = require('../models/quizModel');
const Draft = require('../models/draftModel');
const Login = require('../models/loginModel');
const Answered = require('../models/answerModel');
const transformFormData = require('../utils/transformFormData');

exports.getQuiz = async (req, res) => {
    const code = req.body.code;
    try {
        const quiz = await Quiz.findOne({ code: code }).select('-questions.ans');
        if (quiz) {
            res.json({ code: code, questions: quiz.questions });
        } else {
            res.json({ msg: "Quiz does not exist"});
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.checkCode = async (req, res) => {
    const code = req.body.code;
    if (/[a-zA-Z]/.test(code)) {
        let quiz = await Quiz.findOne({code: code});
        if (quiz) {
            res.json({message: "Code exists"});
        } else {
            res.json({message: "lesgooo"});
        }
    } else {
        res.json({message: "Code should contain alphabets"});
    }
}

exports.saveQuiz = async (req, res) => {
    let date = Date();
    const transformedData = transformFormData(req.body);
    const username = transformedData.username;
    const quizCode = transformedData.quizCode;
    const questions = transformedData.questions;
    const editflag = transformedData.editflag;
    await Draft.deleteOne({code: quizCode});
    const quiz = await Quiz.findOne({code: quizCode});
    let quizCodenDate = {
        code: quizCode,
        lastupdate: date
    }
    if (editflag == "false" && !quiz) {
        const user = await Login.findOne({username: username});
        user.mydrafts = user.mydrafts.filter(arr => arr.code!==quizCode);
        user.myquizzes.push(quizCodenDate);
        await user.save();
        
        const newQuiz = new Quiz({
            code: quizCode,
            questions: Object.values(questions)
        });
        
        newQuiz.save()
        .then(() => res.status(201).json({ message: 'Quiz saved successfully!', Code: quizCode }))
        .catch(error => res.status(500).json({ message: 'Internal server error' }));
    } else if (editflag == "true") {
        let user = await Login.findOne({username: username});
        user.mydrafts = user.mydrafts.filter(arr => arr.code!==quizCode);
        user.myquizzes = user.myquizzes.filter(quiz => quiz.code !== quizCode);
        user.myquizzes.push(quizCodenDate);
        await user.save();
        
        let quiz = await Quiz.findOne({code: quizCode});
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
        res.json({message: "Code already exists"});
    }
};

exports.getScore = async (req, res) => {
    let date = Date();
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
            date: Date()
        }

        const data = { username: name, score: score, lastanswered: date};
        qid.scores.push(data);
        await qid.save();

        const user = await Answered.findOne({username: name});
        if (!user) {
            const ansdata = new Answered({ 
                username: name,
                answered: answereds
            });
            ansdata.save();
        } else {
            user.answered = user.answered.filter(arr => arr.code !== qc)
            user.answered.push(answereds);
            user.save();
        }
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

exports.getMyAnswers = async (req, res) => {
    const username = req.body.username;
    try {
        const user = await Answered.findOne({ username: username });
        if (user) {
            res.json(user.answered);
        } else {
            res.json({ message: "You have not attempted any quizzes"});
        }
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.getResponses = async (req, res) => {
    const quizCode = req.query.quizCode;
    const uname = req.query.uname;
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

exports.deleteQuiz = async (req, res) => {
    const quizCode = req.query.quizCode;
    const uname = req.query.uname;
    if (uname !== "" && quizCode !== "") {
        try {
            await Quiz.deleteOne({ code: quizCode });
            const user = await Login.findOne({ username: uname});
            if (user) {
                user.myquizzes = user.myquizzes.filter(obj => obj.code !== quizCode);
                await user.save();
                res.json(user.myquizzes);
            } else {
                res.json({error: "User does not exist"});
            }
        } catch (error) {
            res.status(500).json({error: 'Quiz does not exist'});
        }
    } else {
        res.json({error: "Quiz code cannot be empty"});
    }
}

exports.getReview = async (req, res) => {
    const username = req.body.name;
    let code = req.body.code;
    if (code.includes('"')) {
        code = code.slice(1, code.length-1);
    }
    try {
        const user = await Answered.findOne({ username: username});
        let ans = user.answered.filter(arr => arr.code === code);
        res.json(ans[0].qna);
    } catch (error) {
        res.status(500).json({error: 'Not attempted this quiz'});
    }
}

exports.getViewQuiz = async (req, res) => {
    let code = req.body.code;
    if (code.includes('"')) {
        code = code.slice(1, code.length-1);
    }
    try {
        const quiz = await Quiz.findOne({ code: code });
        res.json(quiz.questions);
    } catch (error) {
        res.status(500).json({error: 'Quiz does not exist'});
    }
}

exports.getEditQuiz = async (req, res) => {
    let code = req.body.code;
    try {
        const quiz = await Quiz.findOne({ code: code });
        res.json({ code: code, questions: quiz.questions });
    } catch (error) {
        res.status(500).json({ error: 'Quiz does not exist' });
    }
}