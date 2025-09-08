package com.ai.gemini_chat;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@AllArgsConstructor
@CrossOrigin(origins = {
        "http://localhost:5174",
        "https://gemini-ai-chat-apdb.vercel.app"
})
@RequestMapping("/api/qna")
public class AIController {

    private final QnAService qnAService;
    private final RagServiceClient ragServiceClient;

    // Thread-safe storage for session-based uploadIds
    private final ConcurrentHashMap<String, String> sessionUploadIds = new ConcurrentHashMap<>();

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadDoc(
            @RequestPart("file") MultipartFile file,
            @RequestParam(value = "sessionId", required = false) String sessionId) {
        try {
            Map<String, Object> response = ragServiceClient.uploadDoc(file);
            String uploadId = (String) response.get("uploadId");

            // Store uploadId with session tracking
            if (sessionId != null && !sessionId.isBlank()) {
                // Clean up any previous upload for this session
                String previousUploadId = sessionUploadIds.get(sessionId);
                if (previousUploadId != null) {
                    ragServiceClient.deleteUpload(previousUploadId);
                }
                sessionUploadIds.put(sessionId, uploadId);
            }

            return ResponseEntity.ok(Map.of(
                    "status", "uploaded",
                    "uploadId", uploadId,
                    "chunks", response.get("chunks"),
                    "filename", file.getOriginalFilename()
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(
                    Map.of("error", "Upload failed", "details", e.getMessage())
            );
        }
    }

    @PostMapping("/ask")
    public ResponseEntity<Map<String, Object>> askQuestion(
            @RequestBody Map<String, String> payload) {

        String question = payload.get("question");
        String uploadId = payload.get("uploadId"); // Get uploadId from request
        String sessionId = payload.get("sessionId");

        if (question == null || question.isBlank()) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "missing question")
            );
        }

        List<String> context = Collections.emptyList();
        String responseType = "general"; // Track response type

        // Check if we have a specific uploadId or session-based upload
        String targetUploadId = uploadId;
        if (targetUploadId == null && sessionId != null) {
            targetUploadId = sessionUploadIds.get(sessionId);
        }

        if (targetUploadId != null && !targetUploadId.isBlank()) {
            try {
                Map<String, Object> response = ragServiceClient.queryDocs(question, targetUploadId);
                @SuppressWarnings("unchecked")
                List<String> chunks = response != null && response.get("chunks") instanceof List
                        ? (List<String>) response.get("chunks")
                        : Collections.emptyList();

                if (!chunks.isEmpty()) {
                    context = chunks;
                    responseType = "rag"; // Using RAG context
                }
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(500).body(
                        Map.of("error", "RAG query failed", "details", e.getMessage())
                );
            }
        }

        // Build prompt based on context availability
        String prompt;
        if (context.isEmpty()) {
            prompt = question; // General Gemini response
        } else {
            prompt = String.format(
                    "Based on the provided document context, answer the following question. " +
                            "If the answer is not found in the context, say so clearly.\n\n" +
                            "Context:\n%s\n\n" +
                            "Question: %s\n\n" +
                            "Answer:",
                    String.join("\n\n", context),
                    question
            );
        }

        String geminiAnswer = qnAService.getAnswer(prompt);

        // 🔥 AUTO CLEANUP: Delete upload after successful query
        if (targetUploadId != null && responseType.equals("rag")) {
            try {
                ragServiceClient.deleteUpload(targetUploadId);
                // Remove from session tracking
                if (sessionId != null) {
                    sessionUploadIds.remove(sessionId);
                }
                System.out.println("✅ Auto-cleaned uploadId: " + targetUploadId);
            } catch (Exception e) {
                System.err.println("❌ Cleanup failed for uploadId: " + targetUploadId + " - " + e.getMessage());
            }
        }

        return ResponseEntity.ok(Map.of(
                "answer", geminiAnswer,
                "responseType", responseType,
                "contextUsed", context,
                "uploadCleaned", targetUploadId != null
        ));
    }

    // Manual cleanup endpoint (optional)
    @DeleteMapping("/cleanup/{sessionId}")
    public ResponseEntity<Map<String, Object>> cleanupSession(@PathVariable String sessionId) {
        String uploadId = sessionUploadIds.remove(sessionId);
        if (uploadId != null) {
            try {
                ragServiceClient.deleteUpload(uploadId);
                return ResponseEntity.ok(Map.of(
                        "status", "cleaned",
                        "uploadId", uploadId
                ));
            } catch (Exception e) {
                return ResponseEntity.status(500).body(Map.of(
                        "error", "Cleanup failed",
                        "details", e.getMessage()
                ));
            }
        }
        return ResponseEntity.ok(Map.of("status", "nothing to clean"));
    }
}