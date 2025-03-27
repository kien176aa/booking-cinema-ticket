package com.example.bookingcinematicket.dtos.booking;

import com.example.bookingcinematicket.dtos.FoodOrderDTO;
import com.example.bookingcinematicket.dtos.PromotionDTO;
import com.example.bookingcinematicket.dtos.TicketDTO;
import com.example.bookingcinematicket.dtos.auth.BaseAccountDTO;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class BookingResponse {
    private Long bookingId;
    private BaseAccountDTO account;
    private PromotionDTO promotion;
    private LocalDateTime bookingDate;
    private Double totalAmount;
    private String paymentMethod;
    private String paymentStatus;
    private String bookingStatus;
    private List<BookingTicket> tickets;
    private List<FoodOrderDTO> foodOrders;
}
