const { body } = require('express-validator');
const validate = require('../middlewares/validationMiddleware');

const signupValidator = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .trim(),
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['user', 'room_creator', 'admin'])
    .withMessage('Role must be user, room_creator, or admin'),
  body('profile.graduationYear')
    .optional()
    .isInt({ min: 2000, max: 2100 })
    .withMessage('Please select a valid graduation year'),
  validate
];

const loginValidator = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  validate
];

module.exports = {
  signupValidator,
  loginValidator
};
