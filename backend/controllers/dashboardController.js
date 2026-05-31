const dashboardService = require('../services/dashboardService');
const { sendResponse } = require('../utils/responseFormatter');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get dashboard metrics, contributors, questions, rooms, and company stats
// @route   GET /api/dashboard
// @access  Public
const getDashboard = asyncHandler(async (req, res) => {
  const dashboardData = await dashboardService.getDashboardData();
  sendResponse(res, 200, 'Dashboard data aggregated successfully', dashboardData);
});

module.exports = {
  getDashboard
};
