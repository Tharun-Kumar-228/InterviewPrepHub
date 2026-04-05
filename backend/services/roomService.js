const StudyRoom = require('../models/StudyRoom');
const RoomMessage = require('../models/RoomMessage');
const ApiError = require('../utils/apiError');
const { invalidatePattern } = require('../config/redis');

const invalidateRoomCache = async () => {
  await invalidatePattern('*rooms*');
  await invalidatePattern('*dashboard*');
};

const getRooms = async () => {
  const rooms = await StudyRoom.find({ status: 'active' })
    .populate('creator', 'name email')
    .sort({ memberCount: -1, createdAt: -1 });
  return rooms;
};

const createRoom = async (data, creatorId) => {
  const existingRoom = await StudyRoom.findOne({ name: data.name });
  if (existingRoom) {
    throw new ApiError(400, 'A study room with this name already exists.');
  }

  const room = await StudyRoom.create({
    ...data,
    creator: creatorId,
    members: [creatorId],
    memberCount: 1
  });

  await invalidateRoomCache();
  return room;
};

const getRoomById = async (roomId, userId) => {
  const room = await StudyRoom.findById(roomId)
    .populate('creator', 'name email profile')
    .populate('members', 'name email profile');

  if (!room) {
    throw new ApiError(404, 'Study room not found.');
  }

  // Fetch messages/discussion posts
  const messages = await RoomMessage.find({ room: roomId })
    .populate('author', 'name email profile')
    .sort({ createdAt: 1 }); // Oldest first (chat order) or latest first? Let's do chronological (oldest first) for chat.

  const isMember = room.members.some(m => m._id.toString() === userId.toString());

  return {
    room,
    messages,
    isMember
  };
};

const joinRoom = async (roomId, userId) => {
  const room = await StudyRoom.findById(roomId);
  if (!room) {
    throw new ApiError(404, 'Study room not found.');
  }

  if (room.members.includes(userId)) {
    return room; // Already a member
  }

  room.members.push(userId);
  room.memberCount = room.members.length;
  await room.save();

  await invalidateRoomCache();
  return room;
};

const leaveRoom = async (roomId, userId) => {
  const room = await StudyRoom.findById(roomId);
  if (!room) {
    throw new ApiError(404, 'Study room not found.');
  }

  if (!room.members.includes(userId)) {
    throw new ApiError(400, 'You are not a member of this study room.');
  }

  if (room.creator.toString() === userId.toString()) {
    throw new ApiError(400, 'Room creator cannot leave their own room. You must archive it instead.');
  }

  room.members = room.members.filter(m => m.toString() !== userId.toString());
  room.memberCount = room.members.length;
  await room.save();

  await invalidateRoomCache();
  return room;
};

const postMessage = async (roomId, content, userId) => {
  const room = await StudyRoom.findById(roomId);
  if (!room) {
    throw new ApiError(404, 'Study room not found.');
  }

  // Verify membership
  if (!room.members.includes(userId)) {
    throw new ApiError(403, 'You must join this study room before posting a message.');
  }

  const message = await RoomMessage.create({
    room: roomId,
    author: userId,
    content
  });

  await invalidateRoomCache();

  return await RoomMessage.findById(message._id).populate('author', 'name email profile');
};

const toggleMessageLike = async (messageId, userId) => {
  const message = await RoomMessage.findById(messageId);
  if (!message) {
    throw new ApiError(404, 'Message not found.');
  }

  const index = message.likes.indexOf(userId);
  let isLiked = false;

  if (index > -1) {
    message.likes.splice(index, 1);
    isLiked = false;
  } else {
    message.likes.push(userId);
    isLiked = true;
  }

  message.likesCount = message.likes.length;
  await message.save();

  return { isLiked, likesCount: message.likesCount };
};

const deleteMessage = async (messageId, user) => {
  const message = await RoomMessage.findById(messageId);
  if (!message) {
    throw new ApiError(404, 'Message not found.');
  }

  const room = await StudyRoom.findById(message.room);

  // Authorize: Message author, Room creator, or Admin
  const isAuthor = message.author.toString() === user._id.toString();
  const isRoomCreator = room && room.creator.toString() === user._id.toString();
  const isAdmin = user.role === 'admin';

  if (!isAuthor && !isRoomCreator && !isAdmin) {
    throw new ApiError(403, 'Not authorized to delete this message.');
  }

  await RoomMessage.findByIdAndDelete(messageId);
  return { success: true };
};

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
