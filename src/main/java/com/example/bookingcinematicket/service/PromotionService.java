package com.example.bookingcinematicket.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import com.example.bookingcinematicket.constants.SystemMessage;
import com.example.bookingcinematicket.dtos.PromotionDTO;
import com.example.bookingcinematicket.dtos.common.SearchRequest;
import com.example.bookingcinematicket.dtos.common.SearchResponse;
import com.example.bookingcinematicket.dtos.promotion.SearchPromotionRequest;
import com.example.bookingcinematicket.entity.Branch;
import com.example.bookingcinematicket.entity.Promotion;
import com.example.bookingcinematicket.exception.CustomException;
import com.example.bookingcinematicket.repository.BranchRepository;
import com.example.bookingcinematicket.repository.PromotionRepository;
import com.example.bookingcinematicket.utils.ConvertUtils;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class PromotionService {
    @Autowired
    private PromotionRepository promotionRepository;

    @Autowired
    private BranchRepository branchRepository;

    public SearchResponse<List<PromotionDTO>> search(SearchRequest<SearchPromotionRequest, Promotion> request) {
        request.getCondition().validateInput();
        Page<Promotion> promotions = promotionRepository.search(
                request.getCondition().getName(),
                request.getCondition().getBranchId(),
                request.getCondition().getStatus(),
                request.getCondition().getStartDate(),
                request.getCondition().getEndDate(),
                request.getPageable(Promotion.class));

        SearchResponse<List<PromotionDTO>> response = new SearchResponse<>();
        response.setData(ConvertUtils.convertList(promotions.getContent(), PromotionDTO.class));
        response.setPageSize(request.getPageSize());
        response.setPageIndex(request.getPageIndex());
        response.setTotalRecords(promotions.getTotalElements());
        return response;
    }

    public PromotionDTO getById(Long id) {
        Promotion promotion = promotionRepository
                .findById(id)
                .orElseThrow(() -> new CustomException(SystemMessage.PROMOTION_NOT_FOUND));
        return ConvertUtils.convert(promotion, PromotionDTO.class);
    }

    public PromotionDTO create(PromotionDTO promotionDTO) {
        Branch branch = branchRepository
                .findById(promotionDTO.getBranchBranchId())
                .orElseThrow(() -> new CustomException(SystemMessage.BRANCH_NOT_FOUND));

        boolean existByTitle = promotionRepository.existsByTitleAndBranch_BranchId(
                promotionDTO.getTitle(), promotionDTO.getBranchBranchId());
        if (existByTitle) {
            throw new CustomException(SystemMessage.PROMOTION_TITLE_IS_EXISTED);
        }
        Promotion promotion = ConvertUtils.convert(promotionDTO, Promotion.class);
        promotion.setBranch(branch);
        promotionRepository.save(promotion);

        return ConvertUtils.convert(promotion, PromotionDTO.class);
    }

    public PromotionDTO update(Long id, PromotionDTO promotionDTO) {
        Promotion promotion = promotionRepository
                .findById(id)
                .orElseThrow(() -> new CustomException(SystemMessage.PROMOTION_NOT_FOUND));

        boolean existByTitle = promotionRepository.existsByTitleAndBranch_BranchIdAndPromotionIdNot(
                promotionDTO.getTitle(), promotionDTO.getBranchBranchId(), id);
        if (existByTitle) {
            throw new CustomException(SystemMessage.PROMOTION_TITLE_IS_EXISTED);
        }
        promotion.setTitle(promotionDTO.getTitle());
        promotion.setDescription(promotionDTO.getDescription());
        promotion.setDiscountAmount(promotionDTO.getDiscountAmount());
        promotion.setDiscountPercent(promotionDTO.getDiscountPercent());
        promotion.setMaxDiscount(promotionDTO.getMaxDiscount());
        promotion.setMinPurchase(promotionDTO.getMinPurchase());
        promotion.setStartDate(promotionDTO.getStartDate());
        promotion.setEndDate(promotionDTO.getEndDate());
        promotion.setStatus(promotionDTO.getStatus());
//        promotion.setNumberOfItems(promotionDTO.getNumberOfItems());
        promotionRepository.save(promotion);
        return ConvertUtils.convert(promotion, PromotionDTO.class);
    }

    public List<PromotionDTO> getCurrentPromotions(Double price) {
        List<Promotion> promotions = promotionRepository.getCurrentPromotions(price);
        return ConvertUtils.convertList(promotions, PromotionDTO.class);
    }
}
