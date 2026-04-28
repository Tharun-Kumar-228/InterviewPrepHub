const adminService = require('../services/adminService');
const { sendResponse } = require('../utils/responseFormatter');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get system stats for admin dashboard
// @route   GET /api/admin/stats
// @access  Private (Admin Only)
const getSystemStats = asyncHandler(async (req, res) => {
  const stats = await adminService.getSystemStats();
  sendResponse(res, 200, 'System stats compiled successfully', stats);
});

// @desc    Get all users list
// @route   GET /api/admin/users
// @access  Private (Admin Only)
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await adminService.getAllUsers();
  sendResponse(res, 200, 'All registered users fetched successfully', users);
});

// @desc    Change a user's role
// @route   PUT /api/admin/users/:userId/role
// @access  Private (Admin Only)
const updateUserRole = asyncHandler(async (req, res) => {
  const user = await adminService.updateUserRole(req.params.userId, req.body.role, req.user._id);
  sendResponse(res, 200, `User role changed to ${req.body.role} successfully`, user);
});

// @desc    Moderate/Delete user and their entire footprint
// @route   DELETE /api/admin/users/:userId
// @access  Private (Admin Only)
const deleteUser = asyncHandler(async (req, res) => {
  const result = await adminService.deleteUser(req.params.userId, req.user._id);
  sendResponse(res, 200, 'User and all associated data deleted successfully', result);
});

module.exports = {
  getSystemStats,
  getAllUsers,
  updateUserRole,
  deleteUser
};
