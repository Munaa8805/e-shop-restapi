const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const validateRequest = require('../middlewares/validateRequest');
const { protect, restrictTo } = require('../middlewares/auth');

const router = express.Router();

/**
 * Register: name (required, min 4), email (required, valid email), password (required, min 4).
 */
const registerValidations = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 4 })
    .withMessage('Name must be at least 4 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Valid email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 4 })
    .withMessage('Password must be at least 4 characters'),
];

/**
 * Login: email (required, valid email), password (required).
 */
const loginValidations = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const forgotPasswordValidations = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Valid email is required'),
];

const resetPasswordValidations = [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 4 })
    .withMessage('Password must be at least 4 characters'),
];

const updateMeValidations = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 4 })
    .withMessage('Name must be at least 4 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Valid email is required'),
];

router.post('/register', validateRequest(registerValidations), authController.register);
router.post('/login', validateRequest(loginValidations), authController.login);
router.get('/logout', authController.logout);
router.get('/me', protect, authController.getMe);
router.post('/forgot-password', validateRequest(forgotPasswordValidations), authController.forgotPassword);
router.post('/reset-password', validateRequest(resetPasswordValidations), authController.resetPassword);
router.patch('/update-me', protect, validateRequest(updateMeValidations), authController.updateMe);
// Example: admin-only route → router.get('/admin', protect, restrictTo('admin'), authController.someAction);
module.exports = router;
