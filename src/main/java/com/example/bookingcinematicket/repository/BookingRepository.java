package com.example.bookingcinematicket.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.bookingcinematicket.entity.Booking;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.time.LocalDateTime;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("select b from Booking b where (:startTime is null or DATE(b.bookingDate) >= :startTime) " +
            "and (:endTime is null or DATE(b.bookingDate) <= :endTime) " +
            "and (:minPrice is null or b.totalAmount >= :minPrice) " +
            "and (:maxPrice is null or b.totalAmount <= :maxPrice) " +
            "and (:keyWord is null or lower(b.account.fullName) like %:keyWord% " +
            "   or exists (select 1 from b.tickets t where lower(t.showtime.movie.title) like %:keyWord%)) " +
            "and (:isSearchByAccountId = false or b.account.accountId = :accountId)")
    Page<Booking> search(LocalDate startTime, LocalDate endTime, Double minPrice, Double maxPrice,
                         String keyWord, Boolean isSearchByAccountId, Long accountId, Pageable pageable);

    @Query("select sum(b.totalAmount) from Booking b where MONTH(b.bookingDate) = MONTH(CURRENT_DATE())")
    Double getTotalRevenues();
}
