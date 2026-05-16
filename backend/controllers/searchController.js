const searchService = require('../services/searchService');
const { sendResponse } = require('../utils/responseFormatter');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Global text search with filters
// @route   GET /api/search
// @access  Public
const search = asyncHandler(async (req, res) => {
  const { q, companyName, roleApplied, difficulty, experienceLevel, resultStatus } = req.query;

  const filters = {
    companyName,
    roleApplied,
    difficulty,
    experienceLevel,
    resultStatus
  };

  const results = await searchService.searchAll(q, filters);
  sendResponse(res, 200, 'Search results compiled successfully', results);
});

module.exports = {
  search
};
