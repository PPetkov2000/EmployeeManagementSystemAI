const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');

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
    avatar: {
        type: String,
        default: ''
    },
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.post('save', async function (doc, next) {
    try {
        const action = this.isNew ? 'created' : 'updated';
        const report = `User ${action}: ${doc.username} (${doc.email}) at ${new Date().toISOString()}\n`;
        const reportPath = path.join(__dirname, '..', 'reports', 'user_actions.log');
        await fs.appendFile(reportPath, report);
        logger.info(report);
        next();
    } catch (error) {
        logger.error('Error writing to report file:', error);
        next();
    }
});

userSchema.post('remove', async function (doc, next) {
    try {
        const report = `User deleted: ${doc.username} (${doc.email}) at ${new Date().toISOString()}\n`;
        const reportPath = path.join(__dirname, '..', 'reports', 'user_actions.log');
        await fs.appendFile(reportPath, report);
        logger.info(report);
        next();
    } catch (error) {
        logger.error('Error writing to report file:', error);
        next();
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;