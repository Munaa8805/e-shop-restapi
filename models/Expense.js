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
        date: {
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
                "movie"
            ],
            default: "food",
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Expense", expenseSchema);
