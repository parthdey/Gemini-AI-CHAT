import { useState, useRef } from "react";
import { Send, Plus } from "react-bootstrap-icons";

const ChatInput = ({ onSubmit, setUploadId }) => {
  const [question, setQuestion] = useState("");
  const fileInputRef = useRef(null);

  // Handle question submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    onSubmit(question);
    setQuestion("");
  };

  // Trigger file input
  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  // Handle file upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("sessionId", "session_" + Date.now());

    try {
      // ✅ Use correct endpoint /api/qna/upload
      const res = await fetch("http://localhost:8080/api/qna/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      console.log("File uploaded:", data);

      if (data.uploadId) {
        // ✅ Use setUploadId from App.jsx props
        if (setUploadId) {
          setUploadId(data.uploadId);
        }
        // ✅ Reset file input to allow re-uploads
        fileInputRef.current.value = '';
        alert(`File "${file.name}" uploaded successfully ✅\nChunks: ${data.chunks}`);
      } else {
        alert("Upload failed ❌");
      }

    } catch (err) {
      console.error("Upload error:", err);
      alert("File upload failed ❌");
    }
  };

  return (
    <div className="container my-4">
      <form onSubmit={handleSubmit} className="d-flex align-items-center gap-2">
        {/* Upload Button */}
        <button
          type="button"
          className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
          style={{ width: "45px", height: "45px" }}
          onClick={triggerFileSelect}
        >
          <Plus size={20} />
        </button>

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
          accept=".pdf,.txt"
        />

        {/* Chat Input */}
        <input
          type="text"
          className="form-control me-2"
          id="question"
          placeholder="Enter your question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        {/* Send Button */}
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