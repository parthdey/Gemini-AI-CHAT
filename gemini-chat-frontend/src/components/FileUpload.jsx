// FileUpload.jsx - FIXED VERSION
import React, { useRef } from "react";

export default function FileUpload({ onUpload, onUploadId }) {
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    // Add sessionId for better tracking
    formData.append("sessionId", "session_" + Date.now());

    try {
      // Use environment variable for API URL
      const API_BASE_URL = import.meta.env.VITE_API_URL;
      if (!API_BASE_URL) {
        console.error("❌ VITE_API_URL is not set — check your Vercel environment variables.");
  }
      const res = await fetch(`${API_BASE_URL}/api/qna/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      console.log("File uploaded:", data);

      // ✅ Pass uploadId back to parent component
      if (data.uploadId) {
        onUploadId(data.uploadId); // Pass uploadId to App.jsx
        if (onUpload) onUpload(data); // Optional callback
        alert(`File "${file.name}" uploaded successfully ✅\nChunks: ${data.chunks}`);
      } else {
        alert("Upload failed ❌ No uploadId returned");
      }

    } catch (err) {
      console.error("Upload error:", err);
      alert("File upload failed ❌");
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      <button
        onClick={triggerFileSelect}
        style={{
          border: "1px solid #ccc",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          fontSize: "20px",
          cursor: "pointer"
        }}
      >
        +
      </button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        accept=".pdf,.txt"
      />
    </>
  );
}