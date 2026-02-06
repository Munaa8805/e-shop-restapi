const mongoose = require('mongoose');

/**
 * Brand schema for product brands.
 * Stores name (unique), optional description and image.
 */
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Brand name is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Brand', brandSchema);
