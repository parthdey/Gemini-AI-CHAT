import { useState, useEffect } from 'react';
import './App.css';
import ChatInput from "./components/ChatInput";
import { fetchChatResponse } from './services/api';
import AuthCard from "./components/AuthCard"; // 👈 new import

function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // ✅ Check localStorage for saved user
  useEffect(() => {
    const savedUser = localStorage.getItem("chatUser");
    if (savedUser) setUser(savedUser);
  }, []);

  const handleQuestionSubmit = async (question) => {
    setLoading(true);
    setMessages(prev => [...prev, { sender: "user", text: question }]);
    try {
      const apiResponse = await fetchChatResponse(question);
      // Extract safe text
      const botMessage = apiResponse?.candidates?.[0]?.content?.parts?.[0]?.text 
        || "⚠️ No response from Gemini";

      setMessages(prev => [...prev, { sender: "bot", text: botMessage }]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: "bot", text: "⚠️ Failed to get response" }]);
    } finally {
      setLoading(false);
    }
  };

  // 👇 Show AuthCard first if no user is logged in
  if (!user) {
    return <AuthCard onLogin={setUser} />;
  }

  return (
    <div className='App'>
      <header className='bg-primary text-white text-center py-4'>
        <h1>Gemini ChatBot</h1>
        <small>Welcome, {user} 👋</small>
      </header>

      {/* Chat Window */}
      <div className="chat-window p-3">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.sender === "user" ? "user-msg" : "bot-msg"}>
            {msg.text}
          </div>
        ))}
        {loading && <div className="bot-msg typing">...</div>}
      </div>

      {/* Input */}
      <ChatInput onSubmit={handleQuestionSubmit} />
    </div>
  );
}

export default App;
