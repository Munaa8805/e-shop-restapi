const express = require('express');
const productController = require('../controllers/productController');
const { protect, restrictTo } = require('../middlewares/auth');
const reviewRoutes = require('./reviewRoutes');
const upload = require('../utils/multerConfig');

const router = express.Router();


router.use('/:productId/reviews', reviewRoutes);


router.put('/:id/upload-image', protect, restrictTo('admin'), upload.single('image'), productController.uploadProductImage);
router.put('/:id/images', protect, restrictTo('admin'), upload.array('images', 10), productController.uploadProductImages);

router.get('/', protect, restrictTo('admin'), productController.getProducts);
router.get('/:id', protect, restrictTo('admin'), productController.getProduct);
router.post('/', protect, restrictTo('admin'), productController.createProduct);
router.put('/:id', protect, restrictTo('admin'), productController.updateProduct);
router.delete('/:id', protect, restrictTo('admin'), productController.deleteProduct);
module.exports = router;
