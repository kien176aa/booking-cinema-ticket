package com.example.bookingcinematicket.dtos.movie;

import com.example.bookingcinematicket.constants.SystemMessage;
import com.example.bookingcinematicket.exception.CustomException;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SearchMoviePersonRequest {
    private Long movieId;
    private String keyWord;

    public void validateInput(){
        if(movieId == null)
            throw new CustomException(SystemMessage.MOVIE_IS_REQUIRED);
        if(keyWord != null){
            keyWord = keyWord.trim().toLowerCase();
        }
    }
}
