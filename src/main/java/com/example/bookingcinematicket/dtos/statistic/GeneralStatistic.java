package com.example.bookingcinematicket.dtos.statistic;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class GeneralStatistic {
    private Integer totalTickets;
    private Integer totalCustomers;
    private Integer totalMovies;
    private String totalRevenues;
}
