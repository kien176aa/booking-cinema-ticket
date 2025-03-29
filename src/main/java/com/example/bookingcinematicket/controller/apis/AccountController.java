package com.example.bookingcinematicket.controller.apis;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.bookingcinematicket.controller.BaseController;
import com.example.bookingcinematicket.dtos.AccountDTO;
import com.example.bookingcinematicket.dtos.auth.ChangePasswordRequest;
import com.example.bookingcinematicket.dtos.common.SearchRequest;
import com.example.bookingcinematicket.dtos.common.SearchResponse;
import com.example.bookingcinematicket.entity.Account;
import com.example.bookingcinematicket.service.AccountService;

@RestController
@RequestMapping("/accounts")
public class AccountController extends BaseController {
    @Autowired
    private AccountService accountService;

    @PostMapping("/search")
    public SearchResponse<List<AccountDTO>> search(@RequestBody SearchRequest<String, Account> request) {
        return accountService.search(request, getCurrentUser());
    }

    @GetMapping("/{id}")
    public AccountDTO getById(@PathVariable Long id) {
        return accountService.getById(id);
    }

    @PostMapping
    @PreAuthorize("@securityService.hasPermission('ROLE_ADMIN')")
    public AccountDTO create(@RequestBody AccountDTO dto) {
        return accountService.create(dto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("@securityService.hasPermission('ROLE_ADMIN')")
    public AccountDTO update(@PathVariable Long id, @RequestBody AccountDTO dto) {
        return accountService.update(id, dto);
    }

    @PutMapping("change-password")
    public void changePassword(@RequestBody ChangePasswordRequest request) {
        accountService.changePassword(request, getCurrentUser().getAccountId());
    }

}
