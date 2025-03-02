package com.example.bookingcinematicket.repository;

import com.example.bookingcinematicket.entity.Food;
import com.example.bookingcinematicket.entity.Movie;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface MovieRepository extends JpaRepository<Movie, Long> {
    @Query("select m from Movie m where :condition is null or lower(m.title) like %:condition% " +
            "or lower(m.genre) like %:condition% or lower(m.country) like %:condition% ")
    Page<Movie> search(String condition, Pageable pageable);

    boolean existsByTitle(String title);

    boolean existsByTitleAndMovieIdNot(String title, Long id);
}
