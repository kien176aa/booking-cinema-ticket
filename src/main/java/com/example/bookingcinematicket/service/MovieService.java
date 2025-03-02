package com.example.bookingcinematicket.service;

import com.example.bookingcinematicket.constants.SystemMessage;
import com.example.bookingcinematicket.dtos.FoodDTO;
import com.example.bookingcinematicket.dtos.MovieDTO;
import com.example.bookingcinematicket.dtos.common.SearchRequest;
import com.example.bookingcinematicket.dtos.common.SearchResponse;
import com.example.bookingcinematicket.entity.Food;
import com.example.bookingcinematicket.entity.Movie;
import com.example.bookingcinematicket.exception.CustomException;
import com.example.bookingcinematicket.repository.FoodRepository;
import com.example.bookingcinematicket.repository.MovieRepository;
import com.example.bookingcinematicket.utils.ConvertUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@Slf4j
public class MovieService {
    @Autowired
    private MovieRepository movieRepository;
    @Autowired
    private ImgurService imgurService;
    @Autowired
    private ApiVideoService apiVideoService;

    public SearchResponse<List<MovieDTO>> search(SearchRequest<String, Movie> request) {
        if(request.getCondition() != null)
            request.setCondition(request.getCondition().toLowerCase().trim());
        Page<Movie> movies = movieRepository.search(
                request.getCondition(),
                request.getPageable(Movie.class)
        );
        SearchResponse<List<MovieDTO>> response = new SearchResponse<>();
        response.setData(ConvertUtils.convertList(movies.getContent(), MovieDTO.class));
        response.setPageSize(request.getPageSize());
        response.setPageIndex(request.getPageIndex());
        response.setTotalRecords(movies.getTotalElements());
        return response;
    }

    public MovieDTO getById(Long id) {
        Movie movie = movieRepository.findById(id).orElseThrow(() -> new CustomException(SystemMessage.MOVIE_NOT_FOUND));
        return ConvertUtils.convert(movie, MovieDTO.class);
    }

    public MovieDTO create(MovieDTO dto, MultipartFile file, MultipartFile video) {
        log.info("Creating food {}", dto);
        boolean exists = movieRepository.existsByTitle(dto.getTitle());
        if (exists) {
            throw new CustomException(SystemMessage.MOVIE_TITLE_IS_EXISTED);
        }
        if(file != null){
            try{
                dto.setPosterUrl(imgurService.uploadImageToImgur(file));
            }catch (Exception ex){
                log.error("upload img: {}", ex.getMessage(), ex);
                throw new CustomException(SystemMessage.ERROR_500);
            }
        }
        String vId = "";
        if(video != null){
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
        Movie movie = movieRepository.findById(id).orElseThrow(() -> new CustomException(SystemMessage.MOVIE_NOT_FOUND));

        boolean exists = movieRepository.existsByTitleAndMovieIdNot(dto.getTitle(), id);
        if (exists) {
            throw new CustomException(SystemMessage.MOVIE_TITLE_IS_EXISTED);
        }
        if(file != null){
            try{
                movie.setPosterUrl(imgurService.uploadImageToImgur(file));
            }catch (Exception ex){
                log.error("upload img: {}", ex.getMessage(), ex);
                throw new CustomException(SystemMessage.ERROR_500);
            }
        }
        String vId = "";
        if(video != null){
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
}
