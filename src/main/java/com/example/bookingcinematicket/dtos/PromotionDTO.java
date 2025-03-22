package com.example.bookingcinematicket.dtos;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PromotionDTO {
    private Long promotionId;
    private String title;
    private String description;
    private Double discountAmount;
    private Double discountPercent;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Double minPurchase;
    private Double maxDiscount;
    private Boolean status;
    private Long branchBranchId;
    private Long numberOfItems;
    private String branchName;
    //    private List<CouponItemDTO> couponItems;
}
