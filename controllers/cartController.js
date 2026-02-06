const asyncHandler = require('../utils/asyncHandler');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

/**
 * Get or create current user's cart. Returns cart with items populated (product details).
 */
const getCart = asyncHandler(async (req, res) => {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
        path: 'items.product',
        select: 'name price image quantity',
    });
    if (!cart) {
        cart = await Cart.create({ user: req.user._id, items: [] });
    }
    res.status(200).json({ success: true, data: cart });
});

/**
 * Add item to cart. Body: product (productId), quantity (default 1).
 * Merges with existing line if product already in cart.
 */
const addItem = asyncHandler(async (req, res) => {
    const { product: productId, quantity = 1 } = req.body;
    if (!productId) {
        const err = new Error('Product is required');
        err.statusCode = 400;
        throw err;
    }
    if (quantity < 1) {
        const err = new Error('Quantity must be at least 1');
        err.statusCode = 400;
        throw err;
    }

    const product = await Product.findById(productId);
    if (!product) {
        const err = new Error('Product not found');
        err.statusCode = 404;
        throw err;
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const existing = cart.items.find((i) => i.product.toString() === productId);
    const newQty = existing ? existing.quantity + quantity : quantity;
    if (product.quantity !== undefined && newQty > product.quantity) {
        const err = new Error(`Not enough stock. Available: ${product.quantity}`);
        err.statusCode = 400;
        throw err;
    }

    if (existing) {
        existing.quantity = newQty;
    } else {
        cart.items.push({ product: productId, quantity });
    }
    await cart.save();

    const updated = await Cart.findById(cart._id).populate({
        path: 'items.product',
        select: 'name price image quantity',
    });
    res.status(200).json({ success: true, data: updated });
});

/**
 * Update item quantity. Params: productId. Body: quantity. Removes item if quantity is 0.
 */
const updateItem = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;
    if (quantity !== undefined && quantity < 0) {
        const err = new Error('Quantity must be 0 or greater');
        err.statusCode = 400;
        throw err;
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        const err = new Error('Cart not found');
        err.statusCode = 404;
        throw err;
    }

    const product = await Product.findById(productId);
    if (!product) {
        const err = new Error('Product not found');
        err.statusCode = 404;
        throw err;
    }

    if (quantity === 0) {
        cart.items = cart.items.filter((i) => i.product.toString() !== productId);
    } else {
        const line = cart.items.find((i) => i.product.toString() === productId);
        if (!line) {
            const err = new Error('Product not in cart');
            err.statusCode = 400;
            throw err;
        }
        if (quantity > product.quantity) {
            const err = new Error(`Not enough stock. Available: ${product.quantity}`);
            err.statusCode = 400;
            throw err;
        }
        line.quantity = quantity;
    }
    await cart.save();

    const updated = await Cart.findById(cart._id).populate({
        path: 'items.product',
        select: 'name price image quantity',
    });
    res.status(200).json({ success: true, data: updated });
});

/**
 * Remove one product from cart.
 */
const removeItem = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        const err = new Error('Cart not found');
        err.statusCode = 404;
        throw err;
    }

    cart.items = cart.items.filter((i) => i.product.toString() !== productId);
    await cart.save();

    const updated = await Cart.findById(cart._id).populate({
        path: 'items.product',
        select: 'name price image quantity',
    });
    res.status(200).json({ success: true, data: updated });
});

/**
 * Clear all items from cart.
 */
const clearCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOneAndUpdate(
        { user: req.user._id },
        { items: [] },
        { new: true }
    );
    if (!cart) {
        const cartNew = await Cart.create({ user: req.user._id, items: [] });
        return res.status(200).json({ success: true, data: cartNew });
    }
    res.status(200).json({ success: true, data: cart });
});

module.exports = {
    getCart,
    addItem,
    updateItem,
    removeItem,
    clearCart,
};
