import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/api/qna/ask";

export const fetchChatResponse = async (question) => {
  try {
    const response = await axios.post(API_URL, { question });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
