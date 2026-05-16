const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const cache = require('../middlewares/cacheMiddleware');
const { optionalProtect } = require('../middlewares/authMiddleware');

// Global search (cached for 1 minute)
router.get('/', optionalProtect, cache(60), searchController.search);

module.exports = router;
