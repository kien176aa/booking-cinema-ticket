package com.example.bookingcinematicket.dtos;

import java.time.LocalDateTime;
import java.util.List;

import com.example.bookingcinematicket.constants.SystemMessage;
import com.example.bookingcinematicket.exception.CustomException;
import com.example.bookingcinematicket.utils.DateUtils;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShowtimeDTO {
    private Long showtimeId;
    private Long movieMovieId;
    private String movieTitle;
    private String moviePosterUrl;
    private Long roomRoomId;
    private String roomName;
    private String roomRoomType;
    private String roomSeatMap;
    private Integer roomRowNums;
    private String roomColNums;
    private Long branchBranchId;
    private String branchName;
    private String branchAddress;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Double price;
    private String status;
    private Boolean canEdit;
    private List<String> bookedSeat;

    public void validateInput() {
        if (startTime != null && endTime != null) {
            this.startTime = DateUtils.convertToVietnamTime(this.startTime);
            this.endTime = DateUtils.convertToVietnamTime(this.endTime);
        } else {
            throw new CustomException(SystemMessage.START_END_TIME_IS_REQUIRED);
        }
    }
}
