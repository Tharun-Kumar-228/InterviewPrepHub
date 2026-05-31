const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/apiError');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_super_secret_jwt_key_interviewprep_hub_2026', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

const register = async (userData) => {
  const { name, email, password, role, profile } = userData;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ApiError(400, 'User already exists with this email address.');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'user', // Defaults to 'user', but can request 'room_creator' or 'admin'
    profile: profile || {}
  });

  const token = generateToken(user._id);

  // Exclude password from return
  const userResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    profile: user.profile,
  };

  return { user: userResponse, token };
};

const login = async (email, password) => {
  // Validate email and password
  if (!email || !password) {
    throw new ApiError(400, 'Please provide email and password.');
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid credentials.');
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials.');
  }

  const token = generateToken(user._id);

  const userResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    profile: user.profile,
  };

  return { user: userResponse, token };
};

module.exports = {
  register,
  login
};
