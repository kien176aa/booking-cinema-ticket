package com.example.bookingcinematicket.controller.apis;

import com.example.bookingcinematicket.dtos.RoomDTO;
import com.example.bookingcinematicket.dtos.SeatTypeDTO;
import com.example.bookingcinematicket.dtos.common.SearchRequest;
import com.example.bookingcinematicket.dtos.common.SearchResponse;
import com.example.bookingcinematicket.dtos.room.SearchRoomRequest;
import com.example.bookingcinematicket.entity.Room;
import com.example.bookingcinematicket.entity.SeatType;
import com.example.bookingcinematicket.service.RoomService;
import com.example.bookingcinematicket.service.SeatTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/seat-types")
public class SeatTypeController {
    @Autowired
    private SeatTypeService seatTypeService;

    @PostMapping("/search")
    public SearchResponse<List<SeatTypeDTO>> search(@RequestBody SearchRequest<SearchRoomRequest, SeatType> request) {
        return seatTypeService.search(request);
    }

    @GetMapping("/{id}")
    public SeatTypeDTO getSeatTypeById(@PathVariable Long id) {
        return seatTypeService.getSeatTypeById(id);
    }

    @PostMapping
    public SeatTypeDTO createSeatType(@RequestBody SeatTypeDTO seatTypeDTO) {
        return seatTypeService.createSeatType(seatTypeDTO);
    }

    @PutMapping("/{id}")
    public SeatTypeDTO updateSeatType(@PathVariable Long id, @RequestBody SeatTypeDTO seatTypeDTO) {
        return seatTypeService.updateSeatType(id, seatTypeDTO);
    }
}
