package com.example.bookingcinematicket.controller.apis;

import com.example.bookingcinematicket.dtos.BranchDTO;
import com.example.bookingcinematicket.dtos.common.SearchRequest;
import com.example.bookingcinematicket.dtos.common.SearchResponse;
import com.example.bookingcinematicket.entity.Branch;
import com.example.bookingcinematicket.service.BranchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/branches")
public class BranchController {
    @Autowired
    private BranchService branchService;

    @PostMapping("/search")
    public SearchResponse<List<BranchDTO>> getAllBranches(@RequestBody SearchRequest<String, Branch> request) {
        return branchService.getAllBranches(request);
    }

    @GetMapping("/{id}")
    public BranchDTO getBranchById(@PathVariable Long id) {
        return branchService.getBranchById(id);
    }

    @PostMapping
    public BranchDTO createBranch(@RequestBody BranchDTO branchDTO) {
        return branchService.createBranch(branchDTO);
    }

    @PutMapping("/{id}")
    public BranchDTO updateBranch(@PathVariable Long id, @RequestBody BranchDTO branchDTO) {
        return branchService.updateBranch(id, branchDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteBranch(@PathVariable Long id) {
        branchService.deleteBranch(id);
    }

    @GetMapping("/search")
    public List<BranchDTO> searchBranches(@RequestParam String name) {
        return branchService.searchBranches(name);
    }
}
