package com.example.bookingcinematicket.repository;

import com.example.bookingcinematicket.entity.Branch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BranchRepository extends JpaRepository<Branch, Long> {
    @Query("select b from Branch b where (:name is null or b.name like %:name%) and b.status = true ")
    List<Branch> findBranchByName(String name);

    boolean existsByName(String name);

    boolean existsByNameAndBranchIdNot(String name, Long id);

    @Query("select b from Branch b where :name is null or lower(b.name) like %:name%")
    Page<Branch> search(String name, Pageable pageable);
}
