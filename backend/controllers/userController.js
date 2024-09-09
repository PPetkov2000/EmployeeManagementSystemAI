const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const logger = require('../utils/logger');

const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const skip = (page - 1) * limit;

        const searchQuery = {
            $or: [
                { email: { $regex: search, $options: 'i' } },
                { username: { $regex: search, $options: 'i' } },
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { position: { $regex: search, $options: 'i' } },
                { department: { $regex: search, $options: 'i' } },
            ]
        };

        const totalUsers = await User.countDocuments(searchQuery);
        const users = await User.find(searchQuery)
            .sort({ updatedAt: 'desc' })
            .skip(skip)
            .limit(limit)
            .select('-password');

        res.json({
            users,
            currentPage: page,
            totalPages: Math.ceil(totalUsers / limit),
            totalUsers
        });
    } catch (error) {
        logger.error('Error in getAllUsers:', error);
        res.status(500).json({ message: `Error fetching users: ${error.message}` });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        logger.error('Error in getUserById:', error);
        res.status(500).json({ message: `Error fetching user: ${error.message}` });
    }
};

const updateUser = async (req, res) => {
    try {
        const { email, password, username, firstName, lastName, position, department, role, salary, vacationDays, isVerified } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (email) user.email = email;
        if (username) user.username = username;
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (position) user.position = position;
        if (department) user.department = department;
        if (role) user.role = role;
        if (salary) user.salary = salary;
        if (vacationDays !== undefined) user.vacationDays = vacationDays;
        if (isVerified !== undefined) user.isVerified = isVerified;
        if (password) {
            user.password = password;
        }
        if (req.file) {
            const oldAvatarPath = path.join(__dirname, '..', 'public', user.avatar);
            if (fs.existsSync(oldAvatarPath)) {
                fs.unlinkSync(oldAvatarPath);
            }
            user.avatar = `/avatars/${req.file.filename}`;
        }
        await user.save();
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        logger.error('Error in updateUser:', error);
        res.status(500).json({ message: `Error updating user: ${error.message}` });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        logger.error('Error in deleteUser:', error);
        res.status(500).json({ message: `Error deleting user: ${error.message}` });
    }
};

const createUser = async (req, res) => {
    try {
        const { email, password, username, firstName, lastName, position, department, role, salary, vacationDays, isVerified } = req.body;
        const user = new User({ email, password, username, firstName, lastName, position, department, role, salary, vacationDays, isVerified });
        if (req.file) {
            user.avatar = `/avatars/${req.file.filename}`;
        }
        await user.save();
        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        logger.error('Error in createUser:', error);
        res.status(500).json({ message: `Error creating user: ${error.message}` });
    }
};

const getUserStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const departmentCounts = await User.aggregate([
            { $group: { _id: "$department", count: { $sum: 1 } } }
        ]);
        const averageSalary = await User.aggregate([
            { $group: { _id: null, avg: { $avg: "$salary" } } }
        ]);

        res.status(200).json({
            totalUsers,
            departmentCounts,
            averageSalary: averageSalary[0]?.avg || 0
        });
    } catch (error) {
        logger.error('Error fetching user stats:', error);
        res.status(500).json({ message: `Internal server error: ${error.message}` });
    }
}

const getUserPerformance = async (req, res) => {
    try {
        const performanceData = await User.aggregate([
            {
                $group: {
                    _id: null,
                    averagePerformance: { $avg: "$performanceScore" },
                    topPerformers: { $push: { $cond: [{ $gte: ["$performanceScore", 90] }, "$$ROOT", null] } },
                    lowPerformers: { $push: { $cond: [{ $lte: ["$performanceScore", 60] }, "$$ROOT", null] } }
                }
            },
            {
                $project: {
                    averagePerformance: 1,
                    topPerformers: { $slice: [{ $filter: { input: "$topPerformers", as: "emp", cond: { $ne: ["$$emp", null] } } }, 5] },
                    lowPerformers: { $slice: [{ $filter: { input: "$lowPerformers", as: "emp", cond: { $ne: ["$$emp", null] } } }, 5] }
                }
            }
        ]);

        res.status(200).json({ averagePerformance: performanceData[0]?.averagePerformance || 0, topPerformers: performanceData[0]?.topPerformers || [], lowPerformers: performanceData[0]?.lowPerformers || [] });
    } catch (error) {
        logger.error('Error fetching user performance:', error);
        res.status(500).json({ message: `Internal server error: ${error.message}` });
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    createUser,
    getUserStats,
    getUserPerformance
};