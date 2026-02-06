const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');

/**
 * Protects routes by verifying JWT from cookie (token) or Authorization header.
 * Attaches req.user (full user doc with _id); on missing/invalid token responds 401.
 */
const protect = asyncHandler(async (req, res, next) => {
    const token =
        req.cookies?.token ||
        (req.headers.authorization && req.headers.authorization.startsWith('Bearer')
            ? req.headers.authorization.split(' ')[1]
            : null);

    if (!token) {
        const err = new Error('Not authorized to access this route');
        err.statusCode = 401;
        throw err;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id).select('-password');
    if (!user) {
        const err = new Error('User not found');
        err.statusCode = 401;
        throw err;
    }
    req.user = user;
    next();
});

/**
 * Restricts access to given roles. Must be used after protect (req.user must be set).
 * Responds with 403 if req.user.role is not in the allowed roles list.
 */
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            const err = new Error('You do not have permission to perform this action');
            err.statusCode = 403;
            return next(err);
        }
        next();
    };
};

module.exports = { protect, restrictTo };
