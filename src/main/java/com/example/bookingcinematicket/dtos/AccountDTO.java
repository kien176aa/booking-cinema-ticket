package com.example.bookingcinematicket.dtos;


import lombok.Data;

@Data
public class AccountDTO {
    private Long accountId;
    private String fullName;
    private String email;
    private String phone;
    private String password;
    private String role;
    private Boolean active;
}
