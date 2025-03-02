package com.example.bookingcinematicket.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CouponItemDTO {
    private Long id;
    private String code;
    private Boolean isUsed;
}
