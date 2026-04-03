const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { roomValidator, messageValidator } = require('../validators/roomValidator');
const { protect, authorize, optionalProtect } = require('../middlewares/authMiddleware');
const cache = require('../middlewares/cacheMiddleware');

// Get all active rooms (cached per user/guest for 2 minutes)
router.get('/', optionalProtect, cache(120), roomController.getRooms);

// Create study room (Restricted to room_creator and admin)
router.post('/', protect, authorize('room_creator', 'admin'), roomValidator, roomController.createRoom);

// Get single room detail and messages
router.get('/:id', protect, roomController.getRoomById);

// Join study room
router.post('/:id/join', protect, roomController.joinRoom);

// Leave study room
router.post('/:id/leave', protect, roomController.leaveRoom);

// Post message to room discussion
router.post('/:id/messages', protect, messageValidator, roomController.postMessage);

// Like message
router.post('/messages/:messageId/like', protect, roomController.toggleMessageLike);

// Delete message
router.delete('/messages/:messageId', protect, roomController.deleteMessage);

module.exports = router;
