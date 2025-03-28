package com.example.bookingcinematicket.repository;

import java.util.List;
import java.util.Optional;

import com.example.bookingcinematicket.dtos.statistic.ITopCustomer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.bookingcinematicket.entity.Account;

public interface AccountRepository extends JpaRepository<Account, Long> {
    Account findByEmail(String email);

    @Query(
            "select a from Account a where a.accountId <> :id and (:condition is null or lower(a.email) like %:condition% "
                    + "or lower(a.fullName) like %:condition%)")
    Page<Account> search(String condition, Long id, Pageable pageable);

    boolean existsByEmail(String email);

    boolean existsByEmailAndAccountIdNot(String email, Long id);

    @Query("select a from Account a where a.accountId = :accountId")
    Optional<Account> findByAccountId(Long accountId);

    @Query("select count(c) from Account c where c.role = 'USER'")
    Integer getTotalCustomers();

    @Query(value = "select sum(b.total_amount) as totalAmount, a.full_name as fullName, a.email, a.phone from bookings b\n" +
            "join accounts a on b.account_id = a.account_id\n" +
            "where month(b.booking_date) = month(CURRENT_DATE)\n" +
            "group by a.full_name, a.email, a.phone\n" +
            "order by totalAmount desc limit 10", nativeQuery = true)
    List<ITopCustomer> getTopCustomer();
}
