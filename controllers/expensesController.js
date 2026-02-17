const asyncHandler = require('../utils/asyncHandler');
const Expense = require('../models/Expense');

const createExpense = asyncHandler(async (req, res) => {
    const { title, amount, date, category } = req.body;
    if (!title || !amount || !date || !category) {
        const err = new Error('All fields are required, title, amount, date, category');
        err.statusCode = 400;
        throw err;
    }
    if (category !== 'food' && category !== 'transport' && category !== 'housing' && category !== 'utilities' && category !== 'entertainment' && category !== 'other' && category !== 'salary' && category !== 'bonus' && category !== 'movie') {
        const err = new Error('Invalid category');
        err.statusCode = 400;
        throw err;
    }
    const expense = await Expense.create({ title, amount, date, category });
    res.status(201).json({ success: true, data: expense });
});

const getExpenses = asyncHandler(async (req, res) => {
    const expenses = await Expense.find();
    res.status(200).json({ success: true, data: expenses });
});

const deleteExpense = asyncHandler(async (req, res) => {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
        const err = new Error('Expense not found');
        err.statusCode = 404;
        throw err;
    }
    res.status(200).json({ success: true, data: {} });
});

module.exports = { createExpense, getExpenses, deleteExpense };