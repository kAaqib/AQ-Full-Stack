console.log("This is the backend");
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const quizRoutes = require('./routes/quizRoutes');
const userRoutes = require('./routes/userRoutes');

mongoose.connect("mongodb+srv://fccdb:fccdb@cluster0.teunbos.mongodb.net/ApnaQuiz?retryWrites=true&w=majority&appName=Cluster0");

app.use(helmet());
app.use(express.static(path.join(__dirname, '../frontend/public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
    origin: '*'
}));
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            scriptSrc: ["'self'"],
        },
    })
);

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../frontend/views/index.html"));
});

app.get("/register", function(req, res) {
    res.sendFile(path.join(__dirname, "../frontend/views/register.html"));
});

app.get("/home.html", function(req, res) {
    res.sendFile(path.join(__dirname, "../frontend/views/home.html"));
});

app.get("/selOpt", function(req, res) {
    res.sendFile(path.join(__dirname, "../frontend/views/selopt.html"));
});

app.get("/selopt.html", function(req, res) {
    res.sendFile(path.join(__dirname, "../frontend/views/selopt.html"));
});

app.get("/getTopicPage", function(req, res) {
    res.sendFile(path.join(__dirname, "../frontend/views/topic.html"));
});

app.get("/getQuiz", function(req, res) {
    res.sendFile(path.join(__dirname, "../frontend/views/quiz.html"));
});

app.get("/makeQuiz", function(req, res) {
    res.sendFile(path.join(__dirname, '../frontend/views/makeQuiz.html'));
});

app.get("/leaderboard.html", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/views/leaderboard.html"));
});

app.get("/myquizzes.html", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/views/myquizzes.html"));
});

app.get("/responses", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/views/quizresponses.html"));
})

app.get("/delete", async function(req, res) {
    await Login.deleteMany({});
    res.json({ status: "deleted" });
});

app.use(quizRoutes);
app.use(userRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});