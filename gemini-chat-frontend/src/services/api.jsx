import axios from "axios";

// Use environment variable for production, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const API_URL = `${API_BASE_URL}/api/qna/ask`;

export const fetchChatResponse = async (question, uploadId = null) => {
  try {
    const response = await axios.post(API_URL, {
      question,
      uploadId,
    });

    console.log("Backend raw response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching chat response:",
      error.response?.data || error.message
    );
    throw error;
  }
};