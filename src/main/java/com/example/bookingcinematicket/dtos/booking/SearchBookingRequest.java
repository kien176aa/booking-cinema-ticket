package com.example.bookingcinematicket.dtos.booking;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class SearchBookingRequest {
    private LocalDate startTime;
    private LocalDate endTime;
    private Double minPrice;
    private Double maxPrice;
    private String keyWord;
    private Boolean isSearchByAccountId;

    public void validateInput(){
        if(keyWord != null)
            keyWord = keyWord.trim().toLowerCase();
        if(isSearchByAccountId == null)
            isSearchByAccountId = true;
    }
}
