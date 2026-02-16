/**
 * Centralized error-handling middleware.
 * Catches all errors passed to next(err), logs internally without exposing sensitive data,
 * and responds with consistent format: { success: false, message: "User-friendly error message" }.
 */
const logger = require('../config/logger.config');
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  logger.error(`Error: ${err.message}`);

  let statusCode = err.statusCode || 500;
  let message = 'Something went wrong. Please try again later.';

  if (err.statusCode && err.statusCode < 500) {
    message = err.message || 'Request could not be completed.';

    statusCode = err.statusCode;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    const first = Object.values(err.errors)[0];
    message = first ? first.message : 'Validation failed. Check your input.';
  } else if (err.code === 11000) {
    statusCode = 400;
    const field = err.keyValue ? Object.keys(err.keyValue)[0] : 'field';
    if (field === 'email') message = 'An account with this email already exists.';
    else message = `This ${field} is already in use. Please choose another.`;
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID or data format.';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid or missing token. Please sign in again.';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Your session has expired. Please sign in again.';
  } else if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    message = 'File size too large. Maximum size is 5MB.';
  } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    statusCode = 400;
    message = 'Unexpected file field. Please check your request.';
  } else if (err.message && err.message.includes('Invalid file type')) {
    statusCode = 400;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
