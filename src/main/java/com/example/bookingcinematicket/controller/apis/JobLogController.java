package com.example.bookingcinematicket.controller.apis;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.bookingcinematicket.controller.BaseController;
import com.example.bookingcinematicket.entity.JobLog;
import com.example.bookingcinematicket.repository.JobLogRepository;

@RestController
@RequestMapping("/job-log")
public class JobLogController extends BaseController {
    @Autowired
    private JobLogRepository jobLogRepository;

    @GetMapping
    public JobLog getJobLog(@RequestParam String videoId) {
        JobLog jobLog = jobLogRepository.findByReferId(videoId);
        if (jobLog == null) jobLog = new JobLog();
        return jobLog;
    }
}
