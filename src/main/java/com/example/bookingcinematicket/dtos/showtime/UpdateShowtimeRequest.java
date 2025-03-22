package com.example.bookingcinematicket.dtos.showtime;

import java.util.List;

import com.example.bookingcinematicket.constants.SystemMessage;
import com.example.bookingcinematicket.dtos.ShowtimeDTO;
import com.example.bookingcinematicket.exception.CustomException;

import lombok.Data;

@Data
public class UpdateShowtimeRequest {
    private Long branchId;
    private Long movieId;
    private Long roomId;
    private List<ShowtimeDTO> showtimeDTOs;

    public void validateInput() {
        if (branchId == null) throw new CustomException(SystemMessage.BRANCH_IS_REQUIRED);
        if (movieId == null) throw new CustomException(SystemMessage.MOVIE_IS_REQUIRED);
        if (roomId == null) throw new CustomException(SystemMessage.ROOM_IS_REQUIRED);
        if (showtimeDTOs == null || showtimeDTOs.size() == 0)
            throw new CustomException(SystemMessage.SHOW_TIME_IS_REQUIRED);
    }
}
