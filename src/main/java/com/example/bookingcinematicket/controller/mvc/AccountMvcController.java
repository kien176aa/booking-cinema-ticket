package com.example.bookingcinematicket.controller.mvc;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AccountMvcController {

    @GetMapping("/account-management")
    public String getIconsPage() {
        return "page/account-page";
    }
}
