import { useState } from 'react';
import './App.css';
import ChatInput from "./components/ChatInput";
import { fetchChatResponse } from './services/api';

function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className='App'>
      <header className='bg-primary text-white text-center py-4'>
        <h1>Gemini ChatBot</h1>
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
