const asyncHandler = require('../utils/asyncHandler');
const logger = require('../config/logger.config.js');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

const createConversation = asyncHandler(async (req, res) => {


    const sender_id = req.user.userId;
    const { receiver_id, isGroup } = req.body;
    if (isGroup == false) {
        const { name, picture, users, admin } = req.body;
    }


    const conversation = await Conversation.create({ name, picture, isGroup, users, admin });
    res.status(201).json({ success: true, data: conversation });
});

const getConversations = asyncHandler(async (req, res) => {
    const conversations = await Conversation.find();
    res.status(200).json({ success: true, data: conversations });
});

const getConversationById = asyncHandler(async (req, res) => {
    const conversation = await Conversation.findById(req.params.id);
    res.status(200).json({ success: true, data: conversation });
});

const updateConversation = asyncHandler(async (req, res) => {
    const conversation = await Conversation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: conversation });
});

const deleteConversation = asyncHandler(async (req, res) => {
    const conversation = await Conversation.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
});

module.exports = { createConversation, getConversations, getConversationById, updateConversation, deleteConversation };
