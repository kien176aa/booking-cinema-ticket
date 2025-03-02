package com.example.bookingcinematicket.dtos;

import com.example.bookingcinematicket.entity.Role;
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
    private Long roleRoleId;
    private String roleName;
    private String characterName;
    private String description;
}
