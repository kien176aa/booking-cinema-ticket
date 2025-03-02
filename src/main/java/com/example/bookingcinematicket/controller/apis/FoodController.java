package com.example.bookingcinematicket.controller.apis;

import com.example.bookingcinematicket.controller.BaseController;
import com.example.bookingcinematicket.dtos.BranchDTO;
import com.example.bookingcinematicket.dtos.FoodDTO;
import com.example.bookingcinematicket.dtos.common.SearchRequest;
import com.example.bookingcinematicket.dtos.common.SearchResponse;
import com.example.bookingcinematicket.entity.Branch;
import com.example.bookingcinematicket.entity.Food;
import com.example.bookingcinematicket.service.BranchService;
import com.example.bookingcinematicket.service.FoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/foods")
public class FoodController extends BaseController {
    @Autowired
    private FoodService foodService;

    @PostMapping("/search")
    public SearchResponse<List<FoodDTO>> search(@RequestBody SearchRequest<String, Food> request) {
        System.out.println("aa: " + getCurrentUser());
        return foodService.search(request);
    }

    @GetMapping("/{id}")
    public FoodDTO getBranchById(@PathVariable Long id) {
        return foodService.getFoodById(id);
    }

    @PostMapping
    public FoodDTO createBranch(@ModelAttribute FoodDTO branchDTO,
                                @RequestPart(value = "file", required = false) MultipartFile file) {
        return foodService.create(branchDTO, file);
    }

    @PutMapping("/{id}")
    public FoodDTO updateBranch(@PathVariable("id") Long id, @ModelAttribute FoodDTO branchDTO,
                                @RequestPart(value = "file", required = false) MultipartFile file) {
        return foodService.update(id, branchDTO, file);
    }
}
