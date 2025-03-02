package com.example.bookingcinematicket.repository;

import com.example.bookingcinematicket.entity.Promotion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;

public interface PromotionRepository extends JpaRepository<Promotion, Long> {
    @Query("delete from Promotion p where p.promotionId = :id")
    @Modifying
    void deleteByProId(Long id);

    @Query("select r from Promotion r where (:name is null or lower(r.title) like %:name%) and r.branch.branchId = :branchId " +
            "and (:status is null or r.status = :status) " +
            "and (:startDate is null or r.startDate >= :startDate) " +
            "and (:endDate is null or r.endDate <= :endDate)")
    Page<Promotion> search(String name, String branchId, Boolean status, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

    boolean existsByTitleAndBranch_BranchId(String title, Long branchBranchId);

    boolean existsByTitleAndBranch_BranchIdAndPromotionIdNot(String title, Long branchBranchId, Long id);
}
