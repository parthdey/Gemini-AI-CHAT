import { useState } from "react";
import { Send } from "react-bootstrap-icons"; // paper plane icon

const ChatInput = ({ onSubmit }) => {
  const [question, setQuestion] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim()) {
      onSubmit(question);
      setQuestion("");
    }
  };

  return (
    <div className="container my-4">
      <form onSubmit={handleSubmit} className="d-flex">
        <input
          type="text"
          className="form-control me-2"
          id="question"
          placeholder="Enter your question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <button
          type="submit"
          className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center"
          style={{ width: "45px", height: "45px" }}
          disabled={!question.trim()}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
