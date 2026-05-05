const express = require('express');
const router = express.Router();
const experienceController = require('../controllers/experienceController');
const { experienceValidator, commentValidator } = require('../validators/experienceValidator');
const { protect, optionalProtect } = require('../middlewares/authMiddleware');
const cache = require('../middlewares/cacheMiddleware');

// Get all (cached per query/user for 2 minutes)
router.get('/', optionalProtect, cache(120), experienceController.getExperiences);

// Create experience
router.post('/', protect, experienceValidator, experienceController.createExperience);

// Get single experience detail (cached per user for 2 minutes)
router.get('/:id', optionalProtect, cache(120), experienceController.getExperienceById);

// Update experience
router.put('/:id', protect, experienceValidator, experienceController.updateExperience);

// Delete experience
router.delete('/:id', protect, experienceController.deleteExperience);

// Upvote experience
router.post('/:id/upvote', protect, experienceController.toggleUpvote);

// Bookmark experience
router.post('/:id/bookmark', protect, experienceController.toggleBookmark);

// Add comment to experience
router.post('/:id/comments', protect, commentValidator, experienceController.addComment);

// Delete comment
router.delete('/comments/:commentId', protect, experienceController.deleteComment);

module.exports = router;
