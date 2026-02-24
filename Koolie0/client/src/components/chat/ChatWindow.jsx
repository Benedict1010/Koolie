import React, { useState, useRef, useEffect } from "react";
import "./ChatWindow.css";

const mockMessages = [
  { id: 1, senderId: "client1", text: "Hi, I have a question about the job." },
  { id: 2, senderId: "provider1", text: "Sure, how can I help you?" },
  { id: 3, senderId: "client1", text: "What time will you arrive?" },
  { id: 4, senderId: "provider1", text: "I will be there by 10 AM." },
];

export default function ChatWindow({ requestId, currentUserId, otherUserName, onClose }) {
  const [messages, setMessages] = useState(mockMessages);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (input.trim() === "") return;
    setMessages([
      ...messages,
      { id: Date.now(), senderId: currentUserId, text: input },
    ]);
    setInput("");
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <span>Chat with {otherUserName}</span>
        {onClose && (
          <button className="chat-close" onClick={onClose}>&times;</button>
        )}
      </div>
      <div className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={
              msg.senderId === currentUserId
                ? "chat-bubble chat-bubble-right"
                : "chat-bubble chat-bubble-left"
            }
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
