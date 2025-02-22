package com.example.bookingcinematicket.repository;

import com.example.bookingcinematicket.entity.Food;
import com.example.bookingcinematicket.entity.MoviePerson;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MoviePersonRepository extends JpaRepository<MoviePerson, Long> {
}
