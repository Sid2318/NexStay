const express = require("express");
const router = express.Router();
const chatbotController = require("../controllers/chatbotController");

// Post a message to the chatbot
router.post("/message", chatbotController.chatbotMessage);

// Get chat history for a user
router.get("/history/:userId", chatbotController.getChatHistory);

// Clear chat history for a user
router.delete("/history/:userId", chatbotController.clearChatHistory);

module.exports = router;
