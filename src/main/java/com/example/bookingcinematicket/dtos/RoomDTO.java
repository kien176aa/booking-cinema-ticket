package com.example.bookingcinematicket.dtos;

import lombok.Data;

@Data
public class RoomDTO {
    private Long roomId;
    private Long branchId;
    private String name;
    private Integer capacity;
    private String roomType;
    private Boolean status;
}

