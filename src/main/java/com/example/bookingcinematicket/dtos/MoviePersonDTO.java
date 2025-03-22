package com.example.bookingcinematicket.dtos;

import com.example.bookingcinematicket.constants.SystemMessage;
import com.example.bookingcinematicket.exception.CustomException;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MoviePersonDTO {
    private Long moviePersonId;
    private Long movieMovieId;
    private String movieTitle;
    private Long personPersonId;
    private String personName;
    private String personImageUrl;
    private Long roleRoleId;
    private String roleName;
    private String characterName;
    private String roleArr;

    public void validateInput() {
        if (personPersonId == null) throw new CustomException(SystemMessage.PERSON_MOVIE_IS_REQUIRED);
        if (roleRoleId == null) throw new CustomException(SystemMessage.ROLE_IS_REQUIRED);
        if (characterName == null) throw new CustomException(SystemMessage.CHARACTER_NAME_IS_REQUIRED);
    }
}
