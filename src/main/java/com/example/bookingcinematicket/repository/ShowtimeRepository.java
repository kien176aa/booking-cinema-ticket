package com.example.bookingcinematicket.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.bookingcinematicket.entity.Showtime;

@Repository
public interface ShowtimeRepository extends JpaRepository<Showtime, Long> {
    @Query("select s from Showtime s where s.branch.branchId = :branchBranchId "
            + "and (:roomRoomId is null or s.room.roomId = :roomRoomId) "
            + "and (:movieMovieId is null or s.movie.movieId = :movieMovieId) "
            + "and (:startTime is null or s.startTime >= :startTime) "
            + "and (:endTime is null or s.endTime <= :endTime) "
            + "and (:status is null or lower(s.status) like %:status%)")
    Page<Showtime> search(
            Long branchBranchId,
            Long roomRoomId,
            Long movieMovieId,
            LocalDateTime startTime,
            LocalDateTime endTime,
            String status,
            Pageable pageable);

    Showtime findByShowtimeIdAndBranch_BranchId(Long showtimeId, Long branchId);

    @Modifying
    @Query("delete from Showtime s where s.showtimeId in (:deleteIds)")
    void deleteByShowtimeId(List<Long> deleteIds);

    @Query("select s.showtimeId from Showtime s where s.branch.branchId = :branchId "
            + "and (s.movie.movieId = :movieId) and (s.room.roomId = :roomId) ")
    List<Long> findIdExist(Long branchId, Long movieId, Long roomId);

    @Query("SELECT s FROM Showtime s WHERE s.branch.branchId = :branchId " + "AND s.room.roomId = :roomId "
            + "AND s.movie.movieId <> :movieId "
            + "AND (:startTime < s.endTime AND :endTime > s.startTime)")
    List<Showtime> findOverlappingShowtimes(
            Long branchId, Long roomId, Long movieId, LocalDateTime startTime, LocalDateTime endTime);

    @Query("SELECT s FROM Showtime s WHERE DATE(s.startTime) = :date and s.branch.branchId = :branchId ORDER BY s.startTime")
    List<Showtime> findShowtimesByDate(@Param("date") LocalDate date, @Param("branchId") Long branchId);
    @Query("select s from Showtime s where s.showtimeId in (:ids)")
    List<Showtime> findByIds(List<Long> ids);
}
