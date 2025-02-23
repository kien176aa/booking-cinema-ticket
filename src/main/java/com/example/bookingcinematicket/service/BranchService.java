package com.example.bookingcinematicket.service;

import com.example.bookingcinematicket.dtos.BranchDTO;
import com.example.bookingcinematicket.dtos.common.SearchRequest;
import com.example.bookingcinematicket.dtos.common.SearchResponse;
import com.example.bookingcinematicket.entity.Branch;
import com.example.bookingcinematicket.repository.BranchRepository;
import com.example.bookingcinematicket.utils.ConvertUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class BranchService {
    @Autowired
    private BranchRepository branchRepository;

    public SearchResponse<List<BranchDTO>> getAllBranches(SearchRequest<String, Branch> request) {
        if(request.getCondition() != null)
            request.setCondition(request.getCondition().toLowerCase().trim());
        Page<Branch> branches = branchRepository.search(
                request.getCondition(),
                request.getPageable(Branch.class)
        );
        SearchResponse<List<BranchDTO>> response = new SearchResponse<>();
        response.setData(ConvertUtils.convertList(branches.getContent(), BranchDTO.class));
        response.setPageSize(request.getPageSize());
        response.setPageIndex(request.getPageIndex());
        response.setTotalRecords(branches.getTotalElements());
        return response;
    }

    public BranchDTO getBranchById(Long id) {
        Branch branch = branchRepository.findById(id).orElseThrow(() -> new RuntimeException("Branch not found"));
        return ConvertUtils.convert(branch, BranchDTO.class);
    }

    public BranchDTO createBranch(BranchDTO branchDTO) {
        log.info("Creating branch {}", branchDTO);
        boolean exists = branchRepository.existsByName(branchDTO.getName());
        if (exists) {
            throw new RuntimeException("Branch name already exists");
        }
        Branch branch = ConvertUtils.convert(branchDTO, Branch.class);
        Branch savedBranch = branchRepository.save(branch);
        return ConvertUtils.convert(savedBranch, BranchDTO.class);
    }

    public BranchDTO updateBranch(Long id, BranchDTO branchDTO) {
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Branch not found"));

        boolean nameExists = branchRepository.existsByNameAndBranchIdNot(branchDTO.getName(), id);
        if (nameExists) {
            throw new RuntimeException("Branch name is already used by another branch");
        }
        branch.setName(branchDTO.getName());
        branch.setAddress(branchDTO.getAddress());
        branch.setPhone(branchDTO.getPhone());
        branch.setEmail(branchDTO.getEmail());
        branch.setStatus(branchDTO.getStatus());
        Branch updatedBranch = branchRepository.save(branch);
        return ConvertUtils.convert(updatedBranch, BranchDTO.class);
    }

    public void deleteBranch(Long id) {
        branchRepository.deleteById(id);
    }

    public List<BranchDTO> searchBranches(String name) {
        List<Branch> branches = branchRepository.findBranchByName(name);
        return branches.stream()
                .map(branch -> ConvertUtils.convert(branch, BranchDTO.class))
                .collect(Collectors.toList());
    }
}
