package com.example.bookingcinematicket.controller.mvc;

import com.example.bookingcinematicket.controller.BaseController;
import com.example.bookingcinematicket.entity.Account;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class CheckBookingCodeMvcController extends BaseController {

    @GetMapping("/booking-code-management")
    @PreAuthorize("@securityService.hasPermission('ROLE_ADMIN')")
    public String getIconsPage(Model model) {
        Account account = getCurrentUser();
        model.addAttribute("account", account);
        return "page/check-booking-code-page";
    }
}
