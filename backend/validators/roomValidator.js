const { body } = require('express-validator');
const validate = require('../middlewares/validationMiddleware');

const roomValidator = [
  body('name')
    .notEmpty()
    .withMessage('Study room name is required')
    .trim(),
  body('description')
    .notEmpty()
    .withMessage('Study room description is required')
    .trim(),
  validate
];

const messageValidator = [
  body('content')
    .notEmpty()
    .withMessage('Message content cannot be empty')
    .trim(),
  validate
];

module.exports = {
  roomValidator,
  messageValidator
};
