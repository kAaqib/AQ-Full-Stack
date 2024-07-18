const mongoose = require('mongoose');

const arr = mongoose.Schema ({
    code: String,
    status: Boolean,
    lastupdate: Date
})

const loginSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
    myquizzes: [arr]
});

module.exports = mongoose.model('Login', loginSchema);