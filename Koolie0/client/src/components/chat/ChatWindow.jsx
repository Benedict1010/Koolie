import React, { useState, useRef, useEffect } from "react";
import { db } from "../../services/firebase";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore";

export default function ChatWindow({ requestId, currentUserId, otherUserName, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const chatRef = doc(db, "chats", requestId);
  const messagesRef = collection(chatRef, "messages");
  const [loading, setLoading] = useState(true);
  const unsubscribeRef = useRef(null);

  // 1. Ensure chat document exists
  useEffect(() => {
    let isMounted = true;
    async function ensureChatDoc() {
      const chatSnap = await getDoc(chatRef);
      if (!chatSnap.exists()) {
        // You may want to pass clientId/providerId as props
        await setDoc(chatRef, {
          clientId: currentUserId, // Or pass as prop
          providerId: otherUserName, // Or pass as prop
          createdAt: serverTimestamp()
        });
      }
    }
    ensureChatDoc();
    // 2. Real-time messages
    const q = query(messagesRef, orderBy("timestamp", "asc"));
    unsubscribeRef.current = onSnapshot(q, (snapshot) => {
      if (!isMounted) return;
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
      setLoading(false);
    });
    return () => {
      isMounted = false;
      if (unsubscribeRef.current) unsubscribeRef.current();
    };
    // eslint-disable-next-line
  }, [requestId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 3. Send message
  const handleSend = async () => {
    if (input.trim() === "") return;
    await addDoc(messagesRef, {
      senderId: currentUserId,
      text: input,
      timestamp: serverTimestamp()
    });
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
        {loading ? (
          <div className="chat-loading">Loading...</div>
        ) : (
          messages.map((msg, idx) => {
            // Format timestamp
            let time = msg.timestamp && msg.timestamp.seconds
              ? new Date(msg.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : '';
            // Determine sender label
            const isSent = msg.senderId === currentUserId;
            const senderLabel = isSent ? "You" : otherUserName;
            return (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isSent ? 'flex-end' : 'flex-start' }}>
                <span style={{ fontSize: '0.85em', color: '#888', marginBottom: '2px', marginLeft: isSent ? '0' : '6px', marginRight: isSent ? '6px' : '0' }}>
                  {senderLabel} {time && <span style={{ marginLeft: 6, color: '#bbb' }}>{time}</span>}
                </span>
                <div
                  className={
                    isSent
                      ? "chat-bubble chat-bubble-right"
                      : "chat-bubble chat-bubble-left"
                  }
                >
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
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
