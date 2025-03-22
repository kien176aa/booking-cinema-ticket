package com.example.bookingcinematicket.dtos;

import com.example.bookingcinematicket.constants.SystemMessage;
import com.example.bookingcinematicket.entity.Account;
import com.example.bookingcinematicket.entity.FoodOrder;
import com.example.bookingcinematicket.entity.Promotion;
import com.example.bookingcinematicket.entity.Ticket;
import com.example.bookingcinematicket.exception.CustomException;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingDTO {
    private Long bookingId;
    private Long accountAccountId;
    private String accountEmail;
    private String accountFullName;
    private PromotionDTO promotion;
    private LocalDateTime bookingDate;
    private Double totalAmount;
    private String paymentMethod;
    private String paymentStatus;
    private String bookingStatus;
    private String seatMap;
    private List<TicketDTO> tickets;
    private List<FoodOrderDTO> foodOrders;

    public void validateInput(){
        if(totalAmount == null || totalAmount < 0){
            throw new CustomException(SystemMessage.TOTAL_AMOUNT_MUST_NOT_BE_NEGATIVE_NUMBER);
        }
        if (tickets == null || tickets.isEmpty()){
            throw new CustomException(SystemMessage.SEAT_IS_REQUIRED);
        }
    }
}
