package com.example.bookingcinematicket.controller.mvc;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.example.bookingcinematicket.controller.BaseController;
import com.example.bookingcinematicket.entity.Account;
import com.example.bookingcinematicket.entity.Movie;
import com.example.bookingcinematicket.service.MovieService;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
public class MovieMvcController extends BaseController {
    @Autowired
    private MovieService movieService;

    @GetMapping("/movie-management")
    public String viewMovieManagementPage(Model model) {
        Account account = getCurrentUser();
        model.addAttribute("account", account);
        return "page/movie-page";
    }

    @GetMapping("/movie-detail/{id}")
    public String viewDetailsPage(@PathVariable Long id, Model model) {
        try {
            Movie movie = movieService.getByIdMvc(id);
            Account account = getCurrentUser();
            //            Map<String, List<Showtime>> groupedShowtimes = movie.getShowtimes().stream()
            //                    .collect(Collectors.groupingBy(showtime -> showtime.getRoom().getName()));

            //            model.addAttribute("groupedShowtimes", groupedShowtimes);
            model.addAttribute("account", account);
            model.addAttribute("movie", movie);
            return "page/movie-detail";
        } catch (Exception e) {
            log.error(e.getMessage());
            return "not-found-error";
        }
    }
}
