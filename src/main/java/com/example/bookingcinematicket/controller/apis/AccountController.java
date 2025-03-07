package com.example.bookingcinematicket.controller.apis;

import com.example.bookingcinematicket.controller.BaseController;
import com.example.bookingcinematicket.dtos.AccountDTO;
import com.example.bookingcinematicket.dtos.BranchDTO;
import com.example.bookingcinematicket.dtos.common.SearchRequest;
import com.example.bookingcinematicket.dtos.common.SearchResponse;
import com.example.bookingcinematicket.entity.Account;
import com.example.bookingcinematicket.entity.Branch;
import com.example.bookingcinematicket.service.AccountService;
import com.example.bookingcinematicket.service.BranchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/accounts")
public class AccountController extends BaseController {
    @Autowired
    private AccountService accountService;

    @PostMapping("/search")
    public SearchResponse<List<AccountDTO>> search(@RequestBody SearchRequest<String, Account> request) {
        return accountService.search(request);
    }

    @GetMapping("/{id}")
    public AccountDTO getById(@PathVariable Long id) {
        return accountService.getById(id);
    }

    @PostMapping
    public AccountDTO create(@RequestBody AccountDTO dto) {
        return accountService.create(dto);
    }

    @PutMapping("/{id}")
    public AccountDTO update(@PathVariable Long id, @RequestBody AccountDTO dto) {
        return accountService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        accountService.delete(id);
    }

}
