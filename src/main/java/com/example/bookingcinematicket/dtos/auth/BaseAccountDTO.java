package com.example.bookingcinematicket.dtos.auth;

import lombok.Data;

@Data
public class BaseAccountDTO {
    private Long accountId;
    private String fullName;
    private String email;
    private String phone;
}
