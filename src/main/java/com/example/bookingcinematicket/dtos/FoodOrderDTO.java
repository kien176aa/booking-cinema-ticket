package com.example.bookingcinematicket.dtos;

import lombok.Data;

@Data
public class FoodOrderDTO {
    private Long foodId;
    private String foodFoodName;
    private Double price;
    private Integer quantity;

}
