const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { protect, optionalProtect } = require('../middlewares/authMiddleware');

// Get current user profile statistics
router.get('/', protect, profileController.getMyProfileStats);

// Get current user experiences
router.get('/experiences', protect, profileController.getMyExperiences);

// Get current user bookmarked experiences
router.get('/bookmarks', protect, profileController.getMyBookmarks);

// Update profile details
router.put('/', protect, profileController.updateProfile);

// Get another user's profile stats (public route)
router.get('/:userId', optionalProtect, profileController.getUserProfileStats);

module.exports = router;
