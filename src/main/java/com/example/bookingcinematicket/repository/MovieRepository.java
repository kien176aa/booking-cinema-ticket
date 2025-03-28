package com.example.bookingcinematicket.repository;

import com.example.bookingcinematicket.dtos.statistic.BestMovieProjection;
import com.example.bookingcinematicket.dtos.statistic.IKeyValueStatistic;
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

    @Query(value = "WITH movie_revenues AS (\n" +
            "    SELECT\n" +
            "        s.movie_id,\n" +
            "        SUM(t.price) AS total_revenue,\n" +
            "        SUM(SUM(t.price)) OVER () AS total_all_movies\n" +
            "    FROM showtimes s\n" +
            "             LEFT JOIN tickets t ON s.showtime_id = t.showtime_id\n" +
            "    WHERE MONTH(s.start_time) = MONTH(CURRENT_DATE())\n" +
            "    GROUP BY s.movie_id\n" +
            ")\n" +
            "SELECT\n" +
            "    m.title,\n" +
            "    m.genre,\n" +
            "    total_revenue AS totalRevenue,\n" +
            "    ROUND((total_revenue * 100.0 / total_all_movies), 2) AS revenuePercentage\n" +
            "FROM movie_revenues mr\n" +
            "join movies m on m.movie_id = mr.movie_id\n" +
            "ORDER BY total_revenue DESC\n" +
            "LIMIT 1", nativeQuery = true)
    BestMovieProjection getTopMovieOfMonth();

    @Query("select count(m) from Movie m where MONTH(m.releaseDate) = MONTH(CURRENT_DATE())")
    Integer getTotalMovies();

    @Query(value = "WITH movie_revenues AS (\n" +
            "    SELECT\n" +
            "        s.movie_id,\n" +
            "        SUM(t.price) AS total_revenue\n" +
            "    FROM showtimes s\n" +
            "             LEFT JOIN tickets t ON s.showtime_id = t.showtime_id\n" +
            "    WHERE MONTH(s.start_time) = MONTH(CURRENT_DATE())\n" +
            "    GROUP BY s.movie_id\n" +
            ")\n" +
            "SELECT\n" +
            "    m.title AS keyV,\n" +
            "    total_revenue AS value\n" +
            "FROM movie_revenues mr\n" +
            "join movies m on m.movie_id = mr.movie_id\n" +
            "ORDER BY total_revenue DESC\n" +
            "LIMIT 5", nativeQuery = true)
    List<IKeyValueStatistic<String, Double>> getTop5Movie();
}
