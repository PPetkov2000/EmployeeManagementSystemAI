const express = require('express');
const router = express.Router();
const userPerformanceController = require('../controllers/seedController');

router.get('/overall-performance-data', userPerformanceController.getOverallPerformance);
router.post('/generate-sample-performance-data', userPerformanceController.generateSamplePerformanceData);
router.delete('/delete-all-performance-data', userPerformanceController.deleteAllPerformanceData);

module.exports = router;
