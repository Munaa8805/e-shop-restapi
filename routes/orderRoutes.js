const express = require('express');
const orderController = require('../controllers/orderController');
const { protect } = require('../middlewares/auth');
const router = express.Router();

router.post('/', protect, orderController.createOrder);
router.get('/me', protect, orderController.getUserOrders);
router.get('/:id', protect, orderController.getOrderById);
router.put('/:id/pay', protect, orderController.updateOrderToPaid);
router.put('/:id/deliver', protect, orderController.updateOrderToDelivered);
router.get('/', protect, orderController.getOrders);
router.delete('/:id', protect, orderController.deleteOrder);
module.exports = router;