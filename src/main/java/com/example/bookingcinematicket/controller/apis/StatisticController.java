package com.example.bookingcinematicket.controller.apis;

import com.example.bookingcinematicket.dtos.statistic.KeyValueStatistic;
import com.example.bookingcinematicket.dtos.statistic.TopCustomer;
import com.example.bookingcinematicket.service.StatisticService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/statistic")
public class StatisticController {
    @Autowired
    private StatisticService statisticService;
    @GetMapping("/get-top5-movies")
    public List<KeyValueStatistic<String, Double>> getTop5Movie(){
        return statisticService.getTop5Movie();
    }

    @GetMapping("/get-top5-foods")
    public List<KeyValueStatistic<String, Double>> getTop5Food(){
        return statisticService.getTop5Food();
    }

    @GetMapping("/get-top-customer")
    public List<TopCustomer> getTopCustomer(){
        return statisticService.getTopCustomer();
    }
}
