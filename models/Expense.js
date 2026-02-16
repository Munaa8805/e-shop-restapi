const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
        },
        amount: {
            type: Number,
            required: [true, "Amount is required"],
        },
        data: {
            type: Date,
            required: [true, "Date is required"],
            default: Date.now,
        },
        category: {
            type: String,
            enum: [
                "food",
                "transport",
                "housing",
                "utilities",
                "entertainment",
                "other",
                "salary",
                "bonus",
                "other",
            ],
            default: "food",
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Expense", expenseSchema);
