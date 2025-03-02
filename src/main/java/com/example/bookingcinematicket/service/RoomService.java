package com.example.bookingcinematicket.service;

import com.example.bookingcinematicket.constants.SystemMessage;
import com.example.bookingcinematicket.dtos.BranchDTO;
import com.example.bookingcinematicket.dtos.RoomDTO;
import com.example.bookingcinematicket.dtos.SeatDTO;
import com.example.bookingcinematicket.dtos.common.SearchRequest;
import com.example.bookingcinematicket.dtos.common.SearchResponse;
import com.example.bookingcinematicket.dtos.room.SearchRoomRequest;
import com.example.bookingcinematicket.entity.Branch;
import com.example.bookingcinematicket.entity.Room;
import com.example.bookingcinematicket.entity.Seat;
import com.example.bookingcinematicket.entity.SeatType;
import com.example.bookingcinematicket.exception.CustomException;
import com.example.bookingcinematicket.repository.BranchRepository;
import com.example.bookingcinematicket.repository.RoomRepository;
import com.example.bookingcinematicket.repository.SeatRepository;
import com.example.bookingcinematicket.repository.SeatTypeRepository;
import com.example.bookingcinematicket.utils.ConvertUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class RoomService {
    @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private SeatRepository seatRepository;
    @Autowired
    private SeatTypeRepository seatTypeRepository;
    @Autowired
    private BranchRepository branchRepository;

    public SearchResponse<List<RoomDTO>> getAllRoomsByBranch(SearchRequest<SearchRoomRequest, Room> request) {
        request.getCondition().validateInput();
        Page<Room> rooms = roomRepository.search(
                request.getCondition().getName(),
                request.getCondition().getBranchId(),
                request.getCondition().getStatus(),
                request.getPageable(Room.class)
        );

        SearchResponse<List<RoomDTO>> response = new SearchResponse<>();
        response.setData(ConvertUtils.convertList(rooms.getContent(), RoomDTO.class));
        response.setPageSize(request.getPageSize());
        response.setPageIndex(request.getPageIndex());
        response.setTotalRecords(rooms.getTotalElements());
        return response;
    }

    public RoomDTO getRoomById(Long id) {
        Room room = roomRepository.findById(id).orElseThrow(() -> new CustomException(SystemMessage.ROOM_NOT_FOUND));
        return ConvertUtils.convert(room, RoomDTO.class);
    }

    @Transactional
    public RoomDTO createRoom(RoomDTO roomDTO) {
        Branch branch = branchRepository.findById(roomDTO.getBranchBranchId())
                .orElseThrow(() -> new CustomException(SystemMessage.BRANCH_NOT_FOUND));

        boolean exists = roomRepository.existsByNameAndBranch_BranchId(roomDTO.getName(), roomDTO.getBranchBranchId());
        if (exists) {
            throw new CustomException(SystemMessage.ROOM_NAME_IS_EXISTED);
        }

        Room room = new Room();
        room.setName(roomDTO.getName());
        room.setStatus(true);
        room.setRoomType(roomDTO.getRoomType());
        room.setCapacity(roomDTO.getCapacity());
        room.setSeatMap(roomDTO.getSeatMap());
        room.setBranch(branch);
        roomRepository.save(room);
        return ConvertUtils.convert(room, RoomDTO.class);
    }

    @Transactional
    public RoomDTO updateRoom(Long id, RoomDTO roomDTO) {
        Room room = roomRepository.findById(id).orElseThrow(() -> new CustomException(SystemMessage.ROOM_NOT_FOUND));

        boolean nameExists = roomRepository.existsByNameAndBranch_BranchIdAndRoomIdNot(
                roomDTO.getName(), roomDTO.getBranchBranchId(), id);
        if (nameExists) {
            throw new CustomException(SystemMessage.ROOM_NAME_IS_EXISTED);
        }

        room.setCapacity(roomDTO.getCapacity());
        room.setSeatMap(roomDTO.getSeatMap());
        room.setName(roomDTO.getName());
        room.setCapacity(roomDTO.getCapacity());
        room.setRoomType(roomDTO.getRoomType());
        room.setStatus(roomDTO.getStatus());
        roomRepository.save(room);
        return ConvertUtils.convert(room, RoomDTO.class);
    }
}
