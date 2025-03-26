package com.example.bookingcinematicket.repository;

import com.example.bookingcinematicket.entity.Account;
import com.example.bookingcinematicket.entity.Rating;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    Rating findByAccount_AccountIdAndMovie_MovieId(Long accountId, Long movieId);
}
