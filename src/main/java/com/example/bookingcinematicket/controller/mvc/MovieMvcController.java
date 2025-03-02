package com.example.bookingcinematicket.controller.mvc;

import com.example.bookingcinematicket.dtos.MovieDTO;
import com.example.bookingcinematicket.service.MovieService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@Slf4j
public class MovieMvcController {
    @Autowired
    private MovieService movieService;
    @GetMapping("/movie-management")
    public String viewMovieManagementPage(){
        return "page/movie-page";
    }

    @GetMapping("/movie-detail/{id}")
    public String viewDetailsPage(@PathVariable Long id, Model model){
        try{
            MovieDTO dto = movieService.getById(id);
            model.addAttribute("movie", dto);
            return "page/movie-detail";
        }catch(Exception e){
            log.error(e.getMessage());
            return "not-found-error";
        }
    }
}
