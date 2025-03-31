package com.example.bookingcinematicket.dtos.movie;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SearchMovieRequest {
    private String keyWord;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    public void validateInput(){
        if (keyWord != null)
            keyWord = keyWord.trim().toLowerCase();
    }
}
