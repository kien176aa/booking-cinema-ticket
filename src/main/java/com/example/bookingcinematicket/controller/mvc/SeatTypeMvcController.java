package com.example.bookingcinematicket.controller.mvc;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@Slf4j
@RequestMapping("/seat-type-management")
public class SeatTypeMvcController {

    @GetMapping
    public String viewRoomManagementPage(){
        return "page/seat-type-page";
    }

}
