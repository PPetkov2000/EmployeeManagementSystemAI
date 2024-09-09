const UserPerformance = require('../models/UserPerformance');
const logger = require('../utils/logger');

const calculatePerformanceScore = (performance) => {
    const weights = {
        taskCompletion: 0.3,
        qualityOfWork: 0.3,
        teamwork: 0.2,
        attendance: 0.1,
        initiative: 0.1
    };

    const taskCompletionRate = performance.taskCompletion.completed / performance.taskCompletion.total;
    const attendanceRate = performance.attendance.daysPresent / performance.attendance.totalWorkDays;

    const ratings = {
        taskCompletion: Math.min(Math.round(taskCompletionRate * 10), 10),
        qualityOfWork: performance.qualityRating,
        teamwork: performance.teamworkRating,
        attendance: Math.min(Math.round(attendanceRate * 10), 10),
        initiative: performance.initiativeRating
    };

    let performanceScore = 0;
    for (const [factor, weight] of Object.entries(weights)) {
        performanceScore += ratings[factor] * weight;
    }

    return Math.round(performanceScore * 100) / 100;
};

const getAllUserPerformances = async (req, res) => {
    try {
        const performances = await UserPerformance.find().populate('userId', '-password');

        const formattedPerformances = performances.map(performance => ({
            userId: performance.userId._id,
            firstName: performance.userId.firstName,
            lastName: performance.userId.lastName,
            performanceScore: performance.performanceScore,
            taskCompletion: performance.taskCompletion,
            qualityRating: performance.qualityRating,
            teamworkRating: performance.teamworkRating,
            attendance: performance.attendance,
            initiativeRating: performance.initiativeRating
        }));

        res.status(200).json(formattedPerformances);
    } catch (error) {
        logger.warn(`Error fetching all performances: ${error.message}`);
        res.status(500).json({ message: 'Error fetching performance data', error: error.message });
    }
};

const createPerformance = async (req, res) => {
    try {
        const performanceData = req.body;
        performanceData.performanceScore = calculatePerformanceScore(performanceData);
        const performance = new UserPerformance(performanceData);
        await performance.save();
        res.status(201).json(performance);
    } catch (error) {
        logger.warn(`Error creating performance: ${error.message}`);
        res.status(400).json({ message: error.message });
    }
};

const getPerformance = async (req, res) => {
    try {
        const currentUserPerformance = await UserPerformance.findOne({ userId: req.params.userId }).sort({ updatedAt: 'desc' }).populate('userId', '-password');
        const allPerformances = await UserPerformance.find().sort({ performanceScore: "desc" }).populate('userId', '-password');
        const topPerformers = allPerformances.slice(0, 5);
        const lowPerformers = allPerformances.slice(-5).reverse();

        res.json({
            currentUserPerformance: currentUserPerformance || {},
            allPerformances: allPerformances || [],
            topPerformers: topPerformers || [],
            lowPerformers: lowPerformers || []
        });
    } catch (error) {
        logger.warn(`Error getting performance: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

const updatePerformance = async (req, res) => {
    try {
        const performanceData = req.body;
        performanceData.performanceScore = calculatePerformanceScore(performanceData);
        const performance = await UserPerformance.findOneAndUpdate(
            { userId: req.params.userId },
            performanceData,
            { new: true, runValidators: true }
        );
        if (!performance) {
            return res.status(404).json({ message: 'Performance data not found' });
        }
        res.json(performance);
    } catch (error) {
        logger.warn(`Error updating performance: ${error.message}`);
        res.status(400).json({ message: error.message });
    }
};

const deletePerformance = async (req, res) => {
    try {
        const performance = await UserPerformance.findOneAndDelete({ userId: req.params.userId });
        if (!performance) {
            return res.status(404).json({ message: 'Performance data not found' });
        }
        res.json({ message: 'Performance data deleted successfully' });
    } catch (error) {
        logger.warn(`Error deleting performance: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllUserPerformances,
    createPerformance,
    getPerformance,
    updatePerformance,
    deletePerformance,
    calculatePerformanceScore
};