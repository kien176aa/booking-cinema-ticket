package com.example.bookingcinematicket.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.bookingcinematicket.constants.SystemMessage;
import com.example.bookingcinematicket.dtos.MovieDTO;
import com.example.bookingcinematicket.dtos.MoviePersonDTO;
import com.example.bookingcinematicket.dtos.common.SearchRequest;
import com.example.bookingcinematicket.dtos.common.SearchResponse;
import com.example.bookingcinematicket.dtos.movie.SearchMoviePersonRequest;
import com.example.bookingcinematicket.dtos.movie.UpdatePersonMovie;
import com.example.bookingcinematicket.entity.*;
import com.example.bookingcinematicket.exception.CustomException;
import com.example.bookingcinematicket.repository.*;
import com.example.bookingcinematicket.utils.ConvertUtils;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class MovieService {
    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private MoviePersonRepository moviePersonRepository;

    @Autowired
    private ImgurService imgurService;

    @Autowired
    private ApiVideoService apiVideoService;

    public SearchResponse<List<MovieDTO>> search(SearchRequest<String, Movie> request) {
        if (request.getCondition() != null)
            request.setCondition(request.getCondition().toLowerCase().trim());
        Page<Movie> movies = movieRepository.search(request.getCondition(), request.getPageable(Movie.class));
        SearchResponse<List<MovieDTO>> response = new SearchResponse<>();
        response.setData(ConvertUtils.convertList(movies.getContent(), MovieDTO.class));
        response.setPageSize(request.getPageSize());
        response.setPageIndex(request.getPageIndex());
        response.setTotalRecords(movies.getTotalElements());
        return response;
    }

    public MovieDTO getById(Long id) {
        Movie movie =
                movieRepository.findById(id).orElseThrow(() -> new CustomException(SystemMessage.MOVIE_NOT_FOUND));
        return ConvertUtils.convert(movie, MovieDTO.class);
    }

    public Movie getByIdMvc(Long id) {
        return movieRepository.findById(id).orElseThrow(() -> new CustomException(SystemMessage.MOVIE_NOT_FOUND));
    }

    public MovieDTO create(MovieDTO dto, MultipartFile file, MultipartFile video) {
        log.info("Creating food {}", dto);
        boolean exists = movieRepository.existsByTitle(dto.getTitle());
        if (exists) {
            throw new CustomException(SystemMessage.MOVIE_TITLE_IS_EXISTED);
        }
        if (file != null) {
            try {
                dto.setPosterUrl(imgurService.uploadImageToImgur(file));
            } catch (Exception ex) {
                log.error("upload img: {}", ex.getMessage(), ex);
                throw new CustomException(SystemMessage.ERROR_500);
            }
        }
        String vId = "";
        if (video != null) {
            vId = apiVideoService.createVideo(video.getOriginalFilename());
            dto.setTrailerUrl(apiVideoService.getUrlByVideoId(vId));
            apiVideoService.uploadVideoAsync(vId, dto.getTitle(), video);
        }
        Movie movie = ConvertUtils.convert(dto, Movie.class);
        movie.setStatus(true);
        movieRepository.save(movie);
        dto = ConvertUtils.convert(movie, MovieDTO.class);
        dto.setVideoId(vId);
        return dto;
    }

    public MovieDTO update(Long id, MovieDTO dto, MultipartFile file, MultipartFile video) {
        Movie movie =
                movieRepository.findById(id).orElseThrow(() -> new CustomException(SystemMessage.MOVIE_NOT_FOUND));

        boolean exists = movieRepository.existsByTitleAndMovieIdNot(dto.getTitle(), id);
        if (exists) {
            throw new CustomException(SystemMessage.MOVIE_TITLE_IS_EXISTED);
        }
        if (file != null) {
            try {
                movie.setPosterUrl(imgurService.uploadImageToImgur(file));
            } catch (Exception ex) {
                log.error("upload img: {}", ex.getMessage(), ex);
                throw new CustomException(SystemMessage.ERROR_500);
            }
        }
        String vId = "";
        if (video != null) {
            vId = apiVideoService.createVideo(video.getOriginalFilename());
            dto.setTrailerUrl(vId);
            movie.setTrailerUrl(apiVideoService.getUrlByVideoId(vId));
            apiVideoService.uploadVideoAsync(vId, dto.getTitle(), video);
        }
        movie.setTitle(dto.getTitle());
        movie.setGenre(dto.getGenre());
        movie.setCountry(dto.getCountry());
        movie.setLanguage(dto.getLanguage());
        movie.setDuration(dto.getDuration());
        movie.setDescription(dto.getDescription());
        movie.setStatus(dto.getStatus());
        movieRepository.save(movie);
        dto = ConvertUtils.convert(movie, MovieDTO.class);
        dto.setVideoId(vId);
        return dto;
    }

    public HashMap<String, List<MoviePersonDTO>> searchPersonByMovie(
            SearchRequest<SearchMoviePersonRequest, MoviePerson> request) {
        request.getCondition().validateInput();
        List<MoviePerson> moviePeople = moviePersonRepository.search(
                request.getCondition().getMovieId(), request.getCondition().getKeyWord());
        HashMap<String, List<MoviePersonDTO>> map = new HashMap<>();
        String role;
        for (MoviePerson mp : moviePeople) {
            role = mp.getRole().getName();
            if (map.containsKey(role)) {
                List<MoviePersonDTO> mps = map.get(role);
                mps.add(ConvertUtils.convert(mp, MoviePersonDTO.class));
            } else {
                List<MoviePersonDTO> newList = new ArrayList<>();
                newList.add(ConvertUtils.convert(mp, MoviePersonDTO.class));
                map.put(role, newList);
            }
        }
        return map;
    }

    public void removePersonFromMovie(Long personId, Long movieId) {
        moviePersonRepository.deleteByPerson_PersonIdAndMovie_MovieId(personId, movieId);
    }

    @Transactional
    public void updatePersonToMovie(UpdatePersonMovie request) {
        request.validateInput();
        Movie movie = movieRepository
                .findById(request.getMovieId())
                .orElseThrow(() -> new CustomException(SystemMessage.MOVIE_NOT_FOUND));
        moviePersonRepository.deleteByMovieId(request.getMovieId());
        List<MoviePerson> mps = new ArrayList<>();
        for (MoviePersonDTO dto : request.getMoviePersonDTOs()) {
            MoviePerson mp =
                    moviePersonRepository.findByMovieIdAndPersonId(movie.getMovieId(), dto.getPersonPersonId());
            if (mp == null) {
                mp = new MoviePerson();
                mp.setMovie(movie);
                mp.setPerson(new Person());
                mp.getPerson().setPersonId(dto.getPersonPersonId());
                mp.setRole(new Role());
                mp.getRole().setRoleId(dto.getRoleRoleId());
            } else {
                mp.setPerson(new Person());
                mp.getPerson().setPersonId(dto.getPersonPersonId());
                mp.setRole(new Role());
                mp.getRole().setRoleId(dto.getRoleRoleId());
            }
            mp.setCharacterName(dto.getCharacterName());
            mp.setRoleArr(dto.getRoleArr());
            moviePersonRepository.save(mp);
            //            mps.add(mp);
        }
        //        moviePersonRepository.saveAll(mps);
    }

    public List<Movie> getTopMovie() {
         PageRequest pageRequest = PageRequest.of(0, 20);
        return movieRepository.findTopMovie(pageRequest);
    }
}
