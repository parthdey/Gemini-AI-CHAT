import { useState, useEffect, useRef } from 'react';
import './App.css';
import ChatInput from "./components/ChatInput";
import { fetchChatResponse } from './services/api';
import AuthCard from "./components/AuthCard";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const chatEndRef = useRef(null);

  // ✅ Load user and theme from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("chatUser");
    if (savedUser) setUser(savedUser);

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") setDarkMode(true);
  }, []);

  const handleQuestionSubmit = async (question) => {
    setLoading(true);
    setMessages(prev => [...prev, { sender: "user", text: question }]);
    try {
      const apiResponse = await fetchChatResponse(question);
      const botMessage = apiResponse?.candidates?.[0]?.content?.parts?.[0]?.text 
        || "⚠️ No response from Gemini";

      setMessages(prev => [...prev, { sender: "bot", text: botMessage }]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: "bot", text: "⚠️ Failed to get response" }]);
    } finally {
      setLoading(false);
    }
  };

  // Load old messages on start
useEffect(() => {
  const savedMessages = localStorage.getItem("chatMessages");
  if (savedMessages) {
    setMessages(JSON.parse(savedMessages));
  }
}, []);

// Save messages whenever they update
useEffect(() => {
  if (messages.length > 0) {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }
}, [messages]);

  // 👇 Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // 🌙 Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  return (
    <div className={`App ${darkMode ? "dark-mode" : ""}`}>
      {/* If no user, show Auth screen */}
      {!user ? (
        <AuthCard onLogin={setUser} />
      ) : (
        <>
          {/* 🌙 Dark Mode Toggle */}
          <button 
            className="dark-toggle" 
            onClick={toggleDarkMode}
          >
            {darkMode ? "🌞" : "🌚"}
          </button>

          {/* Chat Window */}
          <div className="chat-window p-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={msg.sender === "user" ? "user-msg" : "bot-msg"}>
                {msg.sender === "bot" ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.text}
                  </ReactMarkdown>
                ) : (
                  msg.text
                )}
              </div>
            ))}

            {/* 🔥 Animated Typing Indicator */}
            {loading && (
              <div className="typing">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <ChatInput onSubmit={handleQuestionSubmit} />
        </>
      )}
    </div>
  );
}

export default App;
