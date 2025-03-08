package com.example.bookingcinematicket.repository;

import com.example.bookingcinematicket.entity.Food;
import com.example.bookingcinematicket.entity.Person;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PersonRepository extends JpaRepository<Person, Long> {

    @Query("select p from Person p where :condition is null or lower(p.name) like %:condition% " +
            "or lower(p.nationality) like %:condition% or exists (select 1 from p.moviePersons mp " +
            "   where lower(mp.role.name) like %:condition% )")
    Page<Person> search(String condition, Pageable pageable);
    @Query("select p from Person p where p.status = true and (:condition is null or lower(p.name) like %:condition% " +
            "or lower(p.nationality) like %:condition% or exists (select 1 from p.moviePersons mp " +
            "   where lower(mp.role.name) like %:condition% ))")
    Page<Person> searchActivePerson(String condition, Pageable pageable);
}
