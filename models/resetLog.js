const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resetLogSchema = new Schema({
  resetDate: {
    type: Date,
    required: true,
  },
  weekStart: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true,
});

const ResetLog = mongoose.models.ResetLog || mongoose.model('ResetLog', resetLogSchema);

module.exports = ResetLog;