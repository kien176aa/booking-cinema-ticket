package com.example.bookingcinematicket.controller.apis;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.bookingcinematicket.controller.BaseController;
import com.example.bookingcinematicket.dtos.BranchDTO;
import com.example.bookingcinematicket.dtos.common.SearchRequest;
import com.example.bookingcinematicket.dtos.common.SearchResponse;
import com.example.bookingcinematicket.entity.Branch;
import com.example.bookingcinematicket.service.BranchService;

@RestController
@RequestMapping("/branches")
public class BranchController extends BaseController {
    @Autowired
    private BranchService branchService;

    @PostMapping("/search")
    public SearchResponse<List<BranchDTO>> getAllBranches(@RequestBody SearchRequest<String, Branch> request) {
        System.out.println("aa: " + getCurrentUser());
        return branchService.getAllBranches(request);
    }

    @GetMapping("/{id}")
    public BranchDTO getBranchById(@PathVariable Long id) {
        return branchService.getBranchById(id);
    }

    @PostMapping
    @PreAuthorize("@securityService.hasPermission('ROLE_ADMIN')")
    public BranchDTO createBranch(@RequestBody BranchDTO branchDTO) {
        return branchService.createBranch(branchDTO);
    }

    @PutMapping("/{id}")
    @PreAuthorize("@securityService.hasPermission('ROLE_ADMIN')")
    public BranchDTO updateBranch(@PathVariable Long id, @RequestBody BranchDTO branchDTO) {
        return branchService.updateBranch(id, branchDTO);
    }

    @GetMapping("/search")
    public List<BranchDTO> searchBranches(@RequestParam String name) {
        return branchService.searchBranches(name);
    }
}
