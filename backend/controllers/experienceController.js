const experienceService = require('../services/experienceService');
const { sendResponse } = require('../utils/responseFormatter');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Create interview experience
// @route   POST /api/experiences
// @access  Private
const createExperience = asyncHandler(async (req, res) => {
  const experience = await experienceService.createExperience(req.body, req.user._id);
  sendResponse(res, 201, 'Interview experience created successfully', experience);
});

// @desc    Get all interview experiences
// @route   GET /api/experiences
// @access  Public
const getExperiences = asyncHandler(async (req, res) => {
  const result = await experienceService.getExperiences(req.query);
  sendResponse(res, 200, 'Interview experiences fetched successfully', result.experiences, result.pagination);
});

// @desc    Get interview experience by ID
// @route   GET /api/experiences/:id
// @access  Public (Optionally Authenticated)
const getExperienceById = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user._id : null;
  const result = await experienceService.getExperienceById(req.params.id, userId);
  sendResponse(res, 200, 'Interview experience fetched successfully', result);
});

// @desc    Update interview experience
// @route   PUT /api/experiences/:id
// @access  Private
const updateExperience = asyncHandler(async (req, res) => {
  const experience = await experienceService.updateExperience(req.params.id, req.body, req.user);
  sendResponse(res, 200, 'Interview experience updated successfully', experience);
});

// @desc    Delete interview experience
// @route   DELETE /api/experiences/:id
// @access  Private
const deleteExperience = asyncHandler(async (req, res) => {
  const result = await experienceService.deleteExperience(req.params.id, req.user);
  sendResponse(res, 200, 'Interview experience deleted successfully', result);
});

// @desc    Toggle upvote on an experience
// @route   POST /api/experiences/:id/upvote
// @access  Private
const toggleUpvote = asyncHandler(async (req, res) => {
  const result = await experienceService.toggleUpvote(req.params.id, req.user._id);
  sendResponse(res, 200, result.isUpvoted ? 'Upvoted experience' : 'Removed upvote from experience', result);
});

// @desc    Toggle bookmark on an experience
// @route   POST /api/experiences/:id/bookmark
// @access  Private
const toggleBookmark = asyncHandler(async (req, res) => {
  const result = await experienceService.toggleBookmark(req.params.id, req.user._id);
  sendResponse(res, 200, result.isBookmarked ? 'Bookmarked experience' : 'Removed bookmark from experience', result);
});

// @desc    Add comment to an experience
// @route   POST /api/experiences/:id/comments
// @access  Private
const addComment = asyncHandler(async (req, res) => {
  const comment = await experienceService.addComment(req.params.id, req.body.content, req.user._id);
  sendResponse(res, 201, 'Comment added successfully', comment);
});

// @desc    Delete comment
// @route   DELETE /api/experiences/comments/:commentId
// @access  Private
const deleteComment = asyncHandler(async (req, res) => {
  const result = await experienceService.deleteComment(req.params.commentId, req.user);
  sendResponse(res, 200, 'Comment deleted successfully', result);
});

module.exports = {
  createExperience,
  getExperiences,
  getExperienceById,
  updateExperience,
  deleteExperience,
  toggleUpvote,
  toggleBookmark,
  addComment,
  deleteComment
};
