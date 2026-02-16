const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Message sender is required"],
        },
        message: {
            type: String,
            trim: true,
        },
        consersation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
            required: [true, "Message consersation is required"],
        },
        files: [],
    },
    { timestamps: true },
);

module.exports = mongoose.model("Message", messageSchema);
