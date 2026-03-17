import React, { useState } from "react";
import axios from "axios";
import "./ChatInputBox.css";

export default function ChatInputBox({ messages, setMessages, handleSend, loading }) {
  const [input, setInput] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    await handleSend(input);
    setInput("");
  };


  return (
    <form className="chat-input-box" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Ask me anything..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="chat-input-field"
        autoFocus
        disabled={loading}
      />
      <button type="submit" className="chat-send-btn" aria-label="Send" disabled={loading}>
        {loading ? (
          <span className="chat-spinner" />
        ) : (
          <span className="chat-send-icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="#4f8cff" />
            </svg>
          </span>
        )}
      </button>
    </form>
  );
}
