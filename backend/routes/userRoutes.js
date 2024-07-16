const express = require('express');
const path = require('path');
const { registerUser, validateUser } = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', validateUser);

module.exports = router;
