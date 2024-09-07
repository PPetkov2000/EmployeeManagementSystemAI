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
    name: {
        type: String,
    },
    role: {
        type: String,
        enum: ['user', 'creator', 'admin', 'manager'],
        default: 'user'
    },
    vacationDays: {
        type: Number,
        default: 0
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