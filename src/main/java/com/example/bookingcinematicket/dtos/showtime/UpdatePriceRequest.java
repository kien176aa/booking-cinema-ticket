package com.example.bookingcinematicket.dtos.showtime;

import com.example.bookingcinematicket.constants.SystemMessage;
import com.example.bookingcinematicket.exception.CustomException;
import lombok.Data;

import java.util.List;

@Data
public class UpdatePriceRequest {
    private List<Long> ids;
    private Double price;

    public void validateInput(){
        if(ids == null || ids.isEmpty()){
            throw new CustomException(SystemMessage.SHOW_TIME_IS_REQUIRED);
        }
        if(price == null || price <= 0){
            throw new CustomException(SystemMessage.PRICE_MUST_BE_POSITIVE);
        }
    }
}
