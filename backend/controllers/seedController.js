const UserPerformance = require('../models/UserPerformance');
const User = require('../models/User');
const logger = require('../utils/logger');
const { calculatePerformanceScore } = require('./userPerformanceController');

const generateSamplePerformanceData = async () => {
    const users = await User.find();
    const samplePerformances = users.map(user => ({
        userId: user._id,
        taskCompletion: {
            completed: Math.floor(Math.random() * 50) + 30, // 30-80 tasks completed
            total: 100
        },
        qualityRating: Math.floor(Math.random() * 5) + 5, // 5-10 rating
        teamworkRating: Math.floor(Math.random() * 5) + 5, // 5-10 rating
        attendance: {
            daysPresent: Math.floor(Math.random() * 10) + 15, // 15-25 days present
            totalWorkDays: 25
        },
        initiativeRating: Math.floor(Math.random() * 5) + 5 // 5-10 rating
    }));

    for (let performance of samplePerformances) {
        performance.performanceScore = calculatePerformanceScore(performance);
        await UserPerformance.findOneAndUpdate(
            { userId: performance.userId },
            performance,
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
    }

    logger.info(`Sample performance data generated for ${users.length} users`);
};

const getOverallPerformance = async (req, res) => {
    try {
        const performances = await UserPerformance.find().populate('userId', 'firstName lastName');

        const sortedPerformances = performances.sort((a, b) => b.performanceScore - a.performanceScore);
        const topPerformers = sortedPerformances.slice(0, 5).map(p => ({
            firstName: p.userId.firstName,
            lastName: p.userId.lastName,
            performanceScore: p.performanceScore
        }));
        const lowPerformers = sortedPerformances.slice(-5).reverse().map(p => ({
            firstName: p.userId.firstName,
            lastName: p.userId.lastName,
            performanceScore: p.performanceScore
        }));

        const averagePerformance = performances.reduce((sum, p) => sum + p.performanceScore, 0) / performances.length;
        const highestPerformance = Math.max(...performances.map(p => p.performanceScore));
        const lowestPerformance = Math.min(...performances.map(p => p.performanceScore));

        res.json({
            topPerformers,
            lowPerformers,
            averagePerformance,
            highestPerformance,
            lowestPerformance
        });
    } catch (error) {
        logger.warn(`Error getting overall performance: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

const deleteAllPerformanceData = async (req, res) => {
    try {
        await UserPerformance.deleteMany({});
        logger.info('All user performance data has been deleted');
        res.status(200).json({ message: 'All user performance data has been successfully deleted' });
    } catch (error) {
        logger.error(`Error deleting all performance data: ${error.message}`);
        res.status(500).json({ message: 'Error deleting performance data', error: error.message });
    }
};

module.exports = {
    getOverallPerformance,
    generateSamplePerformanceData,
    deleteAllPerformanceData
};