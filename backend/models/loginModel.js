const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
    myquizzes: Array
});

module.exports = mongoose.model('Login', loginSchema);