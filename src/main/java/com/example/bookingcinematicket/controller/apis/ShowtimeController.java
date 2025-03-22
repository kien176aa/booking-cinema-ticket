package com.example.bookingcinematicket.controller.apis;

import java.util.List;

import com.example.bookingcinematicket.dtos.RoomDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.bookingcinematicket.dtos.ShowtimeDTO;
import com.example.bookingcinematicket.dtos.common.SearchRequest;
import com.example.bookingcinematicket.dtos.common.SearchResponse;
import com.example.bookingcinematicket.dtos.showtime.SearchShowtimeRequest;
import com.example.bookingcinematicket.dtos.showtime.UpdateShowtimeRequest;
import com.example.bookingcinematicket.entity.Showtime;
import com.example.bookingcinematicket.service.ShowtimeService;

@RestController
@RequestMapping("/showtimes")
public class ShowtimeController {
    @Autowired
    private ShowtimeService showtimeService;

    @PostMapping("/search")
    public SearchResponse<List<ShowtimeDTO>> search(
            @RequestBody SearchRequest<SearchShowtimeRequest, Showtime> request) {
        return showtimeService.search(request);
    }

    @GetMapping("/{id}")
    public ShowtimeDTO getById(@PathVariable Long id) {
        return showtimeService.getById(id);
    }

    @PutMapping("/update")
    public void update(@RequestBody UpdateShowtimeRequest request) {
        showtimeService.updateShowtime(request);
    }
}
