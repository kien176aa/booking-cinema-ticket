package com.example.bookingcinematicket.dtos;

import lombok.Data;

@Data
public class TicketDTO {
    private Double price;
    private Boolean status;
    private Long seatId;
    private Long seatTypeId;
    private Long roomId;
    private String seatNumber;
    private String color;
    private Long showtimeId;
}
