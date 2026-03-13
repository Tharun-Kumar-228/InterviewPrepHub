const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    experience: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InterviewExperience',
      required: true,
      index: true,
    }
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure a user votes on an experience only once
VoteSchema.index({ user: 1, experience: 1 }, { unique: true });

module.exports = mongoose.model('Vote', VoteSchema);
