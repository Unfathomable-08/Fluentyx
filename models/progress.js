const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to a User model
    required: true
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
          exercises: [
            {
              exerciseName: {
                type: String, // Unique ID for exercise, e.g., "PronounToEn", "FillInTheBlank"
                required: true
              },
              completed: {
                type: Boolean,
                default: false
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
              score: {
                type: Number, // Optional: Percentage or points (e.g., 80 for 80%)
                default: 0
              }
            }
          ],
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







// {
//   "userId": "507f1f77bcf86cd799439011",
//   "chapters": [
//     {
//       "chapterName": "Pronouns",
//       "subLessons": [
//         {
//           "subLessonId": "1",
//           "subLessonName": "First Person Pronouns",
//           "exercises": [
//             {
//               "exerciseId": "PronounToEn",
//               "exerciseType": "Match Pronoun",
//               "completed": true,
//               "attempts": 3,
//               "correctAttempts": 2,
//               "lastAttempted": "2025-06-18T15:00:00Z",
//               "score": 66
//             },
//             {
//               "exerciseId": "FillInTheBlank",
//               "exerciseType": "Fill in the Blank",
//               "completed": false,
//               "attempts": 1,
//               "correctAttempts": 0,
//               "lastAttempted": "2025-06-18T15:05:00Z",
//               "score": 0
//             }
//           ],
//           "completed": false,
//           "progress": 50
//         },
//         {
//           "subLessonId": "2",
//           "subLessonName": "Second Person Pronouns",
//           "exercises": [],
//           "completed": false,
//           "progress": 0
//         }
//       ],
//       "progress": 25
//     },
//     {
//       "chapterName": "Alphabets",
//       "subLessons": [
//         {
//           "subLessonId": "alif",
//           "subLessonName": "Letter Alif",
//           "exercises": [
//             {
//               "exerciseId": "LetterTrace",
//               "exerciseType": "Trace Letter",
//               "completed": true,
//               "attempts": 2,
//               "correctAttempts": 2,
//               "lastAttempted": "2025-06-18T14:00:00Z",
//               "score": 100
//             }
//           ],
//           "completed": true,
//           "progress": 100
//         }
//       ],
//       "progress": 33
//     }
//   ],
//   "lastUpdated": "2025-06-18T15:05:00Z",
//   "createdAt": "2025-06-18T10:00:00Z",
//   "updatedAt": "2025-06-18T15:05:00Z"
// }




// await fetch('/api/progress', {
//   method: 'POST',
//   body: JSON.stringify({
//     userId: '507f1f77bcf86cd799439011',
//     chapterName: 'Pronouns',
//     subLessonId: '1',
//     exerciseId: 'FillInTheBlank',
//     completed: true,
//     attempts: 1,
//     correctAttempts: 1,
//     score: 100
//   })
// });
