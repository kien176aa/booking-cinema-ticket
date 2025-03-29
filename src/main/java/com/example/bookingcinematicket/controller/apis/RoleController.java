package com.example.bookingcinematicket.controller.apis;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.bookingcinematicket.controller.BaseController;
import com.example.bookingcinematicket.dtos.RoleDTO;
import com.example.bookingcinematicket.dtos.common.SearchRequest;
import com.example.bookingcinematicket.dtos.common.SearchResponse;
import com.example.bookingcinematicket.entity.Role;
import com.example.bookingcinematicket.service.RoleService;

@RestController
@RequestMapping("/roles")
public class RoleController extends BaseController {
    @Autowired
    private RoleService roleService;

    @PostMapping("/search")
    public SearchResponse<List<RoleDTO>> search(@RequestBody SearchRequest<String, Role> request) {
        return roleService.search(request);
    }

    @GetMapping("/get-active-role")
    public List<RoleDTO> getActiveRole() {
        return roleService.getActiveRoles();
    }

    @GetMapping("/{id}")
    public RoleDTO getById(@PathVariable Long id) {
        return roleService.getById(id);
    }

    @PostMapping
    @PreAuthorize("@securityService.hasPermission('ROLE_ADMIN')")
    public RoleDTO create(@RequestBody RoleDTO roleDTO) {
        return roleService.create(roleDTO);
    }

    @PutMapping("/{id}")
    @PreAuthorize("@securityService.hasPermission('ROLE_ADMIN')")
    public RoleDTO update(@PathVariable Long id, @RequestBody RoleDTO roleDTO) {
        return roleService.update(id, roleDTO);
    }
}
