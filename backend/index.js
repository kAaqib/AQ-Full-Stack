/**
 * @fileoverview Main server file for the Apna Quiz application.
 * Sets up Express server with various middlewares, routes, and Swagger documentation.
 */

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const quizRoutes = require('./routes/quizRoutes');
const userRoutes = require('./routes/userRoutes');
const draftRoutes = require('./routes/draftRoutes');
const pino = require('pino');
const swaggerjsdoc = require('swagger-jsdoc');
const swaggerui = require('swagger-ui-express');

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Apna Quiz API',
            description: 'Quiz API Information',
        },
        servers: [
            {
                url: "http://127.0.0.1:3000"
            }
        ],
        tags: [
            {
                name: 'Users',
                description: 'User-related operations',
            },
            {
                name: 'Quizzes',
                description: 'Quiz-related operations',
            }
        ],
    },
    apis: ['./routes/*.js']
};
const swaggerDocs = swaggerjsdoc(swaggerOptions);
app.use('/api-docs', swaggerui.serve, swaggerui.setup(swaggerDocs));

const Quiz = require('./models/quizModel');
const Login = require('./models/loginModel');
const { isAsyncFunction } = require('util/types');

const logger = pino({
    transport: {
        target: 'pino/file',
        options: { destination: `${__dirname}/app.log` },
    },
});

/**
 * Connects to the MongoDB database.
 */
mongoose.connect("mongodb+srv://fccdb:fccdb@cluster0.teunbos.mongodb.net/ApnaQuiz?retryWrites=true&w=majority&appName=Cluster0");

/**
 * Middleware setup.
 */
app.use(helmet());
app.use(express.static(path.join(__dirname, '../frontend/public')));
app.use(express.static(path.join(__dirname, '../documentation')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
    origin: '*'
}));
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"]
        },
    })
);

app.use(require('pino-http')({ logger }));

/**
 * Routes setup.
 */

/**
 * @description Serves the index page.
 * @route GET /
 */
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../frontend/views/index.html"));
});

/**
 * @description Serves the registration page.
 * @route GET /register
 */
app.get("/register", function(req, res) {
    res.sendFile(path.join(__dirname, "../frontend/views/register.html"));
});

/**
 * @description Serves the home page.
 * @route GET /home.html
 */
app.get("/home.html", function(req, res) {
    res.sendFile(path.join(__dirname, "../frontend/views/home.html"));
});

/**
 * @description Serves the selection option page.
 * @route GET /selOpt
 */
app.get("/selOpt", function(req, res) {
    res.sendFile(path.join(__dirname, "../frontend/views/selopt.html"));
});

/**
 * @description Serves the selection option page.
 * @route GET /selopt.html
 */
app.get("/selopt.html", function(req, res) {
    res.sendFile(path.join(__dirname, "../frontend/views/selopt.html"));
});

/**
 * @description Serves the topic page.
 * @route GET /getTopicPage
 */
app.get("/getTopicPage", function(req, res) {
    res.sendFile(path.join(__dirname, "../frontend/views/topic.html"));
});

/**
 * @description Serves the quiz page.
 * @route GET /quiz.html
 */
app.get("/quiz.html", function(req, res) {
    res.sendFile(path.join(__dirname, "../frontend/views/quiz.html"));
});

/**
 * @description Serves the make quiz page.
 * @route GET /makeQuiz
 */
app.get("/makeQuiz", function(req, res) {
    res.sendFile(path.join(__dirname, '../frontend/views/makeQuiz.html'));
});

/**
 * @description Serves the leaderboard page.
 * @route GET /leaderboard.html
 */
app.get("/leaderboard.html", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/views/leaderboard.html"));
});

/**
 * @description Serves the user's quizzes page.
 * @route GET /myquizzes.html
 */
app.get("/myquizzes.html", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/views/myquizzes.html"));
});

/**
 * @description Serves the user's answers page.
 * @route GET /myanswers.html
 */
app.get("/myanswers.html", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/views/myanswers.html"));
});

/**
 * @description Serves the quiz responses page.
 * @route GET /responses
 */
app.get("/responses", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/views/quizresponses.html"));
});

/**
 * @description Serves the review page.
 * @route GET /review.html
 */
app.get("/review.html", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/views/review.html"));
});

/**
 * @description Serves the view quiz page.
 * @route GET /viewquiz.html
 */
app.get("/viewquiz.html", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/views/viewquiz.html"));
});

/**
 * @description Serves the delete quiz page.
 * @route GET /deletequiz
 */
app.get("/deletequiz", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/views/myquizzes.html"));
});

/**
 * @description Deletes all Login and Quiz records.
 * @route GET /delete
 */
app.get("/delete", async function(req, res) {
    await Login.deleteMany({});
    await Quiz.deleteMany({});
    res.json({ status: "deleted" });
});

app.get("/documentation", async function(req, res) {
    res.sendFile(path.join(__dirname, "../documentation/intro.html"));
})
/**
 * Use the imported route modules.
 */
app.use(quizRoutes);
app.use(userRoutes);
app.use(draftRoutes);

/**
 * Starts the server on port 3000.
 */
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});