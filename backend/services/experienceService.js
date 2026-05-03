const InterviewExperience = require('../models/InterviewExperience');
const Vote = require('../models/Vote');
const Bookmark = require('../models/Bookmark');
const Comment = require('../models/Comment');
const ApiError = require('../utils/apiError');
const { invalidatePattern } = require('../config/redis');

// Invalidation Helper
const invalidateExperienceCache = async (companyName) => {
  await invalidatePattern('*dashboard*');
  await invalidatePattern('*experiences*');
  await invalidatePattern('*search*');
  await invalidatePattern('*companies*');
  if (companyName) {
    // Invalidate specific company stats if cached
    await invalidatePattern(`*company:${companyName.toLowerCase().trim()}*`);
  }
};

const createExperience = async (data, authorId) => {
  const experience = await InterviewExperience.create({
    ...data,
    author: authorId
  });

  await invalidateExperienceCache(data.companyName);
  return experience;
};

const getExperiences = async (query) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Build filter object
  const filter = {};
  if (query.companyName) filter.companyName = new RegExp(`^${query.companyName}$`, 'i');
  if (query.roleApplied) filter.roleApplied = new RegExp(query.roleApplied, 'i');
  if (query.difficulty) filter.difficulty = query.difficulty;
  if (query.experienceLevel) filter.experienceLevel = query.experienceLevel;
  if (query.resultStatus) filter.resultStatus = query.resultStatus;
  if (query.tag) filter.tags = query.tag;

  // Sorting
  let sortBy = { createdAt: -1 };
  if (query.sort === 'popular') {
    sortBy = { upvotesCount: -1, createdAt: -1 };
  } else if (query.sort === 'comments') {
    sortBy = { commentsCount: -1, createdAt: -1 };
  }

  const experiences = await InterviewExperience.find(filter)
    .populate('author', 'name email role')
    .sort(sortBy)
    .skip(skip)
    .limit(limit);

  const total = await InterviewExperience.countDocuments(filter);

  return {
    experiences,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

const getExperienceById = async (id, userId = null) => {
  const experience = await InterviewExperience.findById(id)
    .populate('author', 'name email role profile')
    .populate({
      path: 'interviewRounds',
    });

  if (!experience) {
    throw new ApiError(404, 'Interview experience not found.');
  }

  const comments = await Comment.find({ experience: id })
    .populate('author', 'name email profile')
    .sort({ createdAt: 1 });

  // Check if current user upvoted/bookmarked this experience
  let hasUpvoted = false;
  let hasBookmarked = false;
  if (userId) {
    const vote = await Vote.findOne({ user: userId, experience: id });
    const bookmark = await Bookmark.findOne({ user: userId, experience: id });
    hasUpvoted = !!vote;
    hasBookmarked = !!bookmark;
  }

  return {
    experience,
    comments,
    userState: {
      hasUpvoted,
      hasBookmarked
    }
  };
};

const updateExperience = async (id, data, user) => {
  let experience = await InterviewExperience.findById(id);
  if (!experience) {
    throw new ApiError(404, 'Interview experience not found.');
  }

  // Authorize: admin or author
  if (experience.author.toString() !== user._id.toString() && user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to edit this experience.');
  }

  experience = await InterviewExperience.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  });

  await invalidateExperienceCache(experience.companyName);
  return experience;
};

const deleteExperience = async (id, user) => {
  const experience = await InterviewExperience.findById(id);
  if (!experience) {
    throw new ApiError(404, 'Interview experience not found.');
  }

  // Authorize: admin or author
  if (experience.author.toString() !== user._id.toString() && user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to delete this experience.');
  }

  const companyName = experience.companyName;

  // Perform deletes
  await InterviewExperience.findByIdAndDelete(id);
  await Comment.deleteMany({ experience: id });
  await Bookmark.deleteMany({ experience: id });
  await Vote.deleteMany({ experience: id });

  await invalidateExperienceCache(companyName);
  return { success: true };
};

const toggleUpvote = async (experienceId, userId) => {
  const experience = await InterviewExperience.findById(experienceId);
  if (!experience) {
    throw new ApiError(404, 'Interview experience not found.');
  }

  const existingVote = await Vote.findOne({ user: userId, experience: experienceId });
  let isUpvoted = false;

  if (existingVote) {
    await Vote.findByIdAndDelete(existingVote._id);
    experience.upvotesCount = Math.max(0, experience.upvotesCount - 1);
    await experience.save();
    isUpvoted = false;
  } else {
    await Vote.create({ user: userId, experience: experienceId });
    experience.upvotesCount += 1;
    await experience.save();
    isUpvoted = true;
  }

  await invalidateExperienceCache(experience.companyName);
  return { isUpvoted, upvotesCount: experience.upvotesCount };
};

const toggleBookmark = async (experienceId, userId) => {
  const experience = await InterviewExperience.findById(experienceId);
  if (!experience) {
    throw new ApiError(404, 'Interview experience not found.');
  }

  const existingBookmark = await Bookmark.findOne({ user: userId, experience: experienceId });
  let isBookmarked = false;

  if (existingBookmark) {
    await Bookmark.findByIdAndDelete(existingBookmark._id);
    experience.bookmarksCount = Math.max(0, experience.bookmarksCount - 1);
    await experience.save();
    isBookmarked = false;
  } else {
    await Bookmark.create({ user: userId, experience: experienceId });
    experience.bookmarksCount += 1;
    await experience.save();
    isBookmarked = true;
  }

  await invalidateExperienceCache(experience.companyName);
  return { isBookmarked, bookmarksCount: experience.bookmarksCount };
};

const addComment = async (experienceId, content, userId) => {
  const experience = await InterviewExperience.findById(experienceId);
  if (!experience) {
    throw new ApiError(404, 'Interview experience not found.');
  }

  const comment = await Comment.create({
    experience: experienceId,
    author: userId,
    content
  });

  experience.commentsCount += 1;
  await experience.save();

  await invalidateExperienceCache(experience.companyName);

  return await Comment.findById(comment._id).populate('author', 'name email profile');
};

const deleteComment = async (commentId, user) => {
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, 'Comment not found.');
  }

  const experience = await InterviewExperience.findById(comment.experience);
  
  // Authorize: admin or comment author
  if (comment.author.toString() !== user._id.toString() && user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to delete this comment.');
  }

  await Comment.findByIdAndDelete(commentId);

  if (experience) {
    experience.commentsCount = Math.max(0, experience.commentsCount - 1);
    await experience.save();
    await invalidateExperienceCache(experience.companyName);
  }

  return { success: true };
};

module.exports = {
  createExperience,
  getExperiences,
  getExperienceById,
  updateExperience,
  deleteExperience,
  toggleUpvote,
  toggleBookmark,
  addComment,
  deleteComment
};
