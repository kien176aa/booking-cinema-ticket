package com.example.bookingcinematicket.dtos;

import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MovieDTO {
    private Long movieId;
    private String title;
    private String description;
    private Integer duration;
    private String genre;
    private LocalDate releaseDate;
    private Float rating;
    private String posterUrl;
    private String trailerUrl;
    private String country;
    private String language;
    private String videoId;
    private Boolean status;
    private List<MoviePersonDTO> moviePersons;
}
