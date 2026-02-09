const express = require('express');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.post('/', orderController.createOrder);
router.get('/me', orderController.getUserOrders);
router.get('/:id', orderController.getOrderById);
router.put('/:id/pay', orderController.updateOrderToPaid);
router.put('/:id/deliver', orderController.updateOrderToDelivered);
router.get('/', orderController.getOrders);
router.delete('/:id', orderController.deleteOrder);
module.exports = router;