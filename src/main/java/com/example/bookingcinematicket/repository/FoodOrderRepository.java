package com.example.bookingcinematicket.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.bookingcinematicket.entity.FoodOrder;

public interface FoodOrderRepository extends JpaRepository<FoodOrder, Long> {}
