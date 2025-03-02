package com.example.bookingcinematicket.dtos;

import com.example.bookingcinematicket.entity.Room;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SeatDTO {
    private Long seatId;
    private Long roomRoomId;
    private String roomName;
    private String seatNumber;
    private Long seatTypeSeatTypeId;
    private String seatTypeTypeName;
    private String seatTypeColor;
    private Double seatTypePrice;
    private Boolean status;
}
