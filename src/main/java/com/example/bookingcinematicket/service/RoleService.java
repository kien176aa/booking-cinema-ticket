package com.example.bookingcinematicket.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import com.example.bookingcinematicket.constants.SystemMessage;
import com.example.bookingcinematicket.dtos.RoleDTO;
import com.example.bookingcinematicket.dtos.common.SearchRequest;
import com.example.bookingcinematicket.dtos.common.SearchResponse;
import com.example.bookingcinematicket.entity.Role;
import com.example.bookingcinematicket.exception.CustomException;
import com.example.bookingcinematicket.repository.RoleRepository;
import com.example.bookingcinematicket.utils.ConvertUtils;

@Service
public class RoleService {
    @Autowired
    private RoleRepository roleRepository;

    public SearchResponse<List<RoleDTO>> search(SearchRequest<String, Role> request) {
        if (request.getCondition() != null)
            request.setCondition(request.getCondition().trim().toLowerCase());
        Page<Role> roles = roleRepository.search(request.getCondition(), request.getPageable(Role.class));

        SearchResponse<List<RoleDTO>> response = new SearchResponse<>();
        response.setData(ConvertUtils.convertList(roles.getContent(), RoleDTO.class));
        response.setPageSize(request.getPageSize());
        response.setPageIndex(request.getPageIndex());
        response.setTotalRecords(roles.getTotalElements());
        return response;
    }

    public List<RoleDTO> getActiveRoles() {
        List<Role> roles = roleRepository.findByStatus(true);
        return ConvertUtils.convertList(roles, RoleDTO.class);
    }

    public RoleDTO getById(Long id) {
        Role role = roleRepository.findById(id).orElseThrow(() -> new CustomException(SystemMessage.ROLE_NOT_FOUND));
        return ConvertUtils.convert(role, RoleDTO.class);
    }

    public RoleDTO create(RoleDTO req) {
        boolean existByName = roleRepository.existsByName(req.getName());
        if (existByName) {
            throw new CustomException(SystemMessage.ROLE_IS_EXISTED);
        }
        Role role = ConvertUtils.convert(req, Role.class);
        roleRepository.save(role);

        return ConvertUtils.convert(role, RoleDTO.class);
    }

    public RoleDTO update(Long id, RoleDTO roleDTO) {
        Role role = roleRepository.findById(id).orElseThrow(() -> new CustomException(SystemMessage.ROLE_NOT_FOUND));

        boolean existByName = roleRepository.existsByNameAndRoleIdNot(roleDTO.getName(), id);
        if (existByName) {
            throw new CustomException(SystemMessage.ROLE_IS_EXISTED);
        }
        role.setName(roleDTO.getName());
        role.setDescription(roleDTO.getDescription());
        role.setStatus(roleDTO.getStatus());
        roleRepository.save(role);
        return ConvertUtils.convert(role, RoleDTO.class);
    }
}
