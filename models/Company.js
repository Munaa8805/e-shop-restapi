const mongoose = require('mongoose');

/**
 * Company schema.
 * Stores name (unique), optional description and image.
 */
const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
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
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

companySchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'company',
});

module.exports = mongoose.model('Company', companySchema);
