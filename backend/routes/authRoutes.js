const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { signupValidator, loginValidator } = require('../validators/authValidator');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register', signupValidator, authController.register);
router.post('/login', loginValidator, authController.login);
router.get('/me', protect, authController.getMe);

module.exports = router;
