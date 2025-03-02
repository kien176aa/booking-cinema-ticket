package com.example.bookingcinematicket.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomDTO {
    private Long roomId;
    private Long branchBranchId;
    private String branchName;
    private String name;
    private Integer capacity;
    private String roomType;
    private String seatMap;
    private Boolean status;
}
