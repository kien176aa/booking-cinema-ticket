package com.example.bookingcinematicket.repository;

import com.example.bookingcinematicket.entity.Account;
import com.example.bookingcinematicket.entity.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface AccountRepository extends JpaRepository<Account, Long> {
    Account findByEmail(String email);
    @Query("select a from Account a where :condition is null or lower(a.email) like %:condition% " +
            "or lower(a.fullName) like %:condition%")
    Page<Account> search(String condition, Pageable pageable);

    boolean existsByEmail(String email);

    boolean existsByEmailAndAccountIdNot(String email, Long id);
}
