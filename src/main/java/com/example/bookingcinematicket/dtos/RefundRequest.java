package com.example.bookingcinematicket.dtos;

import lombok.Data;

@Data
public class RefundRequest {
    private String paymentIntentId;
}

