const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const cache = require('../middlewares/cacheMiddleware');
const { optionalProtect } = require('../middlewares/authMiddleware');

// Get all companies list with aggregates (cached for 2 minutes)
router.get('/', optionalProtect, cache(120), companyController.getCompanies);

// Get specific company detailed analytics and experiences (cached for 2 minutes)
router.get('/:name', optionalProtect, cache(120), companyController.getCompanyAnalytics);

module.exports = router;
