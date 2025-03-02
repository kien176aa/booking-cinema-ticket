package com.example.bookingcinematicket.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "movies")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "movie_id")
    private Long movieId;
    @Column(nullable = false)
    private String title;
    @Column(columnDefinition = "TEXT")
    private String description;
    private Integer duration;
    @Column(length = 500)
    private String genre;
    @Column(name = "release_date")
    private LocalDate releaseDate;
    private Float rating;
    private String posterUrl;
    private String trailerUrl;
    private String country;
    private String language;
    private Boolean status;
    @OneToMany(mappedBy = "movie")
    private List<Showtime> showtimes;
    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL)
    private List<MoviePerson> moviePersons;
}
