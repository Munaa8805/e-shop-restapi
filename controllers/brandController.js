const asyncHandler = require('../utils/asyncHandler');
const Brand = require('../models/Brand');

/**
 * List all brands.
 */
const getBrands = asyncHandler(async (req, res) => {
    const brands = await Brand.find();
    res.status(200).json({ success: true, data: brands });
});

/**
 * Get a single brand by id.
 */
const getBrand = asyncHandler(async (req, res) => {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
        const err = new Error('Brand not found');
        err.statusCode = 404;
        throw err;
    }
    res.status(200).json({ success: true, data: brand });
});

/**
 * Create a new brand. Expects name; description and image optional.
 */
const createBrand = asyncHandler(async (req, res) => {
    const { name, description, image } = req.body;
    if (!name) {
        const err = new Error('Brand name is required');
        err.statusCode = 400;
        throw err;
    }

    const brandExists = await Brand.findOne({ name });
    if (brandExists) {
        const err = new Error('Brand already exists');
        err.statusCode = 400;
        throw err;
    }
    const brand = await Brand.create({ name, description, image });
    res.status(201).json({ success: true, data: brand });
});

/**
 * Update a brand by id.
 */
const updateBrand = asyncHandler(async (req, res) => {
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!brand) {
        const err = new Error('Brand not found');
        err.statusCode = 404;
        throw err;
    }
    res.status(200).json({ success: true, data: brand });
});

/**
 * Delete a brand by id.
 */
const deleteBrand = asyncHandler(async (req, res) => {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) {
        const err = new Error('Brand not found');
        err.statusCode = 404;
        throw err;
    }
    res.status(200).json({ success: true, data: {} });
});

module.exports = {
    getBrands,
    getBrand,
    createBrand,
    updateBrand,
    deleteBrand,
};
