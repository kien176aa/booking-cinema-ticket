package com.example.bookingcinematicket.repository;

import com.example.bookingcinematicket.entity.Food;
import com.example.bookingcinematicket.entity.Person;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonRepository extends JpaRepository<Person, Long> {
}
