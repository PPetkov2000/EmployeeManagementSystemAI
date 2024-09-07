const VacationRequest = require('../models/VacationRequest.js');
const User = require('../models/User.js');
const logger = require('../utils/logger');

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const getAllVacationRequests = asyncHandler(async (req, res) => {
  logger.info('Fetching all vacation requests');
  const vacationRequests = await VacationRequest.find({}).populate('employee');
  logger.info(`Retrieved ${vacationRequests.length} vacation requests`);
  res.json(vacationRequests);
});

const getVacationRequestsByUserId = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  logger.info(`Fetching vacation requests for user ${userId}`);

  const vacationRequests = await VacationRequest.find({ employee: userId })
    .sort({ createdAt: -1 })
    .populate('employee', 'name');

  if (!vacationRequests.length) {
    logger.info(`No vacation requests found for user ${userId}`);
    return res.status(404).json({ message: 'No vacation requests found for this user' });
  }

  logger.info(`Retrieved ${vacationRequests.length} vacation requests for user ${userId}`);
  res.json(vacationRequests);
})

const getVacationRequestDetails = asyncHandler(async (req, res) => {
  const vacationRequest = await VacationRequest.findById(req.params.id).populate('employee');

  if (!vacationRequest) {
    logger.warn(`Vacation request not found: ${req.params.id}`);
    res.status(404).json({ message: 'Vacation request not found' });
  }

  res.status(200).json(vacationRequest);
});

const createVacationRequest = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.body;
  const userId = req.user._id;

  logger.info(`Creating vacation request for user ${userId}`);

  const start = new Date(startDate);
  const end = new Date(endDate);
  const daysRequested = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

  const user = await User.findById(userId);
  if (!user) {
    logger.warn(`User not found: ${userId}`);
    return res.status(404).json({ message: 'User not found' });
  }

  if (user.vacationDays < daysRequested) {
    logger.warn(`Insufficient vacation days for user ${userId}. Requested: ${daysRequested}, Available: ${user.vacationDays}`);
    return res.status(400).json({ message: 'Insufficient vacation days' });
  }

  const vacationRequest = await VacationRequest.create({
    employee: userId,
    startDate,
    endDate,
    status: 'Pending'
  });

  logger.info(`Vacation request created: ${vacationRequest._id}`);
  res.status(201).json(vacationRequest);
});

const updateVacationRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  logger.info(`Updating vacation request ${id}`);
  const vacationRequest = await VacationRequest.findById(id);
  if (vacationRequest) {
    vacationRequest.status = req.body.status || vacationRequest.status;
    const updatedRequest = await vacationRequest.save();
    logger.info(`Vacation request ${id} updated to status: ${updatedRequest.status}`);
    res.json(updatedRequest);
  } else {
    logger.warn(`Vacation request not found: ${id}`);
    res.status(404).json({ message: 'Vacation request not found' });
  }
});

module.exports = {
    getAllVacationRequests,
    getVacationRequestsByUserId,
    getVacationRequestDetails,
    createVacationRequest,
    updateVacationRequest
};