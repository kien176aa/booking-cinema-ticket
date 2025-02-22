package com.example.bookingcinematicket.repository;

import com.example.bookingcinematicket.entity.Booking;
import com.example.bookingcinematicket.entity.Food;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FoodRepository extends JpaRepository<Food, Long> {
}
