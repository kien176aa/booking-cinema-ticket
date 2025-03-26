package com.example.bookingcinematicket.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.bookingcinematicket.entity.Movie;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MovieRepository extends JpaRepository<Movie, Long> {
    @Query("select m from Movie m where :condition is null or lower(m.title) like %:condition% "
            + "or lower(m.genre) like %:condition% or lower(m.country) like %:condition% ")
    Page<Movie> search(String condition, Pageable pageable);

    boolean existsByTitle(String title);

    boolean existsByTitleAndMovieIdNot(String title, Long id);

    @Query("select m from Movie m order by m.rating desc")
    List<Movie> findTopMovie(Pageable pageable);

    @Query(value = """
    SELECT DISTINCT m.* 
    FROM movies m
    WHERE m.genre REGEXP REPLACE(:genre, ',', '|')
    AND m.movie_id <> :movieId
    ORDER BY m.rating DESC
    LIMIT 5
""", nativeQuery = true)
    List<Movie> findTop5MovieSameGenre(@Param("genre") String genre, @Param("movieId") Long movieId);


}
