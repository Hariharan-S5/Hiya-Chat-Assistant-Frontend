
import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./ChatMessageList.css";

// Message shape: { id, role: "user" | "ai", content }
export default function ChatMessageList({ messages, errorMsg, loading, handleRefresh, lastUserMessage }) {
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-message-list" ref={listRef}>
      {messages.map((msg, idx) => {
        const isLastUserMsg =
          msg.role === 'user' && lastUserMessage && msg.content === lastUserMessage.content && errorMsg;
        // Ensure unique key: prefer id if unique, else fallback to idx-role
        const key = msg.id !== undefined ? `${msg.id}-${idx}-${msg.role}` : `${idx}-${msg.role}`;
        return (
          <div key={key} className={`chat-message chat-message-${msg.role}`}>
            <div className="chat-message-bubble">
              <ReactMarkdown>{msg.content}</ReactMarkdown>
              {isLastUserMsg && (
                <div className="chat-error-message">
                  
                  <span
                    className="chat-refresh-icon"
                    onClick={!loading ? handleRefresh : undefined}
                    style={{ cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1 }}
                    title="Retry"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M17.65 6.35A8 8 0 1 0 12 20v-2a6 6 0 1 1 6-6h-2l3 3 3-3h-2a8 8 0 0 0-2.35-5.65z" fill="#4a4242"/>
                    </svg>
                  </span>
                  <div>{errorMsg}</div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}