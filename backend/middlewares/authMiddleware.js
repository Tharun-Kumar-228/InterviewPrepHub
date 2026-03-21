const jwt = require('jsonwebtoken');
const ApiError = require('../utils/apiError');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// Protect routes
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return next(new ApiError(401, 'Not authorized to access this route. Please log in.'));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key_interviewprep_hub_2026');

    // Add user to request
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return next(new ApiError(401, 'User associated with this token no longer exists.'));
    }

    next();
  } catch (err) {
    return next(new ApiError(401, 'Not authorized to access this route. Invalid token.'));
  }
});

// Optional protect for public routes that adapt based on user context (e.g. check bookmark state)
const optionalProtect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key_interviewprep_hub_2026');
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    // Fail silently, proceed as guest
    next();
  }
});

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required before authorization.'));
    }
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, `User role '${req.user.role}' is not authorized to access this route.`));
    }
    next();
  };
};

module.exports = {
  protect,
  optionalProtect,
  authorize
};
