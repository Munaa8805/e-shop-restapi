const { validationResult } = require('express-validator');

/**
 * Reusable middleware: runs the express-validator validation chain attached to req.
 * On failure responds with { success: false, message: first error message }; otherwise calls next().
 */
const validateRequest = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((v) => v.run(req)));
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    const firstError = errors.array()[0];
    return res.status(400).json({
      success: false,
      message: firstError.msg || 'Validation failed',
    });
  };
};

module.exports = validateRequest;
