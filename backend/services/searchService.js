const InterviewExperience = require('../models/InterviewExperience');
const StudyRoom = require('../models/StudyRoom');

const searchAll = async (term, filters = {}) => {
  const cleanTerm = term ? term.trim() : '';

  // 1. Search Experiences
  const expQuery = {};
  if (cleanTerm) {
    expQuery.$text = { $search: cleanTerm };
  }

  // Apply filters
  if (filters.companyName) {
    expQuery.companyName = new RegExp(filters.companyName.trim(), 'i');
  }
  if (filters.roleApplied) {
    expQuery.roleApplied = new RegExp(filters.roleApplied.trim(), 'i');
  }
  if (filters.difficulty) {
    expQuery.difficulty = filters.difficulty;
  }
  if (filters.experienceLevel) {
    expQuery.experienceLevel = filters.experienceLevel;
  }
  if (filters.resultStatus) {
    expQuery.resultStatus = filters.resultStatus;
  }

  const experiences = await InterviewExperience.find(expQuery)
    .populate('author', 'name email profile')
    .sort(cleanTerm ? { score: { $meta: 'textScore' } } : { createdAt: -1 });

  // 2. Search matching study rooms
  let rooms = [];
  if (cleanTerm) {
    rooms = await StudyRoom.find({
      $or: [
        { name: new RegExp(cleanTerm, 'i') },
        { description: new RegExp(cleanTerm, 'i') }
      ],
      status: 'active'
    }).populate('creator', 'name');
  } else {
    rooms = await StudyRoom.find({ status: 'active' }).limit(5);
  }

  // 3. Search matching questions
  // We extract matching questions from the experiences matching the query or experiences generally
  let questions = [];
  if (cleanTerm) {
    // Find experiences with questions containing the term
    const expWithQuestions = await InterviewExperience.find({
      questionsAsked: new RegExp(cleanTerm, 'i')
    }).select('companyName roleApplied questionsAsked');
    
    expWithQuestions.forEach(exp => {
      exp.questionsAsked.forEach(q => {
        if (q.toLowerCase().includes(cleanTerm.toLowerCase())) {
          questions.push({
            question: q,
            companyName: exp.companyName,
            roleApplied: exp.roleApplied,
            experienceId: exp._id
          });
        }
      });
    });
    // Remove duplicates
    const seen = new Set();
    questions = questions.filter(item => {
      const duplicate = seen.has(item.question.toLowerCase() + item.companyName.toLowerCase());
      seen.add(item.question.toLowerCase() + item.companyName.toLowerCase());
      return !duplicate;
    });
  }

  // 4. Search companies
  let companies = [];
  if (cleanTerm) {
    companies = await InterviewExperience.aggregate([
      { $match: { companyName: new RegExp(cleanTerm, 'i') } },
      {
        $group: {
          _id: { $toLower: { $trim: { input: "$companyName" } } },
          displayName: { $first: "$companyName" },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          companyName: "$displayName",
          experiencesCount: "$count"
        }
      },
      { $limit: 10 }
    ]);
  }

  return {
    experiences,
    rooms,
    questions,
    companies
  };
};

module.exports = {
  searchAll
};
