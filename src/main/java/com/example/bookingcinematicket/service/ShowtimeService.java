package com.example.bookingcinematicket.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import com.example.bookingcinematicket.dtos.showtime.UpdatePriceRequest;
import com.example.bookingcinematicket.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.bookingcinematicket.constants.SystemMessage;
import com.example.bookingcinematicket.dtos.ShowtimeDTO;
import com.example.bookingcinematicket.dtos.common.SearchRequest;
import com.example.bookingcinematicket.dtos.common.SearchResponse;
import com.example.bookingcinematicket.dtos.showtime.SearchShowtimeRequest;
import com.example.bookingcinematicket.dtos.showtime.UpdateShowtimeRequest;
import com.example.bookingcinematicket.entity.Branch;
import com.example.bookingcinematicket.entity.Movie;
import com.example.bookingcinematicket.entity.Room;
import com.example.bookingcinematicket.entity.Showtime;
import com.example.bookingcinematicket.exception.CustomException;
import com.example.bookingcinematicket.utils.ConvertUtils;
import com.example.bookingcinematicket.utils.DateUtils;

@Service
public class ShowtimeService {
    @Autowired
    private ShowtimeRepository showtimeRepository;

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private BranchRepository branchRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private TicketRepository ticketRepository;

    public SearchResponse<List<ShowtimeDTO>> search(SearchRequest<SearchShowtimeRequest, Showtime> request) {
        Page<Showtime> showtimes = showtimeRepository.search(
                request.getCondition().getBranchId(),
                request.getCondition().getRoomId(),
                request.getCondition().getMovieId(),
                request.getCondition().getStartTime(),
                request.getCondition().getEndTime(),
                request.getCondition().getStatus(),
                request.getPageable(Showtime.class));
        SearchResponse<List<ShowtimeDTO>> response = new SearchResponse<>();
//        response.setData(ConvertUtils.convertList(showtimes.getContent(), ShowtimeDTO.class));
        List<ShowtimeDTO> dtos = new ArrayList<>();
        for (Showtime showtime : showtimes) {
            ShowtimeDTO dto = ConvertUtils.convert(showtime, ShowtimeDTO.class);
            dto.setCanEdit(!SystemMessage.SHOW_TIME_STATUS_SOLD_OUT.equals(showtime.getStatus())
                    && !LocalDateTime.now().isAfter(showtime.getStartTime()));
            dtos.add(dto);
        }
        response.setData(dtos);
        response.setPageSize(request.getPageSize());
        response.setPageIndex(request.getPageIndex());
        response.setTotalRecords(showtimes.getTotalElements());
        return response;
    }

    @Transactional
    public void updateShowtime(UpdateShowtimeRequest request) {
        request.validateInput();
        Branch branch = getBranch(request.getBranchId());
        Movie movie = getMovie(request.getMovieId());
        Room room = getRoom(request.getRoomId());
        //        checkOverlapShowtime(request);
        List<Long> updateShowtimeId = request.getShowtimeDTOs().stream()
                .map(ShowtimeDTO::getShowtimeId)
                .filter(Objects::nonNull)
                .toList();
        List<Long> allIds =
                showtimeRepository.findIdExist(request.getBranchId(), request.getMovieId(), request.getRoomId());
        List<Long> deleteIds =
                allIds.stream().filter(item -> !updateShowtimeId.contains(item)).toList();
        if (!deleteIds.isEmpty()) showtimeRepository.deleteByShowtimeId(deleteIds);
        List<Showtime> showtimes = new ArrayList<>();
        StringBuilder errors = new StringBuilder();
        int count = 1;
        for (ShowtimeDTO dto : request.getShowtimeDTOs()) {
            if(LocalDateTime.now().isAfter(dto.getStartTime())){
                continue;
            }
            List<Showtime> existed = showtimeRepository.findOverlappingShowtimes(
                    branch.getBranchId(), room.getRoomId(), movie.getMovieId(), dto.getStartTime(), dto.getEndTime());
            if (existed != null && existed.size() > 0) {
                for (Showtime item : existed) {
                    errors.append(String.format(
                            "<p>%d. Lịch chiếu [%s - %s] trùng với phim %s [%s - %s]</p>",
                            count++,
                            DateUtils.formatTimeHHmm(dto.getStartTime()),
                            DateUtils.formatTimeHHmm(dto.getEndTime()),
                            item.getMovie().getTitle(),
                            DateUtils.formatTimeHHmm(item.getStartTime()),
                            DateUtils.formatTimeHHmm(item.getEndTime())));
                }
                continue;
            }
            Showtime showtime = new Showtime();
            showtime.setMovie(movie);
            showtime.setRoom(room);
            if (dto.getShowtimeId() == null) {
                showtime.setBranch(branch);
            } else {
                showtime = showtimeRepository.findByShowtimeIdAndBranch_BranchId(
                        dto.getShowtimeId(), branch.getBranchId());
            }
            if (showtime.getStatus() == null) showtime.setStatus(dto.getStatus());
            showtime.setStartTime(dto.getStartTime());
            showtime.setEndTime(dto.getEndTime());
            if(showtime.getPrice() == null || showtime.getPrice() == 0)
                showtime.setPrice(dto.getPrice());
            showtimes.add(showtime);
        }
        if (!errors.isEmpty()) throw new CustomException(errors.toString());
        showtimeRepository.saveAll(showtimes);
    }

    private Branch getBranch(Long branchId) {
        return branchRepository
                .findById(branchId)
                .orElseThrow(() -> new CustomException(SystemMessage.BRANCH_NOT_FOUND));
    }

    private Movie getMovie(Long movieMovieId) {
        return movieRepository
                .findById(movieMovieId)
                .orElseThrow(() -> new CustomException(SystemMessage.MOVIE_NOT_FOUND));
    }

    private Room getRoom(Long roomId) {
        return roomRepository.findById(roomId).orElseThrow(() -> new CustomException(SystemMessage.ROOM_NOT_FOUND));
    }

    public List<Showtime> getShowtimesByDate(LocalDate date, Long branchId) {
        if(branchId == null)
            throw new CustomException(SystemMessage.BRANCH_IS_REQUIRED);
        if (date == null) {
            date = LocalDate.now();
        }
        return showtimeRepository.findShowtimesByDate(date, branchId);
    }

    public ShowtimeDTO getById(Long id) {
        Showtime showtime = showtimeRepository.findById(id).orElseThrow(
                () -> new CustomException(SystemMessage.SHOW_TIME_NOT_FOUND)
        );
        ShowtimeDTO dto = ConvertUtils.convert(showtime, ShowtimeDTO.class);
        List<String> bookedSeat = ticketRepository.findBookedSeat(dto.getShowtimeId());
        dto.setBookedSeat(bookedSeat);
        return dto;
    }

    @Transactional
    public void updatePrice(UpdatePriceRequest req){
        req.validateInput();
        List<Showtime> showtimes = showtimeRepository.findByIds(req.getIds());
        showtimes.forEach(item -> {
            item.setPrice(req.getPrice());
        });
        showtimeRepository.saveAll(showtimes);
    }
}
