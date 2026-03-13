const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema(
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

// Compound index to ensure a user bookmarks an experience only once
BookmarkSchema.index({ user: 1, experience: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', BookmarkSchema);
