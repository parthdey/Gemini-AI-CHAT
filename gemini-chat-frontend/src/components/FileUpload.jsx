// src/components/FileUpload.jsx
import React, { useRef } from "react";

export default function FileUpload({ onUpload, onUploadId }) {
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("sessionId", "session_" + Date.now());

    try {
      // ✅ Get API URL from Vite environment
      const API_BASE_URL = import.meta.env.VITE_API_URL;

      if (!API_BASE_URL) {
        console.error("❌ VITE_API_URL is not set — check your Vercel environment variables.");
        alert("Backend URL missing. Check env vars.");
        return; // stop here if no URL
      }

      console.log("📤 Uploading to:", `${API_BASE_URL}/api/qna/upload`);

      const res = await fetch(`${API_BASE_URL}/api/qna/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Upload failed:", res.status, errText);
        alert("Upload failed ❌");
        return;
      }

      const data = await res.json();
      console.log("✅ File uploaded:", data);

      // Pass uploadId to parent if provided
      if (data.uploadId) {
        onUploadId?.(data.uploadId); // pass uploadId to parent
        onUpload?.(data); // optional callback
        alert(`File "${file.name}" uploaded successfully ✅\nChunks: ${data.chunks}`);
      } else {
        alert("Upload failed ❌ No uploadId returned");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("File upload failed ❌");
    }
  };

  const triggerFileSelect = () => fileInputRef.current.click();

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





// FileUpload.jsx - FIXED VERSION
// import React, { useRef } from "react";

// export default function FileUpload({ onUpload, onUploadId }) {
//   const fileInputRef = useRef(null);

//   const handleFileChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("file", file);
//     // Add sessionId for better tracking
//     formData.append("sessionId", "session_" + Date.now());

//     try {
//       // Use environment variable for API URL
//       const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
//       const res = await fetch(`${API_BASE_URL}/api/qna/upload`, {
//         method: "POST",
//         body: formData,
//       });
//       const data = await res.json();
//       console.log("File uploaded:", data);

//       // ✅ Pass uploadId back to parent component
//       if (data.uploadId) {
//         onUploadId(data.uploadId); // Pass uploadId to App.jsx
//         if (onUpload) onUpload(data); // Optional callback
//         alert(`File "${file.name}" uploaded successfully ✅\nChunks: ${data.chunks}`);
//       } else {
//         alert("Upload failed ❌ No uploadId returned");
//       }

//     } catch (err) {
//       console.error("Upload error:", err);
//       alert("File upload failed ❌");
//     }
//   };

//   const triggerFileSelect = () => {
//     fileInputRef.current.click();
//   };

//   return (
//     <>
//       <button
//         onClick={triggerFileSelect}
//         style={{
//           border: "1px solid #ccc",
//           borderRadius: "50%",
//           width: "40px",
//           height: "40px",
//           fontSize: "20px",
//           cursor: "pointer"
//         }}
//       >
//         +
//       </button>
//       <input
//         type="file"
//         ref={fileInputRef}
//         style={{ display: "none" }}
//         onChange={handleFileChange}
//         accept=".pdf,.txt"
//       />
//     </>
//   );
// }