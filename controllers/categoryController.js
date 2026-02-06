const asyncHandler = require('../utils/asyncHandler');
const Category = require('../models/Category');

const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find();
    res.status(200).json({ success: true, data: categories });
});


const getCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        const err = new Error('Category not found');
        err.statusCode = 404;
        throw err;
    }
    res.status(200).json({ success: true, data: category });
});

const createCategory = asyncHandler(async (req, res) => {
    const { name, description, image } = req.body;
    if (!name) {
        const err = new Error('Category name is required');
        err.statusCode = 400;
        throw err;
    }

    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
        const err = new Error('Category already exists');
        err.statusCode = 400;
        throw err;
    }
    const category = await Category.create({ name, description, image });
    res.status(201).json({ success: true, data: category });
});

const updateCategory = asyncHandler(async (req, res) => {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!category) {
        const err = new Error('Category not found');
        err.statusCode = 404;
        throw err;
    }
    res.status(200).json({ success: true, data: category });
});

const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
        const err = new Error('Category not found');
        err.statusCode = 404;
        throw err;
    }
    res.status(200).json({ success: true, data: {} });
});

module.exports = { getCategories, getCategory, createCategory, updateCategory, deleteCategory };