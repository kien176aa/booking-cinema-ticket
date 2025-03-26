package com.example.bookingcinematicket.controller.apis;

import com.example.bookingcinematicket.dtos.MovieDTO;
import com.example.bookingcinematicket.dtos.ShowtimeDTO;
import com.example.bookingcinematicket.service.MovieService;
import com.example.bookingcinematicket.service.ShowtimeService;
import com.example.bookingcinematicket.utils.ConvertUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/home")
public class HomeController {
    @Autowired
    private MovieService movieService;

    @Autowired
    private ShowtimeService showtimeService;

    @GetMapping("/get-top-movie")
    public List<MovieDTO> getTopMovie(){
        return ConvertUtils.convertList(movieService.getTopMovie(), MovieDTO.class);
    }

    @GetMapping("/get-showtimes-by-date")
    public List<ShowtimeDTO> getShowtimeByDate(@RequestParam LocalDate date, @RequestParam Long branchId,
                                               @RequestParam(required = false) Long movieId){
        return ConvertUtils.convertList(showtimeService.getShowtimesByDate(date, branchId, movieId), ShowtimeDTO.class);
    }
}
