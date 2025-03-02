package com.example.bookingcinematicket.dtos.promotion;

import com.example.bookingcinematicket.constants.SystemMessage;
import com.example.bookingcinematicket.exception.CustomException;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SearchPromotionRequest {
    private String name;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Boolean status;
    private String branchId;

    public void validateInput(){
        if(branchId == null){
            throw new CustomException(SystemMessage.PLEASE_CHOOSE_BRANCH);
        }
        if(name != null){
            name = name.trim().toLowerCase();
        }
    }
}
