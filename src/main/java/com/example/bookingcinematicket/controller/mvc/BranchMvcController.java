package com.example.bookingcinematicket.controller.mvc;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class BranchMvcController {

    @GetMapping("/branch-management")
    public String getIconsPage() {
        return "page/branch-page";
    }
}
