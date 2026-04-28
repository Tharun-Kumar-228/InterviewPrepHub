const User = require('../models/User');
const InterviewExperience = require('../models/InterviewExperience');
const StudyRoom = require('../models/StudyRoom');
const Comment = require('../models/Comment');
const RoomMessage = require('../models/RoomMessage');
const ApiError = require('../utils/apiError');
const { invalidatePattern } = require('../config/redis');

const getSystemStats = async () => {
  const totalUsers = await User.countDocuments();
  const totalExperiences = await InterviewExperience.countDocuments();
  const totalRooms = await StudyRoom.countDocuments();
  const totalComments = await Comment.countDocuments();

  // Difficulty breakdown
  const difficultyStats = await InterviewExperience.aggregate([
    { $group: { _id: "$difficulty", count: { $sum: 1 } } }
  ]);

  // Status breakdown
  const statusStats = await InterviewExperience.aggregate([
    { $group: { _id: "$resultStatus", count: { $sum: 1 } } }
  ]);

  // Top companies stats
  const topCompanies = await InterviewExperience.aggregate([
    { $group: { _id: "$companyName", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);

  return {
    totals: {
      users: totalUsers,
      experiences: totalExperiences,
      rooms: totalRooms,
      comments: totalComments
    },
    difficulty: difficultyStats.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, { Easy: 0, Medium: 0, Hard: 0 }),
    status: statusStats.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, { Selected: 0, Rejected: 0, Pending: 0 }),
    topCompanies: topCompanies.map(c => ({ companyName: c._id, count: c.count }))
  };
};

const getAllUsers = async () => {
  return await User.find().sort({ createdAt: -1 });
};

const updateUserRole = async (targetUserId, newRole, adminUserId) => {
  if (targetUserId.toString() === adminUserId.toString()) {
    throw new ApiError(400, 'You cannot change your own admin role.');
  }

  const user = await User.findById(targetUserId);
  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  user.role = newRole;
  await user.save();
  return user;
};

const deleteUser = async (targetUserId, adminUserId) => {
  if (targetUserId.toString() === adminUserId.toString()) {
    throw new ApiError(400, 'You cannot delete yourself.');
  }

  const user = await User.findById(targetUserId);
  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  // Delete all experiences written by this user
  const experiences = await InterviewExperience.find({ author: targetUserId });
  for (const exp of experiences) {
    await InterviewExperience.findByIdAndDelete(exp._id);
    await Comment.deleteMany({ experience: exp._id });
  }

  // Delete all comments written by the user
  await Comment.deleteMany({ author: targetUserId });

  // Delete all messages in study rooms written by the user
  await RoomMessage.deleteMany({ author: targetUserId });

  // Remove user from room member lists
  await StudyRoom.updateMany(
    { members: targetUserId },
    { $pull: { members: targetUserId }, $inc: { memberCount: -1 } }
  );

  // Delete rooms created by this user
  await StudyRoom.deleteMany({ creator: targetUserId });

  // Delete the actual user document
  await User.findByIdAndDelete(targetUserId);

  await invalidatePattern('*'); // Invalidate all cache on user deletion
  return { success: true };
};

module.exports = {
  getSystemStats,
  getAllUsers,
  updateUserRole,
  deleteUser
};
