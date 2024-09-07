const mongoose = require('mongoose');

const vacationRequestSchema = mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Approved', 'Denied'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

const VacationRequest = mongoose.model('VacationRequest', vacationRequestSchema);

module.exports = VacationRequest;