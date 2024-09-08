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
    employee.department = req.body.department || employee.department;
    employee.salary = req.body.salary || employee.salary;
    employee.performanceScore = req.body.performanceScore || employee.performanceScore;
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

module.exports = {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee
};