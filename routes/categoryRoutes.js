const express = require('express');
const categoryController = require('../controllers/categoryController');
const { protect, restrictTo } = require('../middlewares/auth');

const router = express.Router();

router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategory);
router.post('/', protect, restrictTo('admin'), categoryController.createCategory);
router.put('/:id', protect, restrictTo('admin'), categoryController.updateCategory);
router.delete('/:id', protect, restrictTo('admin'), categoryController.deleteCategory);
module.exports = router;