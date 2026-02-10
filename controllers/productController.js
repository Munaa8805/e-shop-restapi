const asyncHandler = require('../utils/asyncHandler');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const Company = require('../models/Company');
const Review = require('../models/Review');
const fs = require('fs');
const path = require('path');
const { resizeProductImage } = require('../utils/imageResize');

/** Public directory absolute path for resolving image paths. */
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

/**
 * Returns the URL path for an image file (relative to public folder).
 * Handles multer file object (path or destination+filename).
 * @param {Object} file - Multer file object
 * @returns {string} - Path like /images/products/product-xxx.jpg
 */
function getRelativeImagePath(file) {
    const fullPath = file.path || (file.destination && file.filename ? path.join(file.destination, file.filename) : null);
    if (!fullPath) return null;
    const normalizedFull = path.normalize(fullPath);
    const normalizedPublic = path.normalize(PUBLIC_DIR);
    const relative = path.relative(normalizedPublic, normalizedFull);
    return '/' + relative.replace(/\\/g, '/');
}

/**
 * List products by company. Uses req.params.companyId. Returns 404 if company not found.
 */
const getProductsByCompany = asyncHandler(async (req, res) => {
    const { companyId } = req.params;
    const companyExists = await Company.findById(companyId);
    if (!companyExists) {
        const err = new Error('Company not found');
        err.statusCode = 404;
        throw err;
    }
    const products = await Product.find({ company: companyId })
        .populate('category', 'name')
        .populate('brand', 'name')
        .populate('company', 'name');
    res.status(200).json({ success: true, data: products });
});

/**
 * List all products. Populates category, brand, and company.
 */
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find()
        .populate('category', 'name')
        .populate('brand', 'name')
        .populate('company', 'name')
        .populate('createdBy', 'name');
    res.status(200).json({ success: true, data: products });
});

/**
 * Get a single product by id.
 */
const getProduct = asyncHandler(async (req, res) => {

    const product = await Product.findById(req.params.id)
        .populate('category', 'name description')
        .populate('brand', 'name')
        .populate('company', 'name description');
    if (!product) {
        const err = new Error('Product not found');
        err.statusCode = 404;
        throw err;
    }
    res.status(200).json({ success: true, data: product });
});

const getProductWithReviews = asyncHandler(async (req, res) => {

    const product = await Product.findById(req.params.id)
        .populate('reviews', 'rating comment');
    res.status(200).json({ success: true, data: product });
});

/**
 * Create a new product. Expects name, price, category; description, image, quantity, brand, company optional.
 */
const createProduct = asyncHandler(async (req, res) => {
    const { name, description, price, image, quantity, category, brand, company, createdBy } = req.body;
    if (!name) {
        const err = new Error('Product name is required');
        err.statusCode = 400;
        throw err;
    }
    if (price === undefined || price === null) {
        const err = new Error('Price is required');
        err.statusCode = 400;
        throw err;
    }
    if (!category) {
        const err = new Error('Category is required');
        err.statusCode = 400;
        throw err;
    }
    if (!createdBy) {
        const err = new Error('Created by is required');
        err.statusCode = 400;
        throw err;
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
        const err = new Error('Category not found');
        err.statusCode = 400;
        throw err;
    }
    if (brand) {
        const brandExists = await Brand.findById(brand);
        if (!brandExists) {
            const err = new Error('Brand not found');
            err.statusCode = 400;
            throw err;
        }
    }
    if (company) {
        const companyExists = await Company.findById(company);
        if (!companyExists) {
            const err = new Error('Company not found');
            err.statusCode = 400;
            throw err;
        }
    }

    const product = await Product.create({
        name,
        description,
        price,
        image,
        quantity,
        category,
        brand,
        company,
        createdBy,
    });
    const populated = await Product.findById(product._id)
        .populate('category', 'name')
        .populate('brand', 'name')
        .populate('company', 'name')
        .populate('createdBy', 'name');
    res.status(201).json({ success: true, data: populated });
});

/**
 * Update a product by id.
 */
const updateProduct = asyncHandler(async (req, res) => {
    const { category, brand, company } = req.body;
    if (category) {
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            const err = new Error('Category not found');
            err.statusCode = 400;
            throw err;
        }
    }
    if (brand) {
        const brandExists = await Brand.findById(brand);
        if (!brandExists) {
            const err = new Error('Brand not found');
            err.statusCode = 400;
            throw err;
        }
    }
    if (company) {
        const companyExists = await Company.findById(company);
        if (!companyExists) {
            const err = new Error('Company not found');
            err.statusCode = 400;
            throw err;
        }
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    })
        .populate('category', 'name')
        .populate('brand', 'name')
        .populate('company', 'name');
    if (!product) {
        const err = new Error('Product not found');
        err.statusCode = 404;
        throw err;
    }
    res.status(200).json({ success: true, data: product });
});

/**
 * Delete a product by id.
 */
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
        const err = new Error('Product not found');
        err.statusCode = 404;
        throw err;
    }
    res.status(200).json({ success: true, data: {} });
});


/**
 * Upload product image. Accepts single image file via multer.
 * Validates file exists, resizes image for optimal web display, deletes old image if present, saves new image path.
 * Returns updated product with populated fields.
 */
const uploadProductImage = asyncHandler(async (req, res) => {
    if (!req.file) {
        const err = new Error('No image file provided');
        err.statusCode = 400;
        throw err;
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
        const p = req.file.path || (req.file.destination && req.file.filename ? path.join(req.file.destination, req.file.filename) : null);
        if (p && fs.existsSync(p)) fs.unlinkSync(p);
        const err = new Error('Product not found');
        err.statusCode = 404;
        throw err;
    }

    const filePath = req.file.path || (req.file.destination && req.file.filename ? path.join(req.file.destination, req.file.filename) : null);
    if (!filePath || !fs.existsSync(filePath)) {
        const err = new Error('Uploaded file not found');
        err.statusCode = 500;
        throw err;
    }
    // Resize image for optimal web display (max 1200x1200, quality 85)
    try {
        await resizeProductImage(filePath);
    } catch (error) {
        const p = req.file.path || (req.file.destination && req.file.filename ? path.join(req.file.destination, req.file.filename) : null);
        if (p && fs.existsSync(p)) fs.unlinkSync(p);
        const err = new Error('Failed to process image: ' + error.message);
        err.statusCode = 500;
        throw err;
    }

    // Delete old image if exists
    if (product.image) {
        const oldImagePath = path.join(PUBLIC_DIR, product.image.replace(/^\//, ''));
        if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
        }
    }

    // Save relative path from public directory
    const imagePath = getRelativeImagePath(req.file);
    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        { image: imagePath },
        { new: true, runValidators: true }
    )
        .populate('category', 'name')
        .populate('brand', 'name')
        .populate('company', 'name')
        .populate('createdBy', 'name');

    res.status(200).json({ success: true, data: updatedProduct });
});


/**
 * Upload multiple product images. Accepts array of image files via multer.
 * Validates files exist, resizes all images for optimal web display, optionally replaces old images or appends to existing.
 * Returns updated product with populated fields.
 */
const uploadProductImages = asyncHandler(async (req, res) => {
    // Multer array() sets req.files to an array; ensure we have one
    const files = Array.isArray(req.files) ? req.files : (req.files ? Object.values(req.files).flat() : []);
    if (files.length === 0) {
        const err = new Error('No image files provided. Use form field name "images" and send one or more image files.');
        err.statusCode = 400;
        throw err;
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
        files.forEach((file) => {
            const p = file.path || (file.destination && file.filename ? path.join(file.destination, file.filename) : null);
            if (p && fs.existsSync(p)) fs.unlinkSync(p);
        });
        const err = new Error('Product not found');
        err.statusCode = 404;
        throw err;
    }

    const uploadedPaths = [];
    const filesToDelete = [];

    for (const file of files) {
        const filePath = file.path || (file.destination && file.filename ? path.join(file.destination, file.filename) : null);
        if (!filePath || !fs.existsSync(filePath)) continue;

        try {
            await resizeProductImage(filePath);
            const imagePath = getRelativeImagePath(file);
            if (imagePath) uploadedPaths.push(imagePath);
        } catch (error) {
            filesToDelete.push(filePath);
        }
    }

    filesToDelete.forEach((filePath) => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    if (uploadedPaths.length === 0) {
        const err = new Error('Failed to process all images. Please try again.');
        err.statusCode = 500;
        throw err;
    }

    const replaceImages = req.query.replace === 'true';
    let updatedImages;
    if (replaceImages) {
        if (product.images && product.images.length > 0) {
            product.images.forEach((oldRel) => {
                const oldFull = path.join(PUBLIC_DIR, oldRel.replace(/^\//, ''));
                if (fs.existsSync(oldFull)) fs.unlinkSync(oldFull);
            });
        }
        updatedImages = uploadedPaths;
    } else {
        const existingImages = product.images || [];
        updatedImages = [...existingImages, ...uploadedPaths];
    }
    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        { images: updatedImages },
        { new: true, runValidators: true }
    )
        .populate('category', 'name')
        .populate('brand', 'name')
        .populate('company', 'name')
        .populate('createdBy', 'name');

    if (!updatedProduct) {
        uploadedPaths.forEach((rel) => {
            const fullPath = path.join(PUBLIC_DIR, rel.replace(/^\//, ''));
            if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
        });
        const err = new Error('Failed to update product');
        err.statusCode = 500;
        throw err;
    }

    res.status(200).json({
        success: true,
        data: updatedProduct,
        message: `Successfully uploaded ${uploadedPaths.length} image(s)`,
    });
});

module.exports = {
    getProducts,
    getProductsByCompany,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductWithReviews,
    uploadProductImage,
    uploadProductImages,
};
