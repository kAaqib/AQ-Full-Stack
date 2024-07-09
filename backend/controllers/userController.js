const Login = require('../models/loginModel');
const bcrypt = require('bcryptjs');
const path = require('path');

exports.registerUser = async (req, res) => {
    const { username, password } = req.body;

    if (username && password !== "") {
        const unExists = await Login.findOne({ username: username });

        try {
            if (unExists) {
                res.status(500).json({ status: "error", resCode: 500, msg: "Username exists" });
            } else {
                bcrypt.genSalt(10, function (err, Salt) {
                    bcrypt.hash(password, Salt, async function (err, hash) {
                        if (err) {
                            return console.log('Cannot encrypt');
                        }
                        const user = new Login({ username: username, password: hash });
                        await user.save();
                        res.sendFile(path.join(__dirname, "../../frontend/views/index.html"));
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
            res.sendFile(path.join(__dirname, "../../frontend/views/home.html"));
        } else {
            res.json({ err: "Invalid Credentials" });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};