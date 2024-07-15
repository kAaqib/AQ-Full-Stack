const mongoose = require('mongoose');

const arr = mongoose.Schema ({
    code: String,
    lastupdate: Date
})

const loginSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
    myquizzes: [arr],
    mydrafts: [arr]
});

module.exports = mongoose.model('Login', loginSchema);