package com.example.bookingcinematicket.controller.apis;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.bookingcinematicket.dtos.SeatTypeDTO;
import com.example.bookingcinematicket.dtos.common.SearchRequest;
import com.example.bookingcinematicket.dtos.common.SearchResponse;
import com.example.bookingcinematicket.dtos.room.SearchRoomRequest;
import com.example.bookingcinematicket.entity.SeatType;
import com.example.bookingcinematicket.service.SeatTypeService;

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
    @PreAuthorize("@securityService.hasPermission('ROLE_ADMIN')")
    public SeatTypeDTO createSeatType(@RequestBody SeatTypeDTO seatTypeDTO) {
        return seatTypeService.createSeatType(seatTypeDTO);
    }

    @PutMapping("/{id}")
    @PreAuthorize("@securityService.hasPermission('ROLE_ADMIN')")
    public SeatTypeDTO updateSeatType(@PathVariable Long id, @RequestBody SeatTypeDTO seatTypeDTO) {
        return seatTypeService.updateSeatType(id, seatTypeDTO);
    }
}
