package com.example.bookingcinematicket.repository;

import com.example.bookingcinematicket.entity.Food;
import com.example.bookingcinematicket.entity.FoodOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FoodOrderRepository extends JpaRepository<FoodOrder, Long> {
}
