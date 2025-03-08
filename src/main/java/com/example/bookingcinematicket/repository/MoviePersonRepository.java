package com.example.bookingcinematicket.repository;

import com.example.bookingcinematicket.entity.Food;
import com.example.bookingcinematicket.entity.MoviePerson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MoviePersonRepository extends JpaRepository<MoviePerson, Long> {
    @Modifying
    @Query("delete from MoviePerson where person.personId = :personId and movie.movieId = :movieId ")
    void deleteByPerson_PersonIdAndMovie_MovieId(Long personId, Long movieId);

    @Query("select mp from MoviePerson mp where mp.movie.movieId = :movieId " +
            "and (:keyWord is null or lower(mp.person.name) like %:keyWord% " +
            "   or lower(mp.characterName) like %:keyWord% )")
    List<MoviePerson> search(Long movieId, String keyWord);

    @Query("select mp from MoviePerson mp where mp.movie.movieId = :movieId and mp.person.personId = :personPersonId")
    MoviePerson findByMovieIdAndPersonId(Long movieId, Long personPersonId);

    @Modifying
    @Query("delete from MoviePerson mp where mp.movie.movieId = :movieId")
    void deleteByMovieId(Long movieId);
}
