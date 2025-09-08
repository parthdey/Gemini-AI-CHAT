import axios from "axios";

// ✅ Use direct URL for now (to avoid env var issues)
const API_URL = "http://localhost:8080/api/qna/ask";

export const fetchChatResponse = async (question, uploadId = null) => {
  try {
    const response = await axios.post(API_URL, {
      question,
      uploadId, // ✅ send uploadId if available
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
