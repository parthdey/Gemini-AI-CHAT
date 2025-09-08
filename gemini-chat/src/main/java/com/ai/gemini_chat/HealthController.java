package com.ai.gemini_chat;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/health")
public class HealthController {

    private final RagServiceClient ragServiceClient;

    public HealthController(RagServiceClient ragServiceClient) {
        this.ragServiceClient = ragServiceClient;
    }

    @GetMapping("/rag/health")
    public String testRagHealth() {
        return ragServiceClient.checkHealth();
    }

    @GetMapping("/api/health")
    public String health() {
        return "Backend is running!";
    }
}
