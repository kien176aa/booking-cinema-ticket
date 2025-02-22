package com.example.bookingcinematicket.service;

import com.example.bookingcinematicket.dtos.RoomDTO;
import com.example.bookingcinematicket.entity.Branch;
import com.example.bookingcinematicket.entity.Room;
import com.example.bookingcinematicket.repository.BranchRepository;
import com.example.bookingcinematicket.repository.RoomRepository;
import com.example.bookingcinematicket.utils.ConvertUtils;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoomService {
    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private BranchRepository branchRepository;

    public List<RoomDTO> getAllRoomsByBranch(Long branchId) {
        List<Room> rooms = roomRepository.findByBranch_BranchId(branchId);
        return rooms.stream()
                .map(room -> ConvertUtils.convert(room, RoomDTO.class))
                .collect(Collectors.toList());
    }

    public RoomDTO getRoomById(Long id) {
        Room room = roomRepository.findById(id).orElseThrow(() -> new RuntimeException("Room not found"));
        return ConvertUtils.convert(room, RoomDTO.class);
    }

    public RoomDTO createRoom(RoomDTO roomDTO) {
        Branch branch = branchRepository.findById(roomDTO.getBranchId())
                .orElseThrow(() -> new RuntimeException("Branch not found"));

        boolean exists = roomRepository.existsByNameAndBranch_BranchId(roomDTO.getName(), roomDTO.getBranchId());
        if (exists) {
            throw new RuntimeException("Room name already exists in this branch");
        }

        Room room = ConvertUtils.convert(roomDTO, Room.class);
        room.setBranch(branch);
        Room savedRoom = roomRepository.save(room);
        return ConvertUtils.convert(savedRoom, RoomDTO.class);
    }

    public RoomDTO updateRoom(Long id, RoomDTO roomDTO) {
        Room room = roomRepository.findById(id).orElseThrow(() -> new RuntimeException("Room not found"));

        boolean nameExists = roomRepository.existsByNameAndBranch_BranchIdAndRoomIdNot(
                roomDTO.getName(), roomDTO.getBranchId(), id);
        if (nameExists) {
            throw new RuntimeException("Room name is already used by another room in this branch");
        }

        room.setName(roomDTO.getName());
        room.setCapacity(roomDTO.getCapacity());
        room.setRoomType(roomDTO.getRoomType());
        room.setStatus(roomDTO.getStatus());

        Room updatedRoom = roomRepository.save(room);
        return ConvertUtils.convert(updatedRoom, RoomDTO.class);
    }

    public void deleteRoom(Long id) {
        roomRepository.deleteById(id);
    }
}
