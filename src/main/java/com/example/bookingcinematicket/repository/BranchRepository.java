package com.example.bookingcinematicket.repository;

import com.example.bookingcinematicket.entity.Branch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BranchRepository extends JpaRepository<Branch, Long> {
    @Query("select b from Branch b where :name is null or b.name like %:name%")
    List<Branch> findBranchByName(String name);

    boolean existsByName(String name);

    boolean existsByNameAndBranchIdNot(String name, Long id);
}
