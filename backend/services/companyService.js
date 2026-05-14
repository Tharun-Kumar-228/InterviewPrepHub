const InterviewExperience = require('../models/InterviewExperience');

const getCompaniesList = async () => {
  const result = await InterviewExperience.aggregate([
    {
      $group: {
        _id: { $toLower: { $trim: { input: "$companyName" } } },
        displayName: { $first: "$companyName" },
        experiencesCount: { $sum: 1 },
        selectedCount: {
          $sum: { $cond: [{ $eq: ["$resultStatus", "Selected"] }, 1, 0] }
        },
        totalUpvotes: { $sum: "$upvotesCount" }
      }
    },
    {
      $project: {
        _id: 0,
        companyName: "$displayName",
        experiencesCount: 1,
        selectionRate: {
          $cond: {
            if: { $gt: ["$experiencesCount", 0] },
            then: { $round: [{ $multiply: [{ $divide: ["$selectedCount", "$experiencesCount"] }, 100] }, 0] },
            else: 0
          }
        },
        totalUpvotes: 1
      }
    },
    { $sort: { experiencesCount: -1, companyName: 1 } }
  ]);
  return result;
};

const getCompanyAnalytics = async (companyName) => {
  const experiences = await InterviewExperience.find({
    companyName: new RegExp(`^${companyName.trim()}$`, 'i')
  }).populate('author', 'name profile');

  if (experiences.length === 0) {
    return null;
  }

  // Calculate stats
  const difficulty = { Easy: 0, Medium: 0, Hard: 0 };
  let selected = 0;
  let totalBookmarks = 0;
  const questionsMap = {};

  experiences.forEach(exp => {
    // Difficulty
    if (difficulty[exp.difficulty] !== undefined) {
      difficulty[exp.difficulty]++;
    }
    // Result
    if (exp.resultStatus === 'Selected') {
      selected++;
    }
    // Bookmarks
    totalBookmarks += (exp.bookmarksCount || 0);
    // Questions
    exp.questionsAsked.forEach(q => {
      const qTrimmed = q.trim();
      questionsMap[qTrimmed] = (questionsMap[qTrimmed] || 0) + 1;
    });
  });

  const total = experiences.length;
  const selectionRate = total > 0 ? Math.round((selected / total) * 100) : 0;

  // Sort questions by frequency
  const mostAskedQuestions = Object.entries(questionsMap)
    .map(([question, count]) => ({ question, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Trending status: if has new experiences in last 14 days OR high bookmarks
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - 30);
  const isTrending = experiences.some(exp => exp.createdAt >= cutoffDate) || totalBookmarks > 5;

  return {
    companyName: experiences[0].companyName,
    totalExperiences: total,
    selectionRate,
    difficultyBreakdown: difficulty,
    bookmarks: totalBookmarks,
    mostAskedQuestions,
    isTrending,
    experiences: experiences.map(e => ({
      _id: e._id,
      roleApplied: e.roleApplied,
      experienceLevel: e.experienceLevel,
      difficulty: e.difficulty,
      resultStatus: e.resultStatus,
      upvotesCount: e.upvotesCount,
      author: e.author,
      createdAt: e.createdAt
    }))
  };
};

module.exports = {
  getCompaniesList,
  getCompanyAnalytics
};
