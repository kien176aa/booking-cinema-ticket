package com.example.bookingcinematicket.repository;

import com.example.bookingcinematicket.entity.Branch;
import com.example.bookingcinematicket.entity.Food;
import com.example.bookingcinematicket.entity.Room;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByBranch_BranchId(Long branchId);

    boolean existsByNameAndBranch_BranchId(String name, Long branchId);

    boolean existsByNameAndBranch_BranchIdAndRoomIdNot(String name, Long branchId, Long id);
    @Query("select r from Room r where (:name is null or lower(r.name) like %:name%) and r.branch.branchId = :branchId " +
            "and (:status is null or r.status = :status)")
    Page<Room> search(String name, String branchId, Boolean status, Pageable pageable);
}
