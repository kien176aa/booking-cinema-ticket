package com.example.bookingcinematicket.entity;

import java.util.List;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "seats",
        uniqueConstraints = @UniqueConstraint(columnNames = {"seat_number", "room_id", "showtime_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Seat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "seat_id")
    private Long seatId;
    @ManyToOne
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;
    @Column(nullable = false)
    private String seatNumber;
    @ManyToOne
    @JoinColumn(name = "seat_type_id")
    private SeatType seatType;
    @Column(name = "showtime_id")
    private Long showtimeId;
    private String color;
    @OneToMany(mappedBy = "seat", cascade = CascadeType.ALL)
    private List<Ticket> tickets;
}
