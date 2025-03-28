package com.example.bookingcinematicket.service;

import com.example.bookingcinematicket.constants.SystemMessage;
import com.example.bookingcinematicket.exception.CustomException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.sound.midi.SysexMessage;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;

@Service
@Slf4j
public class FileUploadService {
    private static final Set<String> IMAGE_TYPES = Set.of("image/jpeg", "image/jpg", "image/png");
    private static final String VIDEO_TYPE = "video/mp4";
    private static final String UPLOAD_DIR = "src/main/resources/static/uploads";
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024;

    @Async
    public CompletableFuture<String> uploadFile(MultipartFile file, boolean isImg, String fileName) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                if (file.isEmpty()) {
                    throw new CustomException(SystemMessage.FILE_IS_REQUIRED);
                }

                if (file.getSize() > MAX_FILE_SIZE) {
                    throw new CustomException(SystemMessage.INVALID_SIZE_FILE);
                }

                String contentType = file.getContentType();
                if (isImg && (contentType == null || !IMAGE_TYPES.contains(contentType))) {
                    throw new CustomException(SystemMessage.INVALID_IMAGE_TYPE);
                }
                if (!isImg && (contentType == null || !contentType.equals(VIDEO_TYPE))) {
                    throw new CustomException(SystemMessage.INVALID_VIDEO_TYPE);
                }

                File uploadDir = new File(UPLOAD_DIR);
                if (!uploadDir.exists()) {
                    uploadDir.mkdirs();
                }

                String extension = file.getOriginalFilename() != null
                        ? file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf("."))
                        : "";

                Path filePath = Path.of(UPLOAD_DIR, fileName + extension);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                return "File đã upload: /uploads/" + fileName + extension;
            } catch (IOException e) {
                throw new CompletionException(new CustomException(SystemMessage.ERROR_500));
            }
        });
    }


    public String generateFileName(String prefix) {
        return prefix + "_" + UUID.randomUUID().toString();
    }

    public String getUploadDir(){
        return "/uploads/";
    }
}
