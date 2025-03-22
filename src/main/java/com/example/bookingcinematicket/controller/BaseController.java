package com.example.bookingcinematicket.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.example.bookingcinematicket.config.jwt.JwtUtil;
import com.example.bookingcinematicket.constants.SystemMessage;
import com.example.bookingcinematicket.entity.Account;
import com.example.bookingcinematicket.exception.CustomException;
import com.example.bookingcinematicket.repository.AccountRepository;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
public abstract class BaseController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    HttpServletRequest request;

    protected Account getCurrentUser() {
        Cookie[] cookies = request.getCookies();
        Account account = null;
        try {
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if (SystemMessage.KEY_COOKIE_JWT.equals(cookie.getName())) {
                        String token = cookie.getValue();
                        if (jwtUtil.validateToken(token)) {
                            log.info("xyz: {}", cookie.getName());
                            String email = jwtUtil.extractUsername(token);
                            account = accountRepository.findByEmail(email);
                        }
                    }
                }
            }
            return account;
        } catch (Exception ex) {
            throw new CustomException(SystemMessage.ERROR_500);
        }
    }
}
