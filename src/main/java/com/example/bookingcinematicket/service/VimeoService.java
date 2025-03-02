package com.example.bookingcinematicket.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@Service
public class VimeoService {

    @Value("${vimeo.access.token}")
    private String accessToken;

    private static final String VIMEO_UPLOAD_URL = "https://api.vimeo.com/me/videos";

    public String uploadVideo(MultipartFile file) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + accessToken);
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> body = new HashMap<>();
            body.put("upload", Map.of("approach", "tus", "size", file.getSize()));
            body.put("name", file.getOriginalFilename());
            body.put("description", "Uploaded via API");

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<Map> response = restTemplate.exchange(VIMEO_UPLOAD_URL, HttpMethod.POST, request, Map.class);

            if (response.getStatusCode() == HttpStatus.CREATED) {
                String uploadLink = (String) ((Map) response.getBody().get("upload")).get("upload_link");
                return uploadFileToVimeo(uploadLink, file);
            } else {
                return "Lỗi: Không thể tạo video trên Vimeo";
            }
        } catch (Exception e) {
            return "Lỗi upload video: " + e.getMessage();
        }
    }

    private String uploadFileToVimeo(String uploadUrl, MultipartFile file) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Tus-Resumable", "1.0.0");
            headers.set("Content-Type", "application/offset+octet-stream");
            headers.set("Content-Length", String.valueOf(file.getSize()));
            headers.set("Upload-Offset", "0");

            HttpEntity<byte[]> request = new HttpEntity<>(file.getBytes(), headers);
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.exchange(uploadUrl, HttpMethod.PATCH, request, String.class);

            if (response.getStatusCode() == HttpStatus.NO_CONTENT) {
                return "Upload thành công! Video sẽ hiển thị trên Vimeo sau vài phút.";
            } else {
                return "Lỗi upload video.";
            }
        } catch (Exception e) {
            return "Lỗi: " + e.getMessage();
        }
    }
}
