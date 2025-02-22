package com.example.bookingcinematicket.repository;

import com.example.bookingcinematicket.entity.Account;
import com.example.bookingcinematicket.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepository extends JpaRepository<Account, Long> {
    Account findByEmail(String email);
}
