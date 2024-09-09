const express = require('express');
const userController = require('../controllers/userController');
const upload = require('../middleware/uploadMiddleware');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', authorize('manager', 'admin'), userController.getAllUsers);
router.get('/:id', authorize('manager', 'admin'), userController.getUserById);
router.put('/:id', upload.single('avatar'), userController.updateUser);
router.delete('/:id', authorize('admin'), userController.deleteUser);
router.post('/', upload.single('avatar'), userController.createUser);
router.get('/:id/stats', authorize('admin', 'manager'), userController.getUserStats);
router.get('/:id/performance', authorize('admin', 'manager'), userController.getUserPerformance);

module.exports = router;