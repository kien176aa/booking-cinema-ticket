package com.example.bookingcinematicket.dtos.movie;

import java.util.List;

import com.example.bookingcinematicket.constants.SystemMessage;
import com.example.bookingcinematicket.dtos.MoviePersonDTO;
import com.example.bookingcinematicket.exception.CustomException;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdatePersonMovie {
    private Long movieId;
    List<MoviePersonDTO> moviePersonDTOs;

    public void validateInput() {
        if (movieId == null) throw new CustomException(SystemMessage.MOVIE_IS_REQUIRED);
        if (moviePersonDTOs == null) throw new CustomException(SystemMessage.PERSON_MOVIE_IS_REQUIRED);
        for (MoviePersonDTO dto : moviePersonDTOs) {
            dto.validateInput();
        }
    }
}
