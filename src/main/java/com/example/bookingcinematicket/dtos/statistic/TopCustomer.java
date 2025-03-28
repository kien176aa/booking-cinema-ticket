package com.example.bookingcinematicket.dtos.statistic;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class TopCustomer {
    private String fullName;
    private String email;
    private String phone;
    private String totalAmount;
}
