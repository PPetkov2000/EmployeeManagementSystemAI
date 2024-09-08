const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [
            /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
            "Please add a valid email",
        ],
    },
    password: { type: String, required: true },
    username: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    role: {
        type: String,
        enum: ['user', 'creator', 'admin', 'manager'],
        default: 'user'
    },
    position: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    vacationDays: {
        type: Number,
        default: 0
    },
    performanceScore: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserPerformance'
    },
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;