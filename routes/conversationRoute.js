const express = require('express');
const conversationController = require('../controllers/conversationController');
const router = express.Router();

router.route('/').post(conversationController.createConversation).get(conversationController.getConversations);
router.route('/:id').get(conversationController.getConversationById).put(conversationController.updateConversation).delete(conversationController.deleteConversation);

module.exports = router;