package com.example.bookingcinematicket.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

// Room.java
@Entity
@Table(name = "rooms")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_id")
    private Long roomId;
    @ManyToOne
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;
    @Column(nullable = false)
    private String name;
    private Integer capacity;
    private String roomType;
    @Column(columnDefinition = "TEXT")
    private String seatMap;
    private Boolean status;
    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL)
    private List<Seat> seats;
    @OneToMany(mappedBy = "room")
    private List<Showtime> showtimes;
}
