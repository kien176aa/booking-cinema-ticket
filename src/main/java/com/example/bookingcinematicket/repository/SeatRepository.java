package com.example.bookingcinematicket.repository;

import com.example.bookingcinematicket.entity.Food;
import com.example.bookingcinematicket.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SeatRepository extends JpaRepository<Seat, Long> {
}
