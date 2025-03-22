package com.example.bookingcinematicket.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.bookingcinematicket.entity.Food;

import java.util.List;

public interface FoodRepository extends JpaRepository<Food, Long> {
    @Query("select f from Food f where :condition is null or lower(f.foodName) like %:condition% ")
    Page<Food> search(String condition, Pageable pageable);

    boolean existsByFoodName(String foodName);

    @Query("select f from Food f where f.foodName = :name and f.foodId <> :id ")
    Food existsByFoodNameAndFoodIdNot(String name, Long id);

    @Query("select f from Food f where f.status = true")
    List<Food> getActive();
}
