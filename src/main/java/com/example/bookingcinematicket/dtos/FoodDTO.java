package com.example.bookingcinematicket.dtos;

import lombok.Data;

@Data
public class FoodDTO {
    private Long foodId;
    private String foodName;
    private Double price;
    private String image;
    private Integer quantity;
    private Boolean status;
}
