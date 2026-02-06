const express = require('express');
const brandController = require('../controllers/brandController');
const { protect, restrictTo } = require('../middlewares/auth');

const router = express.Router();

router.get('/', brandController.getBrands);
router.get('/:id', brandController.getBrand);
router.post('/', protect, restrictTo('admin'), brandController.createBrand);
router.put('/:id', protect, restrictTo('admin'), brandController.updateBrand);
router.delete('/:id', protect, restrictTo('admin'), brandController.deleteBrand);
module.exports = router;
