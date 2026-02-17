const express = require('express');
const expensesController = require('../controllers/expensesController');
const router = express.Router();

router.route('/').post(expensesController.createExpense).get(expensesController.getExpenses);
router.route('/:id').delete(expensesController.deleteExpense);

module.exports = router;