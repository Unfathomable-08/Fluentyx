const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  userId: {
    type: String, // Email as userId
    required: true,
    unique: true, // Ensure one progress document per email
    trim: true,
    lowercase: true // Normalize email
  },
  chapters: [
    {
      chapterName: {
        type: String, // e.g., "Alphabets", "Pronouns"
        required: true
      },
      subLessons: [
        {
          subLessonName: {
            type: String, // e.g., "First Person Pronouns", "Letter Alif"
            required: true
          },
          attempts: {
            type: Number,
            default: 0 // Track number of attempts
          },
          correctAttempts: {
            type: Number,
            default: 0 // Track correct attempts
          },
          lastAttempted: {
            type: Date // Timestamp of last attempt
          },
          progress: {
            type: Number, // Percentage of exercises completed (0-100)
            default: 0
          }
        }
      ],
      progress: {
        type: Number, // Percentage of sub-lessons completed (0-100)
        default: 0
      }
    }
  ]
}, {
  timestamps: true // Automatically add createdAt and updatedAt
});

const Progress = mongoose.models.Progress || mongoose.model("Progress", ProgressSchema);

module.exports = Progress
