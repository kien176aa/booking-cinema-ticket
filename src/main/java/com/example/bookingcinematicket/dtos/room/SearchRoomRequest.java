package com.example.bookingcinematicket.dtos.room;

import com.example.bookingcinematicket.constants.SystemMessage;
import com.example.bookingcinematicket.exception.CustomException;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SearchRoomRequest {
    private String name;
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
