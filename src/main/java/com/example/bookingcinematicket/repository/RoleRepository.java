package com.example.bookingcinematicket.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.bookingcinematicket.entity.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {
    @Query("select r from Role r where lower(r.name) like %:condition%")
    Page<Role> search(String condition, Pageable pageable);

    boolean existsByName(String name);

    boolean existsByNameAndRoleIdNot(String name, Long id);

    List<Role> findByStatus(boolean b);
}
