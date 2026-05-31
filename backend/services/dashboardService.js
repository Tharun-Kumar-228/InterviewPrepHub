const InterviewExperience = require('../models/InterviewExperience');
const StudyRoom = require('../models/StudyRoom');

const getDashboardData = async () => {
  // 1. Trending Companies
  const trendingCompanies = await InterviewExperience.aggregate([
    {
      $group: {
        _id: { $toLower: { $trim: { input: "$companyName" } } },
        companyName: { $first: "$companyName" },
        count: { $sum: 1 },
        selectedCount: {
          $sum: { $cond: [{ $eq: ["$resultStatus", "Selected"] }, 1, 0] }
        }
      }
    },
    {
      $project: {
        _id: 0,
        companyName: 1,
        count: 1,
        selectionRate: {
          $cond: {
            if: { $gt: ["$count", 0] },
            then: { $round: [{ $multiply: [{ $divide: ["$selectedCount", "$count"] }, 100] }, 0] },
            else: 0
          }
        }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);

  // 2. Active Study Rooms
  const activeRooms = await StudyRoom.find({ status: 'active' })
    .populate('creator', 'name')
    .sort({ memberCount: -1, createdAt: -1 })
    .limit(5);

  // 3. Recent Interview Experiences
  const recentExperiences = await InterviewExperience.find()
    .populate('author', 'name profile')
    .sort({ createdAt: -1 })
    .limit(5);

  // 4. Top Contributors
  const topContributors = await InterviewExperience.aggregate([
    { $group: { _id: "$author", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user"
      }
    },
    { $unwind: "$user" },
    {
      $project: {
        _id: 0,
        userId: "$_id",
        name: "$user.name",
        role: "$user.role",
        bio: "$user.profile.bio",
        experienceCount: "$count"
      }
    }
  ]);

  // 5. Popular Interview Questions
  const popularQuestions = await InterviewExperience.aggregate([
    { $unwind: "$questionsAsked" },
    {
      $group: {
        _id: { $trim: { input: "$questionsAsked" } },
        count: { $sum: 1 },
        companies: { $addToSet: "$companyName" }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 5 },
    {
      $project: {
        _id: 0,
        question: "$_id",
        count: 1,
        companies: { $slice: ["$companies", 3] }
      }
    }
  ]);

  return {
    trendingCompanies,
    activeRooms,
    recentExperiences,
    topContributors,
    popularQuestions
  };
};

module.exports = {
  getDashboardData
};
