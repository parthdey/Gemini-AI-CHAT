🤖 AI Chatbot (React + Spring Boot + Gemini API)

An AI-powered chatbot application with a modern, responsive UI and intelligent conversational capabilities.
Built with React (frontend) and Spring Boot (backend), deployed seamlessly on Vercel and Render.

🚀 Features

=> 🔐 User Authentication (email-based, extensible for OAuth: Google/GitHub/LinkedIn)

=> 🌙 Dark Mode Toggle for better user experience

=> 💬 Smooth Chat Experience

  - Auto-scroll to latest messages

  - Animated typing indicators

  - Markdown support (formatted answers, code blocks, links)

=> 💾 Persistent Chat History – remembers your last conversation across sessions

=> 📱 Responsive Design – works on desktop & mobile devices

=> ⚡ Gemini API Integration – intelligent, contextual responses


🛠️ Tech Stack

Frontend:

=> React (Vite/CRA)

=> React Markdown + Remark GFM (for formatted answers)

=> Tailwind/CSS custom styling


Backend:

=> Spring Boot

=> REST API integration with Gemini


Deployment:

=> Backend → Render

=> Frontend → Vercel


📸 Screenshots:

<img width="1889" height="854" alt="image" src="https://github.com/user-attachments/assets/a261a26d-b57d-48c2-84d3-253644e0331b" />


🧩 Project Structure
ai-chatbot/
│── backend/         # Spring Boot app (API + Gemini integration)
│── frontend/        # React app (UI + chat interface)
│── README.md


The project will start at [https://gemini-ai-chat-apdb.vercel.app/]


🌐 Deployment

=> Backend: Deploy on Render (Spring Boot + JAR)

=> Frontend: Deploy on Vercel (React build)

=> Configure environment variables for Gemini API key in both environments.


🔮 Future Improvements

=> 📂 RAG (Retrieval-Augmented Generation):
Allow users to upload documents (PDF, DOCX, TXT) and query them.
The bot will extract relevant context from the document and generate a decorated, AI-enhanced response.

=> 🧑‍🤝‍🧑 Collaborative Chat Sharing – share conversation history with others.

=> 🎙️ Voice Support – speech-to-text and text-to-speech features.

=> 🖼️ Rich Media Responses – support for images, charts, or code execution previews.


🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

📜 License

This project is licensed under the MIT License.
