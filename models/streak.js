import mongoose from 'mongoose';

const streakSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Ensure one streak record per user
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'], // Basic email validation
  },
  currentStreak: {
    type: Number,
    default: 0, // Start with 0 streak
    min: [0, 'Streak cannot be negative'],
  },
  lastCompletedDate: {
    type: Date, // Store the date of the last completed daily exercise
    default: null,
  },
  longestStreak: {
    type: Number,
    default: 0, // Track the longest streak achieved
    min: [0, 'Longest streak cannot be negative'],
  },
  completedDates: [{
    date: {
      type: Date, // Date when the user completed the exercise
      required: true,
    },
    totalTime: {
      type: Number, // Time spent in seconds
      required: true,
      min: [0, 'Total time cannot be negative'],
    },
  }],
}, {
  timestamps: true, // Automatically add createdAt and updatedAt
});

export default mongoose.models.Streak || mongoose.model('Streak', streakSchema);