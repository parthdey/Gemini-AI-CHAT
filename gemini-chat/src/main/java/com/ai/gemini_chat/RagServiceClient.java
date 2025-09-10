package com.ai.gemini_chat;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.List;
import java.util.Map;

@Service
public class RagServiceClient {

    private final WebClient webClient;
    private final QnAService qnaService;

    public RagServiceClient(WebClient.Builder builder,
                            @Value("${rag.service.base-url}") String baseUrl,
                            QnAService qnaService) {
        this.qnaService = qnaService;
        this.webClient = builder.baseUrl(baseUrl).build();
    }

    public String checkHealth() {
        try {
            return webClient.get()
                    .uri("/health")
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
        } catch (WebClientResponseException ex) {
            return "{\"ok\":false,\"error\":\"" + ex.getRawStatusCode() + " " + ex.getResponseBodyAsString() + "\"}";
        } catch (Exception e) {
            return "{\"ok\":false,\"error\":\"" + e.getMessage() + "\"}";
        }
    }

    public Map<String, Object> queryDocs(String query, int topK) {
        try {
            return webClient.post()
                    .uri("/query")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(Map.of("query", query, "top_k", topK))
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                    .block();
        } catch (WebClientResponseException ex) {
            throw new RuntimeException("RAG service error: " + ex.getRawStatusCode() + " - " + ex.getResponseBodyAsString(), ex);
        }
    }

    public Map<String, Object> queryDocs(String query) {
        return queryDocs(query, 3);
    }

    public Map<String, Object> queryDocs(String query, String uploadId) {
        try {
            return webClient.post()
                    .uri(uriBuilder -> uriBuilder
                            .path("/query")
                            .queryParam("namespace", uploadId)
                            .build())
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(Map.of("query", query, "top_k", 3))
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                    .block();
        } catch (WebClientResponseException ex) {
            throw new RuntimeException("RAG service error (namespace): " + ex.getRawStatusCode() + " - " + ex.getResponseBodyAsString(), ex);
        }
    }

    @SuppressWarnings("unchecked")
    public List<String> queryChunks(String query, int topK) {
        Map<String, Object> resp = queryDocs(query, topK);
        if (resp == null) return List.of();
        Object chunksObj = resp.get("chunks");
        if (chunksObj instanceof List) {
            return (List<String>) chunksObj;
        }
        return List.of();
    }

    public List<String> queryChunks(String query) {
        return queryChunks(query, 3);
    }

    public Map<String, Object> uploadFile(MultipartFile file) {
        return uploadDoc(file);
    }

    public Map<String, Object> uploadDoc(MultipartFile file) {
        try {
            LinkedMultiValueMap<String, Object> body = new LinkedMultiValueMap<>();

            ByteArrayResource resource = new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            };

            body.add("file", resource);

            return webClient.post()
                    .uri("/upload_file")
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(BodyInserters.fromMultipartData(body))
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                    .block();
        } catch (Exception e) {
            throw new RuntimeException("Unexpected error uploading file: " + e.getMessage(), e);
        }
    }

    public void deleteUpload(String uploadId) {
        try {
            webClient.delete()
                    .uri(uriBuilder -> uriBuilder
                            .path("/delete_upload/{uploadId}")
                            .build(uploadId))
                    .retrieve()
                    .toBodilessEntity()
                    .block();
        } catch (Exception e) {
            System.err.println("Failed to delete uploadId " + uploadId + ": " + e.getMessage());
        }
    }
}