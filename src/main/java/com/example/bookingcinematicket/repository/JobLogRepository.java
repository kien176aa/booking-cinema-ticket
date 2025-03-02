package com.example.bookingcinematicket.repository;

import com.example.bookingcinematicket.entity.Branch;
import com.example.bookingcinematicket.entity.JobLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobLogRepository extends JpaRepository<JobLog, Long> {

    JobLog findByReferId(String videoId);
}
