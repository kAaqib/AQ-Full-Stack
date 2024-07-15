const Login = require('../models/loginModel');
const bcrypt = require('bcryptjs');
const path = require('path');

exports.registerUser = async (req, res) => {
    const { username, password } = req.body;
    if (username && password !== "") {
        const unExists = await Login.findOne({ username: username });
        try {
            if (unExists) {
                return res.json({ msg: "Username exists" });
            } else {
                bcrypt.genSalt(10, function (err, Salt) {
                    bcrypt.hash(password, Salt, async function (err, hash) {
                        if (err) {
                            return console.log('Cannot encrypt');
                        }
                        const user = new Login({ username: username, password: hash });
                        await user.save();
                        res.json({msg: "Success"});
                    });
                });
            }
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    }
};

exports.validateUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await Login.findOne({ username: username });
        if (!user) {
            return res.json({ err: "User does not exist" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            res.json({ msg: "Success"});
        } else {
            res.json({ err: "Invalid Credentials" });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};