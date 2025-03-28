package com.example.bookingcinematicket.controller.mvc;

import com.example.bookingcinematicket.dtos.auth.LoginResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.bookingcinematicket.constants.SystemMessage;
import com.example.bookingcinematicket.dtos.auth.LoginRequest;
import com.example.bookingcinematicket.entity.Account;
import com.example.bookingcinematicket.service.AuthService;

@Controller
@RequestMapping("/auth")
@Slf4j
public class AuthController {
    @Autowired
    private AuthService authService;

    @GetMapping("/login")
    public String getLoginPage() {
        return "auth-login-basic";
    }

    @GetMapping("/logout")
    public String logout(HttpServletRequest request, HttpServletResponse response) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (SystemMessage.KEY_COOKIE_JWT.equals(cookie.getName())) {
                    cookie.setMaxAge(0);
                    cookie.setPath("/");
                    response.addCookie(cookie);
                }
            }
        }
        return "auth-login-basic";
    }

    @PostMapping("/login")
    public String login(@ModelAttribute LoginRequest request, HttpServletResponse response, Model model) {
        LoginResponse res = authService.login(request.getEmail(), request.getPassword(), response);

        if (res.getMessage().isEmpty()) {
            if(SystemMessage.ROLE_ADMIN.equals(res.getRole()))
                return "redirect:/";
            else
                return "redirect:/home";
        } else {
            model.addAttribute("error", res.getMessage());
            return "auth-login-basic";
        }
    }

    @PostMapping("/register")
    public String registerUser(@ModelAttribute Account user, Model model) {
        try {
            authService.register(user);
            model.addAttribute("mess", SystemMessage.REGISTER_SUCCESS);
            return "auth-login-basic";
        } catch (Exception ex) {
            model.addAttribute("error", ex.getMessage());
            return "auth-register-basic";
        }
    }

    @GetMapping("/register")
    public String getRegisterPage() {
        return "auth-register-basic";
    }

    @GetMapping("/forgot-password")
    public String getForgotPasswordPage() {
        return "auth-forgot-password-basic";
    }

    @PostMapping("/forgot-password")
    public String sendMailForgotPasswordPage(String email, Model model) {
        try{
            authService.sendCodeForgotPass(email);
            return "auth-login-basic";
        }catch (Exception ex){
            model.addAttribute("mess", "Email không chính xác");
            log.error("EX: {}", ex.getMessage());
            return "auth-forgot-password-basic";
        }
    }
}
