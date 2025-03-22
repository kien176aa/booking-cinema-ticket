package com.example.bookingcinematicket.dtos.showtime;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class SearchShowtimeRequest {
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status;
    private Long movieId;
    private Long roomId;
    private Long branchId;
}
