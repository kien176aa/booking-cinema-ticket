package com.example.bookingcinematicket.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.bookingcinematicket.entity.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {

}
