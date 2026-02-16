const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Conversations name is required'],
        trim: true,
    },
    picture: {
        type: String,
        required: true,
    },
    isGroup: {
        type: Boolean,
        default: false,
        required: [true, 'Conversations isGroup is required'],
    }, users: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        required: [true, 'Conversations users are required'],
    },
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }

}, { timestamps: true });

module.exports = mongoose.model('Conversation', conversationSchema);