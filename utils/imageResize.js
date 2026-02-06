const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

/**
 * Resizes an image file to specified dimensions while maintaining aspect ratio.
 * If image is smaller than max dimensions, it won't be upscaled.
 * 
 * @param {string} inputPath - Path to the input image file
 * @param {string} outputPath - Path where resized image will be saved
 * @param {Object} options - Resize options
 * @param {number} options.maxWidth - Maximum width in pixels (default: 1200)
 * @param {number} options.maxHeight - Maximum height in pixels (default: 1200)
 * @param {number} options.quality - JPEG quality 1-100 (default: 85)
 * @returns {Promise<string>} - Path to the resized image
 */
const resizeImage = async (inputPath, outputPath, options = {}) => {
    const { maxWidth = 1200, maxHeight = 1200, quality = 85 } = options;

    try {
        // Get image metadata to check dimensions and format
        const metadata = await sharp(inputPath).metadata();
        const { width, height, format } = metadata;

        // Calculate new dimensions maintaining aspect ratio
        let newWidth = width;
        let newHeight = height;

        if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            newWidth = Math.round(width * ratio);
            newHeight = Math.round(height * ratio);
        }

        // Create sharp instance with resize
        let sharpInstance = sharp(inputPath).resize(newWidth, newHeight, {
            fit: 'inside',
            withoutEnlargement: true,
        });

        // Apply format-specific optimizations
        if (format === 'jpeg' || format === 'jpg') {
            sharpInstance = sharpInstance.jpeg({ quality: quality, mozjpeg: true });
        } else if (format === 'png') {
            sharpInstance = sharpInstance.png({ quality: quality, compressionLevel: 9 });
        } else if (format === 'webp') {
            sharpInstance = sharpInstance.webp({ quality: quality });
        } else if (format === 'gif') {
            // GIFs are converted to PNG for better compression
            sharpInstance = sharpInstance.png({ quality: quality });
        } else {
            // Default to JPEG for unknown formats
            sharpInstance = sharpInstance.jpeg({ quality: quality });
        }

        // Save resized image
        await sharpInstance.toFile(outputPath);

        return outputPath;
    } catch (error) {
        throw new Error(`Failed to resize image: ${error.message}`);
    }
};

/**
 * Resizes product image and replaces original file.
 * Optimizes image for web display with max dimensions 1200x1200.
 * 
 * @param {string} filePath - Path to the uploaded image file
 * @returns {Promise<string>} - Path to the resized image (same as input)
 */
const resizeProductImage = async (filePath) => {
    const tempPath = filePath + '.temp';
    
    try {
        // Resize to temporary file
        await resizeImage(filePath, tempPath, {
            maxWidth: 1200,
            maxHeight: 1200,
            quality: 85,
        });

        // Replace original with resized version
        fs.unlinkSync(filePath);
        fs.renameSync(tempPath, filePath);

        return filePath;
    } catch (error) {
        // Clean up temp file if exists
        if (fs.existsSync(tempPath)) {
            fs.unlinkSync(tempPath);
        }
        throw error;
    }
};

module.exports = {
    resizeImage,
    resizeProductImage,
};
