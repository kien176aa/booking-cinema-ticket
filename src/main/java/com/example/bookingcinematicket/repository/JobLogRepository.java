package com.example.bookingcinematicket.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.bookingcinematicket.entity.JobLog;

@Repository
public interface JobLogRepository extends JpaRepository<JobLog, Long> {

    JobLog findByReferId(String videoId);
}
