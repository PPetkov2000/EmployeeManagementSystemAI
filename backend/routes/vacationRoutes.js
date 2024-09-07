const express = require('express');
const { getVacationDays, getAllVacationRequests, getVacationRequestsByUserId, getVacationRequestDetails, createVacationRequest, updateVacationRequest } = require('../controllers/vacationController.js');
const { protect, authorize } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.use(protect); // All routes require authentication

router
  .route('/')
  .get(authorize('manager', 'admin'), getAllVacationRequests)
  .post(createVacationRequest);

router
  .route('/:id')
  .get(getVacationRequestDetails)
  .put(authorize('manager', 'admin'), updateVacationRequest);

router.get('/user/:id', getVacationRequestsByUserId);

module.exports = router;