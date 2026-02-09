const asyncHandler = require('../utils/asyncHandler');
const Order = require('../models/Order');
const Product = require('../models/Product');

const createOrder = asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, user, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    } else {


        const order = new Order({
            orderItems: orderItems,
            user: user,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });
        const createOrder = await order.save();
        if (!createOrder) {
            const err = new Error('Failed to create order');
            err.statusCode = 500;
            throw err;
        }
        res.status(201).json({ success: true, data: createOrder });
    }
});


/// Get logged in user's orders
/// GET /api/v1/orders/me

const getUserOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json({ success: true, data: orders });
});


/// Get order by id
/// GET /api/v1/orders/:id
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) {
        const err = new Error('Order not found');
        err.statusCode = 404;
        throw err;
    }
    res.status(200).json({ success: true, data: order });
});

/// Update order to paid
/// PUT /api/v1/orders/:id/pay
/// Body: paymentResult (id, status, update_time, email_address)
/// Protected route

const updateOrderToPaid = asyncHandler(async (req, res) => {
    const { id, status, update_time, email_address } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
        const err = new Error('Order not found');
        err.statusCode = 404;
        throw err;
    }
});


const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        const err = new Error('Order not found');
        err.statusCode = 404;
        throw err;
    }
    order.deliveredAt = Date.now();
    await order.save();
    res.status(200).json({ success: true, data: order });
});


/// Get order by id
/// GET /api/v1/orders/:id
const getOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        const err = new Error('Order not found');
        err.statusCode = 404;
        throw err;
    }
    res.status(200).json({ success: true, data: order });
});

const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find();
    res.status(200).json({ success: true, data: orders });
});

const deleteOrder = asyncHandler(async (req, res) => {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
        const err = new Error('Order not found');
        err.statusCode = 404;
        throw err;
    }
    res.status(200).json({ success: true, data: {} });
});

module.exports = { createOrder, getUserOrders, getOrderById, updateOrderToPaid, updateOrderToDelivered, getOrders, getOrder, deleteOrder };