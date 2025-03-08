package com.example.bookingcinematicket.dtos.auth;

import com.example.bookingcinematicket.constants.SystemMessage;
import com.example.bookingcinematicket.exception.CustomException;
import lombok.Data;

@Data
public class ChangePasswordRequest {
    private String oldPassword;
    private String newPassword;
    private String confirmPassword;

    public void validateInput(){
        if(newPassword.isBlank()){
            throw new CustomException(SystemMessage.NEW_PASSWORD_IS_REQUIRED);
        }
        if(confirmPassword.isBlank()){
            throw new CustomException(SystemMessage.CONFIRM_PASSWORD_IS_REQUIRED);
        }
        if(!newPassword.equals(confirmPassword)){
            throw new CustomException(SystemMessage.NEW_PASSWORD_IS_NOT_EQUAL_CONFIRM_PASSWORD);
        }
    }
}
