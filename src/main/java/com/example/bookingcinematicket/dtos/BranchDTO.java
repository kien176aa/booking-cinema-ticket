package com.example.bookingcinematicket.dtos;

import lombok.Data;

@Data
public class BranchDTO {
    private Long branchId;
    private String name;
    private String address;
    private String phone;
    private String email;
    private String lat;
    private String lng;
    private Boolean status;
}
