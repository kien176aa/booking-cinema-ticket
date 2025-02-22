package com.example.bookingcinematicket.service;

import com.example.bookingcinematicket.dtos.BranchDTO;
import com.example.bookingcinematicket.entity.Branch;
import com.example.bookingcinematicket.repository.BranchRepository;
import com.example.bookingcinematicket.utils.ConvertUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BranchService {
    @Autowired
    private BranchRepository branchRepository;

    public List<BranchDTO> getAllBranches() {
        List<Branch> branches = branchRepository.findAll();
        return branches.stream()
                .map(branch -> ConvertUtils.convert(branch, BranchDTO.class))
                .collect(Collectors.toList());
    }

    public BranchDTO getBranchById(Long id) {
        Branch branch = branchRepository.findById(id).orElseThrow(() -> new RuntimeException("Branch not found"));
        return ConvertUtils.convert(branch, BranchDTO.class);
    }

    public BranchDTO createBranch(BranchDTO branchDTO) {
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
