package com.example.bookingcinematicket.entity;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    @Column(nullable = false)
    private String title;

    private String description;
    private Double discountAmount;
    private Double discountPercent;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Double minPurchase;
    private Double maxDiscount;
    private Boolean status;
    private Long numberOfItems;

    @ManyToOne
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;

    @OneToMany(mappedBy = "promotion")
    private List<Booking> bookings;
}
