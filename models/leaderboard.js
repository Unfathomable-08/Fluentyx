const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leaderboardSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  weekly_score: {
    type: Number,
    default: 0,
    required: true
  },
  trophies: {
    type: [String],
    default: [],
    required: false
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Ensure email index is created
leaderboardSchema.index({ email: 1 }, { unique: true });

const Leaderboard = mongoose.models.Leaderboard || mongoose.model("Leaderboard", leaderboardSchema);

module.exports = Leaderboard;