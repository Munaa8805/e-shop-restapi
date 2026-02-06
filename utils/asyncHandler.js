/**
 * Wraps async route handlers so rejected promises are passed to Express error middleware.
 * Use instead of try/catch in controllers: asyncHandler(async (req, res) => { ... }).
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
