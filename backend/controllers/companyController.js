const companyService = require('../services/companyService');
const { sendResponse } = require('../utils/responseFormatter');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');

// @desc    Get list of all companies with aggregates
// @route   GET /api/companies
// @access  Public
const getCompanies = asyncHandler(async (req, res) => {
  const list = await companyService.getCompaniesList();
  sendResponse(res, 200, 'Companies list fetched successfully', list);
});

// @desc    Get company analytics and experiences
// @route   GET /api/companies/:name
// @access  Public
const getCompanyAnalytics = asyncHandler(async (req, res) => {
  const stats = await companyService.getCompanyAnalytics(req.params.name);
  if (!stats) {
    throw new ApiError(404, `No interview data found for company: ${req.params.name}`);
  }
  sendResponse(res, 200, `Company details for ${req.params.name} fetched successfully`, stats);
});

module.exports = {
  getCompanies,
  getCompanyAnalytics
};
