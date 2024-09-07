const express = require('express');
const { getEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee, getEmployeeStats, getEmployeePerformance } = require('../controllers/employeeController.js');
const { protect, authorize } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(authorize('admin', 'manager'), getEmployees)
  .post(authorize('admin'), createEmployee);

router
  .route('/:id')
  .get(authorize('admin', 'manager'), getEmployee)
  .put(authorize('admin'), updateEmployee)
  .delete(authorize('admin'), deleteEmployee);

router.get('/stats', authorize('admin', 'manager'), getEmployeeStats);

router.get('/performance', authorize('admin', 'manager'), getEmployeePerformance);

module.exports = router;