const profileService = require('../services/profileService');
const { sendResponse } = require('../utils/responseFormatter');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get profile statistics and info of current user
// @route   GET /api/profile
// @access  Private
const getMyProfileStats = asyncHandler(async (req, res) => {
  const result = await profileService.getProfileStats(req.user._id);
  sendResponse(res, 200, 'Profile stats fetched successfully', result);
});

// @desc    Get profile statistics and info of any user
// @route   GET /api/profile/:userId
// @access  Public
const getUserProfileStats = asyncHandler(async (req, res) => {
  const result = await profileService.getProfileStats(req.params.userId);
  sendResponse(res, 200, 'User profile stats fetched successfully', result);
});

// @desc    Get all experiences added by current user
// @route   GET /api/profile/experiences
// @access  Private
const getMyExperiences = asyncHandler(async (req, res) => {
  const experiences = await profileService.getUserExperiences(req.user._id);
  sendResponse(res, 200, 'User experiences fetched successfully', experiences);
});

// @desc    Get all bookmarked experiences of current user
// @route   GET /api/profile/bookmarks
// @access  Private
const getMyBookmarks = asyncHandler(async (req, res) => {
  const bookmarks = await profileService.getUserBookmarks(req.user._id);
  sendResponse(res, 200, 'User bookmarked experiences fetched successfully', bookmarks);
});

// @desc    Update profile details
// @route   PUT /api/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const updatedUser = await profileService.updateProfile(req.user._id, req.body);
  sendResponse(res, 200, 'Profile updated successfully', updatedUser);
});

module.exports = {
  getMyProfileStats,
  getUserProfileStats,
  getMyExperiences,
  getMyBookmarks,
  updateProfile
};
