const asyncHandler = require('../utils/asyncHandler');
const Banner = require('../models/Banner');
const fs = require('fs');
const path = require('path');









const getBanners = asyncHandler(async (req, res) => {
    const banners = await Banner.find()
    if (!banners) {
        const err = new Error('No banners found');
        err.statusCode = 404;
        throw err;
    }
    res.status(200).json({ success: true, data: banners });
});

const getBanner = asyncHandler(async (req, res) => {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
        const err = new Error('Banner not found');
        err.statusCode = 404;
        throw err;
    }
    res.status(200).json({ success: true, data: banner });
});

const createBanner = asyncHandler(async (req, res) => {

    if (!req.file.filename) {
        const err = new Error('Uploaded file not found');
        err.statusCode = 500;
        throw err;
    }
    const banner = await Banner.create({
        imageUrl: req.file.filename,
        title: req.body.title,
        targetUrl: req.file.filename,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        isActive: req.body.isActive,
    })

    res.status(201).json({ success: true, data: banner });
});

const updateBanner = asyncHandler(async (req, res) => {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!banner) {
        const err = new Error('Banner not found');
        err.statusCode = 404;
        throw err;
    }
    res.status(200).json({ success: true, data: banner });
});

const deleteBanner = asyncHandler(async (req, res) => {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) {
        const err = new Error('Banner not found');
        err.statusCode = 404;
        throw err;
    }
    res.status(200).json({ success: true, data: {} });
});

module.exports = { getBanners, getBanner, createBanner, updateBanner, deleteBanner };