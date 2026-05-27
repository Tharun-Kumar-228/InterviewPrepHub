const User = require('../models/User');
const InterviewExperience = require('../models/InterviewExperience');
const Bookmark = require('../models/Bookmark');
const ApiError = require('../utils/apiError');
const { invalidatePattern } = require('../config/redis');

const getProfileStats = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  // Get count of experiences added by the user
  const experiencesCount = await InterviewExperience.countDocuments({ author: userId });

  // Get total upvotes received across all their experiences
  const experiences = await InterviewExperience.find({ author: userId });
  const totalUpvotesReceived = experiences.reduce((sum, exp) => sum + (exp.upvotesCount || 0), 0);

  // Get bookmarks added by the user
  const bookmarksCount = await Bookmark.countDocuments({ user: userId });

  return {
    user,
    stats: {
      experiencesCount,
      totalUpvotesReceived,
      bookmarksCount
    }
  };
};

const getUserExperiences = async (userId) => {
  const experiences = await InterviewExperience.find({ author: userId })
    .sort({ createdAt: -1 });
  return experiences;
};

const getUserBookmarks = async (userId) => {
  const bookmarks = await Bookmark.find({ user: userId })
    .populate({
      path: 'experience',
      populate: {
        path: 'author',
        select: 'name'
      }
    })
    .sort({ createdAt: -1 });

  return bookmarks;
};

const updateProfile = async (userId, updateData) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  // Update name if present
  if (updateData.name) user.name = updateData.name;
  
  // Extract profile fields (accepting flat fields or nested under profile)
  const profileFields = updateData.profile || {};
  const bio = updateData.bio !== undefined ? updateData.bio : profileFields.bio;
  const githubUrl = updateData.githubUrl !== undefined ? updateData.githubUrl : profileFields.githubUrl;
  const linkedinUrl = updateData.linkedinUrl !== undefined ? updateData.linkedinUrl : profileFields.linkedinUrl;
  const skills = updateData.skills !== undefined ? updateData.skills : profileFields.skills;
  const graduationYear = updateData.graduationYear !== undefined ? updateData.graduationYear : profileFields.graduationYear;

  user.profile = {
    bio: bio !== undefined ? bio : user.profile.bio,
    githubUrl: githubUrl !== undefined ? githubUrl : user.profile.githubUrl,
    linkedinUrl: linkedinUrl !== undefined ? linkedinUrl : user.profile.linkedinUrl,
    skills: skills !== undefined ? skills : user.profile.skills,
    graduationYear: graduationYear !== undefined ? graduationYear : user.profile.graduationYear,
  };

  await user.save();
  
  // Invalidate profile caching and search results
  await invalidatePattern('*search*');
  
  return await User.findById(userId).select('-password');
};

module.exports = {
  getProfileStats,
  getUserExperiences,
  getUserBookmarks,
  updateProfile
};
