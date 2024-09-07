const Employee = require('../models/Employee.js');
const logger = require('../utils/logger');

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const getEmployees = asyncHandler(async (req, res) => {
  const employees = await Employee.find({});
  logger.info('Retrieved all employees', { userId: req.user._id });
  res.status(200).json(employees);
});

const getEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (employee) {
    logger.info(`Retrieved employee ${req.params.id}`, { userId: req.user._id });
    res.status(200).json(employee);
  } else {
    logger.warn(`Employee not found ${req.params.id}`, { userId: req.user._id });
    res.status(404).json({ message: 'Employee not found' });
  }
});

const createEmployee = asyncHandler(async (req, res) => {
  const { name, email, position, department, salary, performanceScore } = req.body;
  const employee = await Employee.create({ name, email, position, department, salary, performanceScore });
  logger.info(`Created new employee ${employee._id}`, { userId: req.user._id });
  res.status(201).json(employee);
});

const updateEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (employee) {
    employee.name = req.body.name || employee.name;
    employee.email = req.body.email || employee.email;
    employee.position = req.body.position || employee.position;
    employee.vacationDays = req.body.vacationDays || employee.vacationDays;
    const updatedEmployee = await employee.save();
    logger.info(`Updated employee ${req.params.id}`, { userId: req.user._id });
    res.status(200).json(updatedEmployee);
  } else {
    logger.warn(`Employee not found for update ${req.params.id}`, { userId: req.user._id });
    res.status(404).json({ message: 'Employee not found' });
  }
});

const deleteEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (employee) {
    await employee.remove();
    logger.info(`Deleted employee ${req.params.id}`, { userId: req.user._id });
    res.status(200).json({ message: 'Employee removed' });
  } else {
    logger.warn(`Employee not found for deletion ${req.params.id}`, { userId: req.user._id });
    res.status(404).json({ message: 'Employee not found' });
  }
});

const getEmployeeStats = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const departmentCounts = await Employee.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } }
    ]);
    const averageSalary = await Employee.aggregate([
      { $group: { _id: null, avg: { $avg: "$salary" } } }
    ]);

    res.status(200).json({
      totalEmployees,
      departmentCounts,
      averageSalary: averageSalary[0]?.avg || 0
    });
  } catch (error) {
    logger.error('Error fetching employee stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const getEmployeePerformance = async (req, res) => {
  try {
    const performanceData = await Employee.aggregate([
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

    res.status(200).json(performanceData[0] || { averagePerformance: 0, topPerformers: [], lowPerformers: [] });
  } catch (error) {
    logger.error('Error fetching employee performance:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeStats,
  getEmployeePerformance
};