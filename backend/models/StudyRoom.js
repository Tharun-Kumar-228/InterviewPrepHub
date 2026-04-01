const mongoose = require('mongoose');

const StudyRoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a room name'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a room description'],
      trim: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    memberCount: {
      type: Number,
      default: 1
    },
    status: {
      type: String,
      enum: ['active', 'archived'],
      default: 'active'
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('StudyRoom', StudyRoomSchema);
