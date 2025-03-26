package com.example.bookingcinematicket.controller.mvc;

import com.example.bookingcinematicket.entity.Rating;
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

    @GetMapping("/movie/{id}")
    public String viewClientDetailsPage(@PathVariable Long id, Model model) {
        try {
            Movie movie = movieService.getByIdMvc(id);
            Account account = getCurrentUser();
            model.addAttribute("account", account);
            String yourRating = "Bạn chưa đánh giá cho bộ phim này.";
            if(movie.getRatings() != null){
                Rating rating = movie.getRatings().stream().filter(
                        item -> item.getMovie().getMovieId().equals(id)
                            && item.getAccount().getAccountId().equals(getCurrentUser().getAccountId())
                ).findFirst().orElse(null);
                if(rating != null)
                    yourRating = "Bạn đã đánh giá " + rating.getRating() + " sao.";
            }
            model.addAttribute("yourRating", yourRating);
            model.addAttribute("movie", movie);
            model.addAttribute("movies", movieService.findTop5MovieSameGenre(movie.getMovieId(), movie.getGenre()));
            return "page/client-movie-detail";
        } catch (Exception e) {
            log.error(e.getMessage());
            return "not-found-error";
        }
    }

    @GetMapping("/movie-list")
    public String viewMovieList(Model model){
        return "page/movie-list";
    }
}
