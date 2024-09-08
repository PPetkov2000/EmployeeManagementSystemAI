const mongoose = require('mongoose');

const userPerformanceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    taskCompletion: {
        completed: { type: Number, required: true },
        total: { type: Number, required: true }
    },
    qualityRating: { type: Number, required: true, min: 1, max: 10 },
    teamworkRating: { type: Number, required: true, min: 1, max: 10 },
    attendance: {
        daysPresent: { type: Number, required: true },
        totalWorkDays: { type: Number, required: true }
    },
    initiativeRating: { type: Number, required: true, min: 1, max: 10 },
    performanceScore: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('UserPerformance', userPerformanceSchema);