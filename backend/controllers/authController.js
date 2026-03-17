const authService = require('../services/authService');
const { sendResponse } = require('../utils/responseFormatter');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res, next) => {
  const result = await authService.register(req.body);
  sendResponse(res, 201, 'User registered successfully', result);
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res, next) => {
  const result = await authService.login(req.body.email, req.body.password);
  sendResponse(res, 200, 'User logged in successfully', result);
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res, next) => {
  sendResponse(res, 200, 'Current user profile fetched successfully', req.user);
});

module.exports = {
  register,
  login,
  getMe
};
