package com.example.bookingcinematicket.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_id")
    private Long bookingId;
    @Column(name = "user_id")
    private Long userId;
    @ManyToOne
    @JoinColumn(name = "promotion_id")
    private Promotion promotion;
    @Column(nullable = false)
    private LocalDateTime bookingDate;
    private Double totalAmount;
    private String paymentMethod;
    private String paymentStatus;
    private String bookingStatus;
    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL)
    private List<Ticket> tickets;
    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL)
    private List<FoodOrder> foodOrders;
}
