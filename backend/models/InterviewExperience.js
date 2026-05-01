const mongoose = require('mongoose');

const RoundSchema = new mongoose.Schema({
  roundName: { type: String, required: true },
  description: { type: String, default: '' },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' }
});

const InterviewExperienceSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'Please add a company name'],
      trim: true,
      index: true,
    },
    roleApplied: {
      type: String,
      required: [true, 'Please add the role applied for'],
      trim: true,
      index: true,
    },
    experienceLevel: {
      type: String,
      enum: ['Intern', 'Entry-Level', 'Mid-Level', 'Senior-Level'],
      default: 'Entry-Level',
      index: true,
    },
    interviewRounds: [RoundSchema],
    questionsAsked: [{
      type: String,
      required: [true, 'Please add at least one question asked']
    }],
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: true,
      index: true,
    },
    resultStatus: {
      type: String,
      enum: ['Selected', 'Rejected', 'Pending'],
      required: true,
      index: true,
    },
    tipsResources: {
      type: String,
      default: ''
    },
    tags: [{
      type: String,
      index: true
    }],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    upvotesCount: {
      type: Number,
      default: 0
    },
    bookmarksCount: {
      type: Number,
      default: 0
    },
    commentsCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
  }
);

// Create compound text index for global search
InterviewExperienceSchema.index(
  {
    companyName: 'text',
    roleApplied: 'text',
    questionsAsked: 'text',
    tags: 'text',
    tipsResources: 'text'
  },
  {
    weights: {
      companyName: 10,
      roleApplied: 5,
      questionsAsked: 3,
      tags: 2,
      tipsResources: 1
    },
    name: 'ExperienceTextSearchIndex'
  }
);

module.exports = mongoose.model('InterviewExperience', InterviewExperienceSchema);
