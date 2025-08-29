// chatService.js
// This file handles the chat logic and API calls to our backend LLM service

import axios from "axios";

// Configure axios
axios.defaults.withCredentials = true;

/**
 * Process user messages and generate responses using the Groq LLM API
 *
 * @param {string} userMessage - The message from the user
 * @param {string} userId - Optional user identifier for persistent conversations
 * @returns {Promise} - Promise resolving to the bot's response
 */
export const processMessage = async (userMessage, userId = "anonymous") => {
  try {
    // Call our backend API that interfaces with the Groq LLM
    const response = await axios.post("/api/chatbot/message", {
      message: userMessage,
      userId: userId,
    });

    if (response.data && response.data.success) {
      return response.data.response;
    } else {
      throw new Error(response.data?.error || "Unknown error occurred");
    }
  } catch (error) {
    console.error("Error calling chatbot API:", error);

    // Fallback to basic responses if the API fails
    const lowerCaseMessage = userMessage.toLowerCase();

    if (lowerCaseMessage.includes("hello") || lowerCaseMessage.includes("hi")) {
      return "Hello there! How can I assist you with your travel plans today?";
    } else if (
      lowerCaseMessage.includes("book") ||
      lowerCaseMessage.includes("reservation")
    ) {
      return "To make a reservation, browse our available properties and click the 'Reserve' button on the property you like. You can select your dates and provide guest information there.";
    } else if (lowerCaseMessage.includes("cancel")) {
      return "To cancel a booking, please go to the Bookings section in your account and select the booking you wish to cancel. Follow the cancellation instructions there.";
    } else if (
      lowerCaseMessage.includes("payment") ||
      lowerCaseMessage.includes("pay")
    ) {
      return "We accept both cash on arrival and card payments. You can select your preferred payment method during the booking process.";
    } else if (
      lowerCaseMessage.includes("price") ||
      lowerCaseMessage.includes("cost")
    ) {
      return "Each property has its own pricing displayed on the listing. The total cost is calculated based on the number of nights and any additional fees.";
    } else if (
      lowerCaseMessage.includes("contact") ||
      lowerCaseMessage.includes("help")
    ) {
      return "For additional assistance, you can reach our customer service at support@nexstay.com or call us at +1-123-456-7890.";
    } else if (
      lowerCaseMessage.includes("check in") ||
      lowerCaseMessage.includes("check out")
    ) {
      return "Standard check-in time is 3:00 PM and check-out time is 11:00 AM. Some properties may have different times, which will be mentioned in their listings.";
    } else if (lowerCaseMessage.includes("thank")) {
      return "You're welcome! Is there anything else I can help you with?";
    } else if (
      lowerCaseMessage.includes("location") ||
      lowerCaseMessage.includes("where")
    ) {
      return "We have properties in many locations! You can use the search function to find accommodations in your preferred area.";
    } else if (
      lowerCaseMessage.includes("wifi") ||
      lowerCaseMessage.includes("internet")
    ) {
      return "Most of our properties offer complimentary WiFi. You can check the amenities section of each property listing for confirmation.";
    } else if (
      lowerCaseMessage.includes("pet") ||
      lowerCaseMessage.includes("dog") ||
      lowerCaseMessage.includes("cat")
    ) {
      return "Pet policies vary by property. Look for the 'Pet-friendly' tag in the property details or contact the host directly for specific pet policies.";
    } else if (
      lowerCaseMessage.includes("breakfast") ||
      lowerCaseMessage.includes("food")
    ) {
      return "Some properties offer breakfast or have kitchen facilities. Check the amenities section of the property listing for details about dining options.";
    } else if (
      lowerCaseMessage.includes("discount") ||
      lowerCaseMessage.includes("offer")
    ) {
      return "We frequently run special offers! Check our homepage for current promotions or sign up for our newsletter to be notified of upcoming deals.";
    } else {
      return "I'm not sure I understand. Could you please rephrase your question, or ask about bookings, payments, check-in/check-out, or contact information?";
    }
  }
};

/**
 * Save chat history to local storage
 *
 * @param {Array} messages - Array of message objects
 */
export const saveChatHistory = (messages) => {
  try {
    localStorage.setItem("nexstay_chat_history", JSON.stringify(messages));
  } catch (e) {
    console.error("Error saving chat history:", e);
  }
};

/**
 * Load chat history from local storage
 *
 * @returns {Array|null} - Array of message objects or null if not found
 */
export const loadChatHistory = () => {
  try {
    const history = localStorage.getItem("nexstay_chat_history");
    return history ? JSON.parse(history) : null;
  } catch (e) {
    console.error("Error loading chat history:", e);
    return null;
  }
};

/**
 * Clear chat history from local storage
 */
export const clearChatHistory = () => {
  try {
    localStorage.removeItem("nexstay_chat_history");
  } catch (e) {
    console.error("Error clearing chat history:", e);
  }
};
