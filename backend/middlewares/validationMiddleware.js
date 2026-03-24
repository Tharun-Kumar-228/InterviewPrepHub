const { validationResult } = require('express-validator');
const ApiError = require('../utils/apiError');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMsgs = errors.array().map(err => `${err.path}: ${err.msg}`).join(', ');
    return next(new ApiError(400, `Validation Failed: ${errorMsgs}`));
  }
  next();
};

module.exports = validate;
