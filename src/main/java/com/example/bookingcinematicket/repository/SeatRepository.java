package com.example.bookingcinematicket.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.example.bookingcinematicket.entity.Seat;

import java.util.List;

public interface SeatRepository extends JpaRepository<Seat, Long> {
    @Modifying
    @Query("delete from Seat s where s.room.roomId = :id")
    void deleteRoomId(Long id);
}
