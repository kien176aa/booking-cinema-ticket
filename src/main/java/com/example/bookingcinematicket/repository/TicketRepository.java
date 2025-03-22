package com.example.bookingcinematicket.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.bookingcinematicket.entity.Ticket;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    @Query("select s.seat.seatNumber from Ticket s where s.showtime.showtimeId = :showtimeId")
    List<String> findBookedSeat(Long showtimeId);
}
