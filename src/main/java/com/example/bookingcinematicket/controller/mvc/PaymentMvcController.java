package com.example.bookingcinematicket.controller.mvc;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/pay")
public class PaymentMvcController {

    @GetMapping("/checkout")
    public String checkoutPage(Model model) {
        return "page/checkout";
    }
}
