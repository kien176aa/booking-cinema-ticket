package com.example.bookingcinematicket.repository;

import com.example.bookingcinematicket.entity.Food;
import com.example.bookingcinematicket.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByBranch_BranchId(Long branchId);

    boolean existsByNameAndBranch_BranchId(String name, Long branchId);

    boolean existsByNameAndBranch_BranchIdAndRoomIdNot(String name, Long branchId, Long id);
}
