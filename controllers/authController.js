const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const signToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const sendTokenResponse = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie('token', token, {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: process.env.NODE_ENV === 'production',
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    sameSite: 'strict',
  });

  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user },
  });
};

/**
 * Register a new user. Expects name, email, password (validated by middleware).
 * Hashes password, creates user, returns 201 with user payload (no password).
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    const err = new Error('User already exists');
    err.statusCode = 400;
    throw err;
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({ name, email, password: hashedPassword });
  const userPayload = { _id: user._id, name: user.name, email: user.email };
  sendTokenResponse(userPayload, 201, req, res);
});

/**
 * Login: find user by email, compare password, return JWT and optional user.
 * Expects email and password (validated by middleware).
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }
  const userPayload = { _id: user._id, name: user.name, email: user.email };
  sendTokenResponse(userPayload, 200, req, res);
});


const logout = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    expires: new Date(0),
    httpOnly: true,
  });
  res.status(200).json({ success: true, data: {} });
});


const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 401;
    throw err;
  }
  res.status(200).json({ success: true, data: user });
});

/**
 * Forgot password: accepts email, generates reset token and stores hashed token + expiry on user.
 * Returns success; in production the token would be sent by email (not returned in response).
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email }).select('+resetPasswordToken +resetPasswordExpire');
  if (!user) {
    const err = new Error('No user found with that email');
    err.statusCode = 404;
    throw err;
  }
  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: 'If an account exists, a reset link would be sent. Use the token for reset.',
    data: { resetToken }, // In production, send resetToken via email only; remove from response.
  });
});

/**
 * Reset password: accepts reset token and new password. Validates token and expiry, then updates password.
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  }).select('+password +resetPasswordToken +resetPasswordExpire');

  if (!user) {
    const err = new Error('Invalid or expired reset token');
    err.statusCode = 400;
    throw err;
  }

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  const userPayload = { _id: user._id, name: user.name, email: user.email };
  sendTokenResponse(userPayload, 200, req, res);
});

/**
 * Update current user info (name, email). Protected route; only allowed fields are updated.
 */
const updateMe = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  if (email) {
    const existing = await User.findOne({ email, _id: { $ne: req.user._id } });
    if (existing) {
      const err = new Error('Email already in use');
      err.statusCode = 400;
      throw err;
    }
  }
  const allowed = {};
  if (name !== undefined) allowed.name = name;
  if (email !== undefined) allowed.email = email;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: allowed },
    { new: true, runValidators: true }
  );

  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  res.status(200).json({ success: true, data: user });
});

module.exports = { register, login, logout, getMe, forgotPassword, resetPassword, updateMe };
