package com.ai.gemini_chat;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/rag")
@CrossOrigin(origins = {
        "http://localhost:5174",
        "https://gemini-ai-chat-apdb.vercel.app"
})
public class RagController {

    private final RagServiceClient ragServiceClient;
    private final QnAService qnaService;

    public RagController(RagServiceClient ragServiceClient, QnAService qnaService) {
        this.ragServiceClient = ragServiceClient;
        this.qnaService = qnaService;
    }

    @GetMapping("/health")
    public String health() {
        return ragServiceClient.checkHealth();
    }

    @PostMapping("/query")
    public Map<String, Object> query(
            @RequestParam("q") String q,
            @RequestParam(defaultValue = "3") int topK) {
        return ragServiceClient.queryDocs(q, topK);
    }

    @PostMapping("/upload")
    public Map<String, Object> uploadFile(@RequestParam("file") MultipartFile file) {
        Map<String, Object> ragResponse = ragServiceClient.uploadFile(file);

        return Map.of(
                "status", "uploaded",
                "file", file.getOriginalFilename(),
                "uploadId", ragResponse.get("uploadId"),   // ✅ clean JSON
                "chunks", ragResponse.get("chunks")
        );
    }



    @PostMapping("/ask")
    public Map<String, Object> askQuestion(@RequestBody Map<String, String> payload) {
        try {
            System.out.println("Incoming payload: " + payload);

            String question = payload.get("q");
            List<String> chunks = ragServiceClient.queryChunks(question, 3);
            String context = String.join("\n\n", chunks);

            String prompt = "Use the following context to answer the question.\n\n"
                    + "Context:\n" + context + "\n\n"
                    + "Question: " + question + "\n\n"
                    + "Answer:";

            String answer = qnaService.getAnswer(prompt);

            return Map.of(
                    "question", question,
                    "answer", answer,
                    "chunksUsed", chunks
            );
        } catch (Exception e) {
            e.printStackTrace();
            return Map.of("error", e.getMessage());
        }
    }
}
