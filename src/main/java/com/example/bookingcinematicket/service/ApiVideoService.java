package com.example.bookingcinematicket.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.bookingcinematicket.entity.JobLog;
import com.example.bookingcinematicket.exception.CustomException;
import com.example.bookingcinematicket.repository.JobLogRepository;

import video.api.client.ApiVideoClient;
import video.api.client.api.ApiException;
import video.api.client.api.models.Video;
import video.api.client.api.models.VideoCreationPayload;

@Service
public class ApiVideoService {

    @Value("${apivideo.api.key}")
    private String apiKey;

    @Autowired
    private JobLogRepository jobLogRepository;

    public ApiVideoService(JobLogRepository jobLogRepository) {
        this.jobLogRepository = jobLogRepository;
    }

    /**
     * Bước 1: Tạo video ID trước để lưu vào DB
     */
    public String createVideo(String title) {
        try {
            ApiVideoClient apiVideoClient = new ApiVideoClient(apiKey);
            Video video = apiVideoClient.videos().create(new VideoCreationPayload().title(title));
            return video.getVideoId();
        } catch (ApiException e) {
            e.printStackTrace();
            throw new CustomException("Lỗi tạo video ID");
        }
    }

    /**
     * Bước 2: Upload video chạy bất đồng bộ (Thread riêng)
     */
    @Async
    public void uploadVideoAsync(String videoId, String title, MultipartFile file) {
        File videoFile = null;
        try {
            ApiVideoClient apiVideoClient = new ApiVideoClient(apiKey);
            videoFile = convertMultipartToFile(file);
            apiVideoClient.videos().upload(videoId, videoFile);

            saveJobError(videoId, String.format("Trailer của bộ phim %s đã tải lên thành công", title), true);
            System.out.println("Upload video thành công: " + videoId);
        } catch (ApiException | IOException e) {
            e.printStackTrace();
            saveJobError(videoId, String.format("Xảy ra lỗi khi tải trailer của bộ phim %s", title), false);
        } finally {
            if (videoFile != null && videoFile.exists()) {
                videoFile.delete();
            }
        }
    }

    /**
     * Lưu lỗi upload video vào bảng job_log
     */
    private void saveJobError(String videoId, String errorMessage, Boolean isSuccess) {
        JobLog jobLog = new JobLog();
        jobLog.setReferId(videoId);
        jobLog.setMessage(errorMessage);
        jobLog.setIsSuccess(isSuccess);
        jobLogRepository.save(jobLog);
    }

    /**
     * Convert MultipartFile thành File tạm thời để upload
     */
    private File convertMultipartToFile(MultipartFile file) throws IOException {
        Path tempFile = Files.createTempFile("upload_", file.getOriginalFilename());
        Files.copy(file.getInputStream(), tempFile, StandardCopyOption.REPLACE_EXISTING);
        return tempFile.toFile();
    }

    public String getUrlByVideoId(String videoId) {
        return String.format("https://embed.api.video/vod/%s", videoId);
    }
}
