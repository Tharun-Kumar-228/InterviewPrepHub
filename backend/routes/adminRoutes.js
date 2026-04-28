const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Lock down all routes to Admins
router.use(protect);
router.use(authorize('admin'));

// System stats
router.get('/stats', adminController.getSystemStats);

// Users lists
router.get('/users', adminController.getAllUsers);

// Change user role
router.put('/users/:userId/role', adminController.updateUserRole);

// Delete user and footprint
router.delete('/users/:userId', adminController.deleteUser);

module.exports = router;
