const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');
const bcrypt = require('bcryptjs');



const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find();
    if (!users) {
        const err = new Error('No users found');
        err.statusCode = 404;
        throw err;
    }
    res.status(200).json({ success: true, data: users });
});


const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        const err = new Error('User not found');
        err.statusCode = 404;
        throw err;
    }
    res.status(200).json({ success: true, data: user });
});


const createUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
        const err = new Error('User already exists');
        err.statusCode = 400;
        throw err;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    user.password = undefined;
    res.status(201).json({ success: true, data: user });
});


const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) {
        const err = new Error('User not found');
        err.statusCode = 404;
        throw err;
    }
    user.password = undefined;
    res.status(200).json({ success: true, data: user });
});

const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
        const err = new Error('User not found');
        err.statusCode = 404;
        throw err;
    }
    res.status(200).json({ success: true, data: {} });
});


module.exports = { getUsers, getUser, createUser, updateUser, deleteUser };