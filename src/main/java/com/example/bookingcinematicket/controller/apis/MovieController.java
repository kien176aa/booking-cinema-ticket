package com.example.bookingcinematicket.controller.apis;

import com.example.bookingcinematicket.constants.SystemMessage;
import com.example.bookingcinematicket.controller.BaseController;
import com.example.bookingcinematicket.dtos.FoodDTO;
import com.example.bookingcinematicket.dtos.MovieDTO;
import com.example.bookingcinematicket.dtos.common.SearchRequest;
import com.example.bookingcinematicket.dtos.common.SearchResponse;
import com.example.bookingcinematicket.entity.Food;
import com.example.bookingcinematicket.entity.Movie;
import com.example.bookingcinematicket.service.ApiVideoService;
import com.example.bookingcinematicket.service.FoodService;
import com.example.bookingcinematicket.service.MovieService;
import com.example.bookingcinematicket.service.VimeoService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/movies")
@Slf4j
public class MovieController extends BaseController {
    @Autowired
    private MovieService movieService;

    @PostMapping("/search")
    public SearchResponse<List<MovieDTO>> search(@RequestBody SearchRequest<String, Movie> request) {
        return movieService.search(request);
    }

    @GetMapping("/{id}")
    public MovieDTO getBranchById(@PathVariable Long id) {
        return movieService.getById(id);
    }

    @PostMapping
    public MovieDTO create(@ModelAttribute MovieDTO movieDTO,
                           @RequestPart(value = "file", required = false) MultipartFile file,
                           @RequestPart(value = "video", required = false) MultipartFile video) {
        return movieService.create(movieDTO, file, video);
    }

    @PutMapping("/{id}")
    public MovieDTO update(@PathVariable("id") Long id, @ModelAttribute MovieDTO movieDTO,
                                @RequestPart(value = "file", required = false) MultipartFile file,
                           @RequestPart(value = "video", required = false) MultipartFile video) {
        return movieService.update(id, movieDTO, file, video);
    }
}
