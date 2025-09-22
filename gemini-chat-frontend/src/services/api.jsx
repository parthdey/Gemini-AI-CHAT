// src/services/api.js
// ✅ Get API URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  console.error("❌ VITE_API_URL is not set — check your Vercel environment variables.");
  console.error("Available env vars:", import.meta.env);
}

export const fetchChatResponse = async (question, uploadId = null) => {
  try {
    if (!API_BASE_URL) {
      throw new Error("Backend URL not configured. Check environment variables.");
    }

    console.log("📤 Sending chat request to:", `${API_BASE_URL}/api/qna/ask`);
    console.log("Question:", question);
    console.log("Upload ID:", uploadId);

    const requestBody = {
      question: question,
      sessionId: "session_" + Date.now()
    };

    // Add uploadId if provided (for document-based questions)
    if (uploadId) {
      requestBody.uploadId = uploadId;
    }

    const response = await fetch(`${API_BASE_URL}/api/qna/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Chat response received:", data);
    
    return data;
  } catch (error) {
    console.error("Chat API error:", error);
    throw error;
  }
};

// Optional: Export other API functions if you need them
export const uploadFile = async (file, sessionId) => {
  try {
    if (!API_BASE_URL) {
      throw new Error("Backend URL not configured. Check environment variables.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("sessionId", sessionId || "session_" + Date.now());

    const response = await fetch(`${API_BASE_URL}/api/qna/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Upload Error:", response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ File upload response:", data);
    
    return data;
  } catch (error) {
    console.error("Upload API error:", error);
    throw error;
  }
};