package com.example.bookingcinematicket.service;

import com.example.bookingcinematicket.dtos.statistic.*;
import com.example.bookingcinematicket.repository.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
@Slf4j
public class StatisticService {
    @Autowired
    private MovieRepository movieRepository;
    @Autowired
    private TicketRepository ticketRepository;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private FoodOrderRepository foodOrderRepository;

    public BestMovieOfMonth getBestMovieOfMonth() {
        BestMovieProjection bestMovie = movieRepository.getTopMovieOfMonth();

        if (bestMovie == null) {
            return new BestMovieOfMonth();
        }
        NumberFormat vnFormat = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));
        String formattedRevenue = vnFormat.format(bestMovie.getTotalRevenue());
        BestMovieOfMonth res = new BestMovieOfMonth(
                bestMovie.getTitle(),
                bestMovie.getGenre(),
                formattedRevenue,
                bestMovie.getRevenuePercentage()
        );
        log.info(res.toString());
        return res;
    }

    public GeneralStatistic generalStatistic(){
        try{
            Integer totalTickets = ticketRepository.getTotalTicketsInMonth();
            Integer totalCustomers = accountRepository.getTotalCustomers();
            Integer totalMovies = movieRepository.getTotalMovies();
            Double totalRevenues = bookingRepository.getTotalRevenues();
            NumberFormat vnFormat = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));
            String formattedRevenue = vnFormat.format(totalRevenues);
            GeneralStatistic res = new GeneralStatistic(
                    totalTickets,
                    totalCustomers,
                    totalMovies,
                    formattedRevenue
            );
            log.info("general {}", res.toString());
            return res;
        }catch (Exception ex){
            log.error(ex.getMessage());
            return new GeneralStatistic();
        }
    }

    public List<KeyValueStatistic<String, Double>> getTop5Movie(){
        List<KeyValueStatistic<String, Double>> res = new ArrayList<>();
        List<IKeyValueStatistic<String, Double>> result = movieRepository.getTop5Movie();
        if(result == null){
            return res;
        }
        for (IKeyValueStatistic<String, Double> a : result) {
            res.add(new KeyValueStatistic<String, Double>(
                    a.getKeyV(),
                    a.getValue() != null ? a.getValue() : 0
            ));
        }
        log.info("keyValue1: {}", res.toString());
        return res;
    }

    public List<KeyValueStatistic<String, Double>> getTop5Food() {
        List<KeyValueStatistic<String, Double>> res = new ArrayList<>();
        List<IKeyValueStatistic<String, Double>> result = foodOrderRepository.getTop5Food();
        if(result == null){
            return res;
        }
        for (IKeyValueStatistic<String, Double> a : result) {
            res.add(new KeyValueStatistic<String, Double>(
                    a.getKeyV(),
                    a.getValue() != null ? a.getValue() : 0
            ));
        }
        log.info("keyValue2: {}", res.toString());
        return res;
    }

    public List<TopCustomer> getTopCustomer(){
        List<TopCustomer> res = new ArrayList<>();
        List<ITopCustomer> result = accountRepository.getTopCustomer();
        if(result == null){
            return res;
        }
        NumberFormat vnFormat = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));
        for (ITopCustomer a : result) {
            String formattedRevenue = vnFormat.format(a.getTotalAmount());
            res.add(new TopCustomer(
                    a.getFullName(),
                    a.getEmail(),
                    a.getPhone(),
                    formattedRevenue
            ));
        }
        return res;
    }
}
