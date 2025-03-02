package com.example.bookingcinematicket.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SeatTypeDTO {
    private Long seatTypeId;
    private String typeName;
    private String color;
    private Double price;
    private Boolean status;
    private Boolean isDefault;
    private Long branchBranchId;
    private String branchName;
}
