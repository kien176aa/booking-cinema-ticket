package com.example.bookingcinematicket.controller.apis;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.bookingcinematicket.controller.BaseController;
import com.example.bookingcinematicket.dtos.MovieDTO;
import com.example.bookingcinematicket.dtos.MoviePersonDTO;
import com.example.bookingcinematicket.dtos.common.SearchRequest;
import com.example.bookingcinematicket.dtos.common.SearchResponse;
import com.example.bookingcinematicket.dtos.movie.SearchMoviePersonRequest;
import com.example.bookingcinematicket.dtos.movie.UpdatePersonMovie;
import com.example.bookingcinematicket.entity.Movie;
import com.example.bookingcinematicket.entity.MoviePerson;
import com.example.bookingcinematicket.service.MovieService;

import lombok.extern.slf4j.Slf4j;

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

    @PostMapping("/search-movie-person")
    public HashMap<String, List<MoviePersonDTO>> searchMoviePerson(
            @RequestBody SearchRequest<SearchMoviePersonRequest, MoviePerson> request) {
        return movieService.searchPersonByMovie(request);
    }

    @GetMapping("/{id}")
    public MovieDTO getBranchById(@PathVariable Long id) {
        return movieService.getById(id);
    }

    @PostMapping
    @PreAuthorize("@securityService.hasPermission('ROLE_ADMIN')")
    public MovieDTO create(
            @ModelAttribute MovieDTO movieDTO,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @RequestPart(value = "video", required = false) MultipartFile video) {
        return movieService.create(movieDTO, file, video);
    }

    @PutMapping("/{id}")
    @PreAuthorize("@securityService.hasPermission('ROLE_ADMIN')")
    public MovieDTO update(
            @PathVariable("id") Long id,
            @ModelAttribute MovieDTO movieDTO,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @RequestPart(value = "video", required = false) MultipartFile video) {
        return movieService.update(id, movieDTO, file, video);
    }

    @PutMapping("/update-person-movie")
    @PreAuthorize("@securityService.hasPermission('ROLE_ADMIN')")
    public void updatePersonMovie(@RequestBody UpdatePersonMovie req) {
        movieService.updatePersonToMovie(req);
    }

    @PutMapping("/rating")
    @PreAuthorize("@securityService.hasPermission('ROLE_ADMIN', 'ROLE_USER')")
    public float ratingMovie(@RequestParam Long movieId, @RequestParam Integer rating) {
        return movieService.ratingMovie(movieId, rating, getCurrentUser());
    }

    @DeleteMapping("/{id}/remove-person/{personId}")
    @PreAuthorize("@securityService.hasPermission('ROLE_ADMIN')")
    public void removePersonFromMovie(@PathVariable("id") Long id, @PathVariable("personId") Long personId) {
        movieService.removePersonFromMovie(personId, id);
    }
}
