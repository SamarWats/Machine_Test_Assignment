const express = require('express');
const router = express.Router();
const { loginUser, registerUser, checkUser } = require('../controllers/authControllers');

router.post('/register', registerUser); // Route for user registration
// Check if email or phone already exists
router.post('/check-user', checkUser);
router.post('/login', loginUser);

module.exports = router;