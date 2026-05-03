const { body } = require('express-validator');
const validate = require('../middlewares/validationMiddleware');

const experienceValidator = [
  body('companyName')
    .notEmpty()
    .withMessage('Company name is required')
    .trim(),
  body('roleApplied')
    .notEmpty()
    .withMessage('Role applied is required')
    .trim(),
  body('experienceLevel')
    .isIn(['Intern', 'Entry-Level', 'Mid-Level', 'Senior-Level'])
    .withMessage('Please select a valid experience level'),
  body('difficulty')
    .isIn(['Easy', 'Medium', 'Hard'])
    .withMessage('Difficulty must be Easy, Medium, or Hard'),
  body('resultStatus')
    .isIn(['Selected', 'Rejected', 'Pending'])
    .withMessage('Result status must be Selected, Rejected, or Pending'),
  body('questionsAsked')
    .isArray({ min: 1 })
    .withMessage('At least one interview question is required'),
  body('questionsAsked.*')
    .notEmpty()
    .withMessage('Question cannot be empty')
    .trim(),
  body('interviewRounds')
    .optional()
    .isArray()
    .withMessage('Interview rounds must be structured'),
  body('interviewRounds.*.roundName')
    .notEmpty()
    .withMessage('Round name is required'),
  validate
];

const commentValidator = [
  body('content')
    .notEmpty()
    .withMessage('Comment content cannot be empty')
    .trim(),
  validate
];

module.exports = {
  experienceValidator,
  commentValidator
};
