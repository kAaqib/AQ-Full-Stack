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
            status: false,
            lastupdate: date
        };

        if (user) {
            user.myquizzes = user.myquizzes.filter(arr => arr.code !== code);
            user.myquizzes.push(quizCodenDate);
            await user.save();
        } else {
            return res.status(404).json({ error: 'User not found' });
        }

        const quiz = await Quiz.findOne({ code: code });

        if (quiz) {
            quiz.questions = Object.values(transformedData.questions);
            quiz.status = false;
            quiz.lastupdate = date;
            await quiz.save();
            res.status(201).json({ message: 'Draft saved successfully!', Code: code });
        } else {
            const newQuiz = new Quiz({
                username: uname,
                code: code,
                questions: Object.values(transformedData.questions),
                status: false,
                lastupdate: date
            });
            await newQuiz.save();
            res.status(201).json({ message: 'Draft saved successfully!', Code: code });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};