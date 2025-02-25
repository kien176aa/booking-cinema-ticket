package com.example.bookingcinematicket.controller;

import com.example.bookingcinematicket.config.jwt.JwtUtil;
import com.example.bookingcinematicket.constants.SystemMessage;
import com.example.bookingcinematicket.entity.Account;
import com.example.bookingcinematicket.repository.AccountRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.servlet.http.Cookie;
import org.springframework.stereotype.Controller;

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
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                log.info("abc: {}", cookie.getName());
                if (SystemMessage.KEY_COOKIE_JWT.equals(cookie.getName())) {
                    String token = cookie.getValue();
                    if (jwtUtil.validateToken(token)) {
                        log.info("xyz: {}", cookie.getName());
                        String email = jwtUtil.extractUsername(token);
                        account = accountRepository.findByEmail(email);
                        account.setPassword(null);
                    }
                }
            }
        }
        return account;
    }
}
