package com.example.bookingcinematicket.controller.apis;

import com.example.bookingcinematicket.controller.BaseController;
import com.example.bookingcinematicket.dtos.BranchDTO;
import com.example.bookingcinematicket.dtos.PromotionDTO;
import com.example.bookingcinematicket.dtos.common.SearchRequest;
import com.example.bookingcinematicket.dtos.common.SearchResponse;
import com.example.bookingcinematicket.dtos.promotion.SearchPromotionRequest;
import com.example.bookingcinematicket.dtos.room.SearchRoomRequest;
import com.example.bookingcinematicket.entity.Branch;
import com.example.bookingcinematicket.entity.Promotion;
import com.example.bookingcinematicket.service.BranchService;
import com.example.bookingcinematicket.service.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/promotions")
public class PromotionController extends BaseController {
    @Autowired
    private PromotionService promotionService;

    @PostMapping("/search")
    public SearchResponse<List<PromotionDTO>> search(@RequestBody SearchRequest<SearchPromotionRequest, Promotion> request) {
        return promotionService.search(request);
    }

    @GetMapping("/{id}")
    public PromotionDTO getById(@PathVariable Long id) {
        return promotionService.getById(id);
    }

    @PostMapping
    public PromotionDTO createBranch(@RequestBody PromotionDTO promotionDTO) {
        return promotionService.create(promotionDTO);
    }

    @PutMapping("/{id}")
    public PromotionDTO updateBranch(@PathVariable Long id, @RequestBody PromotionDTO promotionDTO) {
        return promotionService.update(id, promotionDTO);
    }
}
