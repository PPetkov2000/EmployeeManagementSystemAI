const express = require('express');
const router = express.Router();
const userPerformanceController = require('../controllers/userPerformanceController');

router.get('/', userPerformanceController.getAllUserPerformances);
router.post('/', userPerformanceController.createPerformance);
router.get('/:userId', userPerformanceController.getPerformance);
router.put('/:userId', userPerformanceController.updatePerformance);
router.delete('/:userId', userPerformanceController.deletePerformance);

module.exports = router;