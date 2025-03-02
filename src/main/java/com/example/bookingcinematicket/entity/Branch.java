package com.example.bookingcinematicket.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "branches")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Branch {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "branch_id")
    private Long branchId;
    @Column(nullable = false)
    private String name;
    private String address;
    private String phone;
    private String email;
    private Boolean status;
    @OneToMany(mappedBy = "branch", cascade = CascadeType.ALL)
    private List<Room> rooms;
    @OneToMany(mappedBy = "branch", cascade = CascadeType.ALL)
    private List<SeatType> seatTypes;
}
