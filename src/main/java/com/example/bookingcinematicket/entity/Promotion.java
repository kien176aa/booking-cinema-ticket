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
@Table(name = "promotions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Promotion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "promotion_id")
    private Long promotionId;
    @Column(nullable = false, unique = true)
    private String code;
    private String description;
    @Column(precision = 10, scale = 2)
    private BigDecimal discountAmount;
    @Column(precision = 5, scale = 2)
    private BigDecimal discountPercent;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer minPurchase;
    @Column(precision = 10, scale = 2)
    private BigDecimal maxDiscount;
    private boolean status;
    @OneToMany(mappedBy = "promotion")
    private List<Booking> bookings;
}