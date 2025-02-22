package com.example.bookingcinematicket.repository;

import com.example.bookingcinematicket.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {
}
