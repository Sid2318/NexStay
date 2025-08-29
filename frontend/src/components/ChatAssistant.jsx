import React, { useState, useEffect, useRef } from "react";
import "../styles/ChatAssistant.css";
import {
  processMessage,
  saveChatHistory,
  loadChatHistory,
  clearChatHistory,
} from "../services/chatService";
import axios from "axios";

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hello! Welcome to NexStay. How can I help you today?",
      sender: "bot",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userId, setUserId] = useState(null);
  const [usingAI, setUsingAI] = useState(true);
  const [apiStatus, setApiStatus] = useState("idle"); // 'idle', 'loading', 'success', 'error'
  const messagesEndRef = useRef(null);

  // Generate a unique user ID if none exists and load chat history when component mounts
  useEffect(() => {
    // Set a unique user ID for this session
    let id = localStorage.getItem("nexstay_chat_user_id");
    if (!id) {
      id = "user_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("nexstay_chat_user_id", id);
    }
    setUserId(id);

    // Load chat history
    const savedHistory = loadChatHistory();
    if (savedHistory && savedHistory.length > 0) {
      setMessages(savedHistory);
    }

    // Check if AI backend is available
    checkAIAvailability();
  }, []);

  // Save messages to local storage when they change
  useEffect(() => {
    if (messages.length > 1) {
      // Only save if there are more than the initial greeting
      saveChatHistory(messages);
    }
  }, [messages]);

  // Handle unread messages count
  useEffect(() => {
    if (!isOpen && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === "bot") {
        setUnreadCount((prev) => prev + 1);
      }
    } else if (isOpen) {
      setUnreadCount(0); // Reset when chat is opened
    }
  }, [messages, isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0); // Reset unread count when opening
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Check if AI chatbot API is available
  const checkAIAvailability = async () => {
    try {
      setApiStatus("loading");
      // Simple ping to check if backend is responsive
      const response = await axios.get("/api/chatbot/history/system-check", {
        timeout: 3000,
      });
      setUsingAI(true);
      setApiStatus("success");
      console.log("AI chatbot service is available");
    } catch (error) {
      console.warn(
        "AI chatbot service is unavailable, falling back to basic responses:",
        error
      );
      setUsingAI(false);
      setApiStatus("error");
    }
  };

  const clearChat = () => {
    const welcomeMessage = {
      text: "How can I help you today?",
      sender: "bot",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([welcomeMessage]);
    clearChatHistory();

    // Also clear chat history on the server if using AI
    if (usingAI && userId) {
      try {
        axios.delete(`/api/chatbot/history/${userId}`);
      } catch (error) {
        console.error("Error clearing server chat history:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (inputValue.trim() === "") return;

    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Add user message
    const userMessage = {
      text: inputValue,
      sender: "user",
      time: currentTime,
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue("");

    // Show typing indicator
    setIsTyping(true);

    try {
      // Process message through our service (which will use AI if available)
      const response = await processMessage(inputValue, userId);

      // Calculate typing delay based on response length for a more natural feel
      const typingDelay = Math.min(2000, Math.max(800, response.length * 10));

      setTimeout(() => {
        // Add bot response
        const botMessage = {
          text: response,
          sender: "bot",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
        setIsTyping(false);
      }, typingDelay);
    } catch (error) {
      console.error("Error processing message:", error);

      // If AI service failed, try to use fallback responses
      try {
        if (usingAI) {
          setUsingAI(false);
          setApiStatus("error");
          console.log("Falling back to local responses due to API error");
        }

        // Get fallback response from local service
        const fallbackResponse = await processMessage(inputValue);

        setTimeout(() => {
          const botMessage = {
            text: fallbackResponse,
            sender: "bot",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
          setMessages((prevMessages) => [...prevMessages, botMessage]);
          setIsTyping(false);
        }, 1000);
      } catch (fallbackError) {
        // Ultimate fallback if everything fails
        setTimeout(() => {
          const errorMessage = {
            text: "I'm having trouble responding right now. Please try again later.",
            sender: "bot",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
          setMessages((prevMessages) => [...prevMessages, errorMessage]);
          setIsTyping(false);
        }, 1000);
      }
    }
  };

  return (
    <div className="chat-assistant-container">
      {/* Chat toggle button */}
      <button
        className={`chat-toggle-button ${isOpen ? "active" : ""}`}
        onClick={toggleChat}
      >
        <div className="chat-icon">
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              {unreadCount > 0 && (
                <span className="unread-badge">{unreadCount}</span>
              )}
            </>
          )}
        </div>
        {!isOpen && (
          <span className="chat-button-text">Chat with Assistant</span>
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-title">
              <div className="chat-avatar">
                {usingAI ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2Z"></path>
                    <path d="M12 6v6l4 2"></path>
                    <path d="M17.5 12c0 1.93-1.57 3.5-3.5 3.5S10.5 13.93 10.5 12 12.07 8.5 14 8.5s3.5 1.57 3.5 3.5Z"></path>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                    <line x1="9" y1="9" x2="9.01" y2="9"></line>
                    <line x1="15" y1="9" x2="15.01" y2="9"></line>
                  </svg>
                )}
              </div>
              <div>
                <h3>NexStay Assistant</h3>
                {apiStatus === "loading" && (
                  <span className="assistant-status loading">
                    Connecting to AI...
                  </span>
                )}
                {apiStatus === "error" && (
                  <span className="assistant-status error">Basic Mode</span>
                )}
                {apiStatus === "success" && (
                  <span className="assistant-status success">AI Powered</span>
                )}
              </div>
            </div>
            <div className="chat-actions">
              <button
                className="action-button"
                onClick={clearChat}
                title="Clear chat history"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
              <button
                className="minimize-button"
                onClick={toggleChat}
                title="Minimize"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>
          </div>
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                {message.text}
                <span className="message-time">
                  {message.time ||
                    new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                </span>
              </div>
            ))}
            {isTyping && (
              <div className="message bot typing">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-footer">
            <form onSubmit={handleSubmit} className="chat-input-container">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Type your message..."
                className="chat-input"
                autoFocus={isOpen}
              />
              <button
                type="submit"
                className="send-button"
                disabled={inputValue.trim() === ""}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </form>
            <div className="chat-tips">
              {usingAI ? (
                <>
                  Ask me anything about travel, accommodations, or NexStay
                  services!
                </>
              ) : (
                <>
                  Try asking about: bookings, payments, check-in/out, or
                  properties
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatAssistant;
