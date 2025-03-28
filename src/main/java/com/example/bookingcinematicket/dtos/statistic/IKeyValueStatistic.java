package com.example.bookingcinematicket.dtos.statistic;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;


public interface IKeyValueStatistic<T, E> {
    T getKeyV();
    E getValue();
}
