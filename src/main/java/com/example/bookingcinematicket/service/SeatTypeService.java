package com.example.bookingcinematicket.service;

import com.example.bookingcinematicket.constants.SystemMessage;
import com.example.bookingcinematicket.dtos.RoomDTO;
import com.example.bookingcinematicket.dtos.SeatTypeDTO;
import com.example.bookingcinematicket.dtos.common.SearchRequest;
import com.example.bookingcinematicket.dtos.common.SearchResponse;
import com.example.bookingcinematicket.dtos.room.SearchRoomRequest;
import com.example.bookingcinematicket.entity.Branch;
import com.example.bookingcinematicket.entity.Room;
import com.example.bookingcinematicket.entity.SeatType;
import com.example.bookingcinematicket.exception.CustomException;
import com.example.bookingcinematicket.repository.BranchRepository;
import com.example.bookingcinematicket.repository.RoomRepository;
import com.example.bookingcinematicket.repository.SeatTypeRepository;
import com.example.bookingcinematicket.utils.ConvertUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SeatTypeService {
    @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private SeatTypeRepository seatTypeRepository;
    @Autowired
    private BranchRepository branchRepository;

    public SearchResponse<List<SeatTypeDTO>> search(SearchRequest<SearchRoomRequest, SeatType> request) {
        request.getCondition().validateInput();
        Page<SeatType> seatTypes = seatTypeRepository.search(
                request.getCondition().getName(),
                request.getCondition().getBranchId(),
                request.getCondition().getStatus(),
                request.getPageable(SeatType.class)
        );

        SearchResponse<List<SeatTypeDTO>> response = new SearchResponse<>();
        response.setData(ConvertUtils.convertList(seatTypes.getContent(), SeatTypeDTO.class));
        response.setPageSize(request.getPageSize());
        response.setPageIndex(request.getPageIndex());
        response.setTotalRecords(seatTypes.getTotalElements());
        return response;
    }

    public SeatTypeDTO getSeatTypeById(Long id) {
        SeatType seatType = seatTypeRepository.findById(id).orElseThrow(() -> new CustomException(SystemMessage.SEAT_TYPE_NOT_FOUND));
        return ConvertUtils.convert(seatType, SeatTypeDTO.class);
    }

    public SeatTypeDTO createSeatType(SeatTypeDTO seatTypeDTO) {
        Branch branch = branchRepository.findById(seatTypeDTO.getBranchBranchId())
                .orElseThrow(() -> new CustomException(SystemMessage.BRANCH_NOT_FOUND));

        boolean exists = seatTypeRepository.existsByTypeNameAndBranch_BranchId(seatTypeDTO.getTypeName(), seatTypeDTO.getBranchBranchId());
        if (exists) {
            throw new CustomException(SystemMessage.SEAT_TYPE_IS_EXISTED);
        }

        SeatType seatType = ConvertUtils.convert(seatTypeDTO, SeatType.class);
        seatType.setBranch(branch);
        seatTypeRepository.save(seatType);
        return ConvertUtils.convert(seatType, SeatTypeDTO.class);
    }

    public SeatTypeDTO updateSeatType(Long id, SeatTypeDTO seatTypeDTO) {
        SeatType seatType = seatTypeRepository.findById(id).orElseThrow(() -> new CustomException(SystemMessage.SEAT_TYPE_NOT_FOUND));

        boolean nameExists = seatTypeRepository.existsByTypeNameAndBranch_BranchIdAndSeatTypeIdNot(
                seatTypeDTO.getTypeName(), seatTypeDTO.getBranchBranchId(), id);
        if (nameExists) {
            throw new CustomException(SystemMessage.SEAT_TYPE_IS_EXISTED);
        }
        boolean colorExists = seatTypeRepository.existsByColorAndBranch_BranchIdAndSeatTypeIdNot(
                seatTypeDTO.getColor(), seatTypeDTO.getBranchBranchId(), id);
        if (colorExists) {
            throw new CustomException(SystemMessage.SEAT_TYPE_IS_EXISTED);
        }

        seatType.setTypeName(seatTypeDTO.getTypeName());
        seatType.setPrice(seatTypeDTO.getPrice());
        seatType.setColor(seatTypeDTO.getColor());
        seatType.setIsDefault(seatTypeDTO.getIsDefault());
        seatType.setStatus(seatTypeDTO.getStatus());

        seatTypeRepository.save(seatType);
        return ConvertUtils.convert(seatType, SeatTypeDTO.class);
    }
}
