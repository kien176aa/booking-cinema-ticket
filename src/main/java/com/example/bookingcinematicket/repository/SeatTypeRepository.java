package com.example.bookingcinematicket.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.bookingcinematicket.entity.SeatType;

public interface SeatTypeRepository extends JpaRepository<SeatType, Long> {
    @Query(
            "select s from SeatType s where (:name is null or lower(s.typeName) like %:name%) and s.branch.branchId = :branchId "
                    + "and (:status is null or s.status = :status)")
    Page<SeatType> search(String name, String branchId, Boolean status, Pageable pageable);

    boolean existsByTypeNameAndBranch_BranchId(String typeName, Long branchId);

    boolean existsByTypeNameAndBranch_BranchIdAndSeatTypeIdNot(String typeName, Long branchId, Long id);

    boolean existsByColorAndBranch_BranchIdAndSeatTypeIdNot(String color, Long branchId, Long id);
}
