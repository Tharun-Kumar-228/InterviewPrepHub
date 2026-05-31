const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const cache = require('../middlewares/cacheMiddleware');
const { optionalProtect } = require('../middlewares/authMiddleware');

// Get homepage dashboard data (cached for 2 minutes)
router.get('/', optionalProtect, cache(120), dashboardController.getDashboard);

module.exports = router;
