const Login = require('../models/loginModel');
const bcrypt = require('bcryptjs');
const path = require('path');

exports.registerUser = async (req, res) => {
    const { username, password } = req.body;
    if (username && password !== "") {
        const unExists = await Login.findOne({ username: username });
        try {
            if (unExists) {
                return res.status(400).json({ msg: "Username exists" });
            } else {
                bcrypt.genSalt(10, function (err, Salt) {
                    bcrypt.hash(password, Salt, async function (err, hash) {
                        if (err) {
                            console.log('Cannot encrypt');
                            return res.status(500).json({ error: 'Server error' });
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
        res.status(400).json({ error: "Empty username & password" });
    }
};

exports.validateUser = async (req, res) => {
    const { username, password } = req.body;
    if (username && password !== "") {
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
        res.status(400).json({ error: "Empty username & password" });
    }
};