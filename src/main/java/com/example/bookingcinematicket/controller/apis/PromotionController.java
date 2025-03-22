package com.example.bookingcinematicket.controller.apis;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.bookingcinematicket.controller.BaseController;
import com.example.bookingcinematicket.dtos.PromotionDTO;
import com.example.bookingcinematicket.dtos.common.SearchRequest;
import com.example.bookingcinematicket.dtos.common.SearchResponse;
import com.example.bookingcinematicket.dtos.promotion.SearchPromotionRequest;
import com.example.bookingcinematicket.entity.Promotion;
import com.example.bookingcinematicket.service.PromotionService;

@RestController
@RequestMapping("/promotions")
public class PromotionController extends BaseController {
    @Autowired
    private PromotionService promotionService;

    @PostMapping("/search")
    public SearchResponse<List<PromotionDTO>> search(
            @RequestBody SearchRequest<SearchPromotionRequest, Promotion> request) {
        return promotionService.search(request);
    }

    @GetMapping("/get-current")
    public List<PromotionDTO> getCurrentPromotions(@RequestParam Double price) {
        return promotionService.getCurrentPromotions(price);
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
