const roomService = require('../services/roomService');
const { sendResponse } = require('../utils/responseFormatter');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all active study rooms
// @route   GET /api/rooms
// @access  Public
const getRooms = asyncHandler(async (req, res) => {
  const rooms = await roomService.getRooms();
  sendResponse(res, 200, 'Study rooms fetched successfully', rooms);
});

// @desc    Create study room
// @route   POST /api/rooms
// @access  Private (Restricted to room_creator, admin)
const createRoom = asyncHandler(async (req, res) => {
  const room = await roomService.createRoom(req.body, req.user._id);
  sendResponse(res, 201, 'Study room created successfully', room);
});

// @desc    Get study room by ID with discussions
// @route   GET /api/rooms/:id
// @access  Private
const getRoomById = asyncHandler(async (req, res) => {
  const result = await roomService.getRoomById(req.params.id, req.user._id);
  sendResponse(res, 200, 'Study room details fetched successfully', result);
});

// @desc    Join a study room
// @route   POST /api/rooms/:id/join
// @access  Private
const joinRoom = asyncHandler(async (req, res) => {
  const room = await roomService.joinRoom(req.params.id, req.user._id);
  sendResponse(res, 200, 'Successfully joined study room', room);
});

// @desc    Leave a study room
// @route   POST /api/rooms/:id/leave
// @access  Private
const leaveRoom = asyncHandler(async (req, res) => {
  const room = await roomService.leaveRoom(req.params.id, req.user._id);
  sendResponse(res, 200, 'Successfully left study room', room);
});

// @desc    Post message in study room discussion
// @route   POST /api/rooms/:id/messages
// @access  Private
const postMessage = asyncHandler(async (req, res) => {
  const message = await roomService.postMessage(req.params.id, req.body.content, req.user._id);
  sendResponse(res, 201, 'Message posted successfully', message);
});

// @desc    Like a discussion message
// @route   POST /api/rooms/messages/:messageId/like
// @access  Private
const toggleMessageLike = asyncHandler(async (req, res) => {
  const result = await roomService.toggleMessageLike(req.params.messageId, req.user._id);
  sendResponse(res, 200, result.isLiked ? 'Liked message' : 'Unliked message', result);
});

// @desc    Delete message from room
// @route   DELETE /api/rooms/messages/:messageId
// @access  Private
const deleteMessage = asyncHandler(async (req, res) => {
  const result = await roomService.deleteMessage(req.params.messageId, req.user);
  sendResponse(res, 200, 'Message deleted successfully', result);
});

module.exports = {
  getRooms,
  createRoom,
  getRoomById,
  joinRoom,
  leaveRoom,
  postMessage,
  toggleMessageLike,
  deleteMessage
};
