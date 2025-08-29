const { PythonShell } = require("python-shell");
const path = require("path");
const fs = require("fs");

// Path to Python script
const scriptPath = path.join(__dirname, "..", "utils", "chatbot", "chatbot.py");
const dotenvPath = path.join(__dirname, "..", ".env");

// Check if the Python script exists
if (!fs.existsSync(scriptPath)) {
  console.error(`Error: Python script not found at ${scriptPath}`);
}

// Check if API key is set
const checkApiKey = () => {
  if (fs.existsSync(dotenvPath)) {
    try {
      const envContent = fs.readFileSync(dotenvPath, "utf8");
      return (
        envContent.includes("GROQ_API_KEY=") &&
        envContent.split("GROQ_API_KEY=")[1].split("\n")[0].trim().length > 0
      );
    } catch (err) {
      console.error("Error reading .env file:", err);
      return false;
    }
  }
  return false;
};

// Simple in-memory message store (for demonstration)
// In production, use a database
const messageStore = {};

// Chatbot API controller
exports.chatbotMessage = async (req, res) => {
  try {
    const { message, userId = "anonymous" } = req.body;

    // Validate input
    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        error: "Invalid message format. Please provide a text message.",
      });
    }

    // Check if API key is set
    if (!checkApiKey()) {
      return res.status(500).json({
        success: false,
        error:
          "GROQ_API_KEY not configured. Please add your API key to the .env file.",
      });
    }

    // Initialize message history for this user if it doesn't exist
    if (!messageStore[userId]) {
      messageStore[userId] = [];
    }

    // Store user message
    messageStore[userId].push({ role: "user", content: message });

    // Options for PythonShell
    const options = {
      mode: "text",
      pythonPath: "python", // Use 'python3' if necessary
      pythonOptions: ["-u"], // Unbuffered stdout and stderr
    };

    console.log(`Processing chatbot request from user: ${userId}`);

    // Run Python script with user message as input
    PythonShell.runString(
      `
import sys
sys.path.append('${path.dirname(scriptPath)}')
from chatbot import *
      `,
      options,
      (err, output) => {
        if (err) {
          console.error("Error running Python script:", err);
          return res.status(500).json({
            success: false,
            error: "Error processing your message",
          });
        }

        try {
          // Parse the last output line as JSON
          const lastOutput = output[output.length - 1];
          const result = JSON.parse(lastOutput);

          if (result.error) {
            return res.status(500).json({
              success: false,
              error: result.error,
            });
          }

          // Store AI response
          messageStore[userId].push({
            role: "assistant",
            content: result.response,
          });

          // Return success response
          return res.json({
            success: true,
            response: result.response,
            userId,
          });
        } catch (parseError) {
          console.error("Error parsing Python output:", parseError, output);
          return res.status(500).json({
            success: false,
            error: "Error processing chatbot response",
          });
        }
      }
    ).send(message);
  } catch (error) {
    console.error("Chatbot controller error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// Get chat history for a user
exports.getChatHistory = (req, res) => {
  const { userId = "anonymous" } = req.params;

  if (!messageStore[userId]) {
    return res.json({ messages: [] });
  }

  return res.json({ messages: messageStore[userId] });
};

// Clear chat history for a user
exports.clearChatHistory = (req, res) => {
  const { userId = "anonymous" } = req.params;

  if (messageStore[userId]) {
    messageStore[userId] = [];
  }

  return res.json({ success: true, message: "Chat history cleared" });
};
