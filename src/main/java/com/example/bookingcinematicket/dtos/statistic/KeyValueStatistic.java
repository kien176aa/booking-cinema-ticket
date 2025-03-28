package com.example.bookingcinematicket.dtos.statistic;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class KeyValueStatistic<T, E> {
    private T key;
    private E value;
}
