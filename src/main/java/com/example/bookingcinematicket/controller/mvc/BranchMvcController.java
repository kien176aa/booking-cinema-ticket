package com.example.bookingcinematicket.controller.mvc;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.example.bookingcinematicket.controller.BaseController;
import com.example.bookingcinematicket.entity.Account;

@Controller
public class BranchMvcController extends BaseController {

    @GetMapping("/branch-management")
    @PreAuthorize("@securityService.hasPermission('ROLE_ADMIN')")
    public String getIconsPage(Model model) {
        Account account = getCurrentUser();
        model.addAttribute("account", account);
        return "page/branch-page";
    }
}
