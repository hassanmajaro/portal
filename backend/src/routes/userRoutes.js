const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { upload } = require('../middlewares/uploadMiddleware');

// User registration route
router.post('/register', userController.register);

// User login route
router.post('/login', userController.login);

// User activation route
router.post('/verifyEmail', userController.verifyEmail);

module.exports = router;
