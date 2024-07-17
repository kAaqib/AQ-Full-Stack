const Login = require('../models/loginModel');
const Answered = require('../models/answerModel');
const Draft = require("../models/draftModel");
const bcrypt = require('bcryptjs');
const path = require('path');

exports.registerUser = async (req, res) => {
    const { username, password } = req.body;
    if (username && password !== undefined && username && password !== "" && /[a-zA-Z]/.test(username) && /[a-zA-Z]/.test(password)) {
        const unExists = await Login.findOne({ username: username });
        try {
            if (unExists) {
                return res.status(400).json({ msg: "Username exists" });
            } else {
                bcrypt.genSalt(10, function (err, Salt) {
                    bcrypt.hash(password, Salt, async function (err, hash) {
                        if (err) {
                            return res.status(400).json('Invalid password');
                        }
                        const user = new Login({ username: username, password: hash });
                        await user.save();
                        res.status(201).json({ msg: "Success" });
                    });
                });
            }
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    } else {
        if (username === undefined && password === undefined)
            res.status (400).json({ error: "No username and password were sent"});
        else if (username === undefined)
            res.status (400).json({ error: "No username was sent"});
        else if (password === undefined)
            res.status (400).json({ error: "No password was sent"});
        else if (username === "" && password === "")
            res.status (400).json({ error: "Empty username and password"});
        else if (username === "")
            res.status(400).json({ error: "Empty username" });
        else if (password === "")
            res.status(400).json({ error: "Empty password" });
        else if (!/[a-zA-Z]/.test(username))
            res.status(400).json({ error: "Invalid username, should contain alphabets" });
        else if (!/[a-zA-Z]/.test(password))
            res.status(400).json({ error: "Invalid password, should contain alphabets" });
        else {
            res.status(400).json({ error: "Invalid inut" });
        }
    }
};

exports.validateUser = async (req, res) => {
    const { username, password } = req.body;
    if (username && password !== undefined && username && password !== "" && /[a-zA-Z]/.test(username) && /[a-zA-Z]/.test(password)) {
        try {
            const user = await Login.findOne({ username: username });
            if (!user) {
                return res.status(404).json({ err: "User does not exist" });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                res.status(200).json({ msg: "Success" });
            } else {
                res.status(401).json({ err: "Invalid Credentials" });
            }
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    } else {
        if (username === undefined && password === undefined)
            res.status (400).json({ error: "No username and password were sent"});
        else if (username === undefined)
            res.status (400).json({ error: "No username was sent"});
        else if (password === undefined)
            res.status (400).json({ error: "No password was sent"});
        else if (username === "" && password === "")
            res.status (400).json({ error: "Empty username and password"});
        else if (username === "")
            res.status(400).json({ error: "Empty username" });
        else if (password === "")
            res.status(400).json({ error: "Empty password" });
        else if (!/[a-zA-Z]/.test(username))
            res.status(400).json({ error: "Invalid username, should contain alphabets" });
        else if (!/[a-zA-Z]/.test(password))
            res.status(400).json({ error: "Invalid password, should contain alphabets" });
        else {
            res.status(400).json({ error: "Invalid inut" });
        }
    }
};

exports.getMyQuizzes = async (req, res) => {
    const username = req.params.username;
    try {
        const user = await Login.findOne({ username: username });
        if (user) {
            res.status(200).json(user.myquizzes);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getMyAnswers = async (req, res) => {
    const username = req.params.username;
    try {
        const user = await Answered.findOne({ username: username });
        if (user) {
            res.status(200).json(user.answered);
        } else {
            res.status(404).json({ message: "You have not attempted any quizzes" });
        }
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getMyDrafts = async (req, res) => {
    const username = req.params.username;
    try {
        const user = await Login.findOne({ username: username });
        if (user) {
            res.status(200).json(user.mydrafts);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};