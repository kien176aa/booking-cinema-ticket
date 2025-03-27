package com.example.bookingcinematicket.dtos.booking;

import com.example.bookingcinematicket.dtos.ShowtimeDTO;
import lombok.Data;

@Data
public class BookingTicket {
    private Double price;
    private String color;
    private Long seatId;
    private Long seatTypeId;
    private Long roomId;
    private String seatNumber;
    private String seatColor;
    private ShowtimeDTO showtime;
}
