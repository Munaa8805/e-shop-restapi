const asyncHandler = require('../utils/asyncHandler');
const Review = require('../models/Review');
const Product = require('../models/Product');

/**
 * Create a review for a product. When nested under /products/:productId/reviews, productId comes from params; else from body.
 */
const createReview = asyncHandler(async (req, res) => {
    const productId = req.params.productId || req.body.product;
    const { rating, comment } = req.body;
    if (!rating) {
        const err = new Error('Rating is required');
        err.statusCode = 400;
        throw err;
    }
    if (!productId) {
        const err = new Error('Product is required');
        err.statusCode = 400;
        throw err;
    }
    const productExists = await Product.findById(productId);
    if (!productExists) {
        const err = new Error('Product not found');
        err.statusCode = 404;
        throw err;
    }
    const review = await Review.create({ rating, comment, product: productId });
    await Product.calcAverageRating(productId);
    res.status(201).json({ success: true, data: review });
});

/**
 * Get reviews. When nested under /products/:productId/reviews, returns only reviews for that product.
 */
// const getReviewsByProduct = asyncHandler(async (req, res) => {
//     const productId = req.params.productId;
//     const filter = productId ? { product: productId } : {};
//     const reviews = await Review.find(filter);
//     res.status(200).json({ success: true, data: reviews });
// });

const getAllReviews = asyncHandler(async (req, res) => {

    const productId = req.params.productId;

    const filter = productId ? { product: productId } : {};

    const reviews = await Review.find(filter);
    if (!reviews) {
        const err = new Error('No reviews found');
        err.statusCode = 404;
        throw err;
    }
    res.status(200).json({ success: true, data: reviews });
});

/**
 * Get a single review by id. When nested, ensures the review belongs to the given product.
 */
const getReview = asyncHandler(async (req, res) => {
    const { productId, id } = req.params;
    const query = productId ? { _id: id, product: productId } : { _id: id };
    const review = await Review.findOne(query);
    if (!review) {
        const err = new Error('Review not found');
        err.statusCode = 404;
        throw err;
    }
    res.status(200).json({ success: true, data: review });
});

const updateReview = asyncHandler(async (req, res) => {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!review) {
        const err = new Error('Review not found');
        err.statusCode = 404;
        throw err;
    }
    await Product.calcAverageRating(review.product);
    res.status(200).json({ success: true, data: review });
});




const deleteReview = asyncHandler(async (req, res) => {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
        const err = new Error('Review not found');
        err.statusCode = 404;
        throw err;
    }
    await Product.calcAverageRating(review.product);
    res.status(200).json({ success: true, data: {} });
});


module.exports = { createReview, getAllReviews, getReview, deleteReview, updateReview };