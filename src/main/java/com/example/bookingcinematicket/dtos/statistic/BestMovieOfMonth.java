package com.example.bookingcinematicket.dtos.statistic;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class BestMovieOfMonth {
    private String title;
    private String genre;
    private String revenue;
    private Double percent;
}
