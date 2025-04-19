package com.example.bookingcinematicket.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.bookingcinematicket.entity.Booking;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("select b from Booking b where (:startTime is null or DATE(b.bookingDate) >= :startTime) " +
            "and (:endTime is null or DATE(b.bookingDate) <= :endTime) " +
            "and (:minPrice is null or b.totalAmount >= :minPrice) " +
            "and (:maxPrice is null or b.totalAmount <= :maxPrice) " +
            "and (:keyWord is null or lower(b.account.fullName) like %:keyWord% " +
            "   or lower(b.account.email) like %:keyWord% " +
            "   or exists (select 1 from b.tickets t where lower(t.showtime.movie.title) like %:keyWord%)) " +
            "and (:isSearchByAccountId = false or b.account.accountId = :accountId)")
    Page<Booking> search(LocalDate startTime, LocalDate endTime, Double minPrice, Double maxPrice,
                         String keyWord, Boolean isSearchByAccountId, Long accountId, Pageable pageable);

    @Query("select sum(b.totalAmount) from Booking b where MONTH(b.bookingDate) = MONTH(CURRENT_DATE())")
    Double getTotalRevenues();

    @Query(value = """
    WITH letters AS (
        SELECT SUBSTRING('abcdefghijklmnopqrstuvwxyz', FLOOR(1 + (RAND() * 26)), 1) AS ch
    ),
    digits AS (
        SELECT SUBSTRING('0123456789', FLOOR(1 + (RAND() * 10)), 1) AS ch
    ),
    specials AS (
        SELECT SUBSTRING('!@#$%', FLOOR(1 + (RAND() * 5)), 1) AS ch
    ),
    all_chars AS (
        SELECT SUBSTRING('abcdefghijklmnopqrstuvwxyz0123456789!@#$%', n, 1) AS ch
        FROM (
            SELECT 1 AS n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION
            SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12 UNION
            SELECT 13 UNION SELECT 14 UNION SELECT 15 UNION SELECT 16 UNION SELECT 17 UNION SELECT 18 UNION
            SELECT 19 UNION SELECT 20 UNION SELECT 21 UNION SELECT 22 UNION SELECT 23 UNION SELECT 24 UNION
            SELECT 25 UNION SELECT 26 UNION SELECT 27 UNION SELECT 28 UNION SELECT 29 UNION SELECT 30 UNION
            SELECT 31 UNION SELECT 32 UNION SELECT 33 UNION SELECT 34 UNION SELECT 35 UNION SELECT 36
        ) AS numbers
    ),
    must_have AS (
        SELECT ch FROM letters
        UNION ALL
        SELECT ch FROM digits
        UNION ALL
        SELECT ch FROM specials
    ),
    filler AS (
        SELECT ch FROM all_chars ORDER BY RAND() LIMIT 3
    ),
    combined AS (
        SELECT ch FROM must_have
        UNION ALL
        SELECT ch FROM filler
    ),
    shuffled AS (
        SELECT ch FROM combined ORDER BY RAND()
    ),
    code AS (
        SELECT GROUP_CONCAT(ch SEPARATOR '') AS code FROM shuffled
    )
    SELECT CONCAT(:prefix, '-', code)
    FROM code
    WHERE NOT EXISTS (
        SELECT 1 FROM bookings WHERE booking_code = CONCAT(:prefix, '-', code)
    )
    LIMIT 1
""", nativeQuery = true)
    String generateSecureBookingCode(@Param("prefix") String prefix);

    @Query("SELECT b FROM Booking b " +
            "WHERE b.bookingCode = :code " +
            "AND EXISTS (SELECT 1 FROM b.tickets t " +
            "WHERE FUNCTION('date', t.showtime.startTime) = CURRENT_DATE)")
    Booking findByBookingCode(@Param("code") String code);

}
