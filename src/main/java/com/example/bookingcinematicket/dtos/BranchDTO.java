package com.example.bookingcinematicket.dtos;


import lombok.Data;
import java.util.List;

@Data
public class BranchDTO {
    private Long branchId;
    private String name;
    private String address;
    private String phone;
    private String email;
    private Boolean status;
    private List<Long> roomIds;
}
