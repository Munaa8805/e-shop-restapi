const express = require('express');
const companyController = require('../controllers/companyController');
const productController = require('../controllers/productController');
const { protect, restrictTo } = require('../middlewares/auth');

const router = express.Router();

router.get('/', protect, restrictTo('admin'), companyController.getCompanies);
router.get('/:companyId/products', protect, productController.getProductsByCompany);
router.get('/:id', protect, restrictTo('admin'), companyController.getCompany);
router.post('/', protect, restrictTo('admin'), companyController.createCompany);
router.put('/:id', protect, restrictTo('admin'), companyController.updateCompany);
router.delete('/:id', protect, restrictTo('admin'), companyController.deleteCompany);


module.exports = router;
