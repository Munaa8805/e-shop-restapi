const express = require('express');
const cartController = require('../controllers/cartController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.get('/', protect, cartController.getCart);
router.post('/items', protect, cartController.addItem);
router.put('/items/:productId', protect, cartController.updateItem);
router.delete('/items/:productId', protect, cartController.removeItem);
router.delete('/', protect, cartController.clearCart);
module.exports = router;
