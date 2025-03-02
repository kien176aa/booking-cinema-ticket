//package com.example.bookingcinematicket.entity;
//
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Builder;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//@Entity
//@Table(name = "coupon_items")
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//public class CouponItem {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//    @Column(nullable = false)
//    private String code;
//    private Boolean isUsed;
//    @ManyToOne
//    @JoinColumn(name = "promotion_id", nullable = false)
//    private Promotion promotion;
//
//}
