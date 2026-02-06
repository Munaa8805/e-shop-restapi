const mongoose = require('mongoose');
require('./Review');

/**
 * Product schema for e-shop.
 * References Category, Brand, and Company; stores name, description, price, image, quantity.
 */
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be non-negative'],
    },
    image: {
      type: String,
      trim: true,
    },
    images: [
      String
    ],
    quantity: {
      type: Number,
      default: 0,
      min: [0, 'Quantity must be non-negative'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Created by is required'],
    },
    ratingAverage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      set: (v) => Math.round(v * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
});

productSchema.index({ category: 1, brand: 1, company: 1 });
productSchema.index({ ratingAverage: -1 });


/**
 * Recalculates and saves ratingAverage and ratingsQuantity from Review collection.
 * Call after creating, updating, or deleting a review for this product.
 */
productSchema.statics.calcAverageRating = async function (productId) {
  if (!productId) return;
  const id = mongoose.Types.ObjectId.isValid(productId)
    ? new mongoose.Types.ObjectId(productId)
    : productId;

  const Review = mongoose.model('Review');
  const result = await Review.aggregate([
    { $match: { product: id } },
    {
      $group: {
        _id: '$product',
        avg: { $avg: '$rating' },
        count: { $sum: 1 },
      },
    },
  ]);

  const avg = result.length ? result[0].avg : 0;
  const count = result.length ? result[0].count : 0;

  await this.findByIdAndUpdate(id, {
    ratingAverage: Math.round(avg * 10) / 10,
    ratingsQuantity: count,
  });
};

module.exports = mongoose.model('Product', productSchema);
