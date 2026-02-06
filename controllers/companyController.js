const asyncHandler = require('../utils/asyncHandler');
const Company = require('../models/Company');

/**
 * List all companies.
 */
const getCompanies = asyncHandler(async (req, res) => {
    const companies = await Company.find().populate('products', 'name price image');
    res.status(200).json({ success: true, data: companies });
});

/**
 * Get a single company by id.
 */
const getCompany = asyncHandler(async (req, res) => {
    const company = await Company.findById(req.params.id);
    if (!company) {
        const err = new Error('Company not found');
        err.statusCode = 404;
        throw err;
    }
    res.status(200).json({ success: true, data: company });
});

/**
 * Create a new company. Expects name; description and image optional.
 */
const createCompany = asyncHandler(async (req, res) => {
    const { name, description, image } = req.body;
    if (!name) {
        const err = new Error('Company name is required');
        err.statusCode = 400;
        throw err;
    }

    const companyExists = await Company.findOne({ name });
    if (companyExists) {
        const err = new Error('Company already exists');
        err.statusCode = 400;
        throw err;
    }
    const company = await Company.create({ name, description, image });
    res.status(201).json({ success: true, data: company });
});

/**
 * Update a company by id.
 */
const updateCompany = asyncHandler(async (req, res) => {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!company) {
        const err = new Error('Company not found');
        err.statusCode = 404;
        throw err;
    }
    res.status(200).json({ success: true, data: company });
});

/**
 * Delete a company by id.
 */
const deleteCompany = asyncHandler(async (req, res) => {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) {
        const err = new Error('Company not found');
        err.statusCode = 404;
        throw err;
    }
    res.status(200).json({ success: true, data: {} });
});

module.exports = {
    getCompanies,
    getCompany,
    createCompany,
    updateCompany,
    deleteCompany,
};
