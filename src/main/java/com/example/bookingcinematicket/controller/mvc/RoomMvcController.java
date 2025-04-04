package com.example.bookingcinematicket.controller.mvc;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.bookingcinematicket.controller.BaseController;
import com.example.bookingcinematicket.entity.Account;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequestMapping("/room-management")
@PreAuthorize("@securityService.hasPermission('ROLE_ADMIN')")
public class RoomMvcController extends BaseController {

    @GetMapping
    public String viewRoomManagementPage(Model model) {
        Account account = getCurrentUser();
        model.addAttribute("account", account);
        return "page/room-page";
    }
}
