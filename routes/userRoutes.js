const express = require('express');
const userController = require('../controllers/userController');
const { protect, restrictTo } = require('../middlewares/auth');

const router = express.Router();

router.get('/', protect, restrictTo('admin'), userController.getUsers);
router.get('/:id', protect, restrictTo('admin'), userController.getUser);
router.post('/', protect, restrictTo('admin'), userController.createUser);
router.put('/:id', protect, restrictTo('admin'), userController.updateUser);
router.delete('/:id', protect, restrictTo('admin'), userController.deleteUser);
module.exports = router;