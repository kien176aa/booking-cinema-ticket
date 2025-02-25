package com.example.bookingcinematicket.service;

import com.example.bookingcinematicket.config.jwt.JwtUtil;
import com.example.bookingcinematicket.constants.SystemMessage;
import com.example.bookingcinematicket.entity.Account;
import com.example.bookingcinematicket.repository.AccountRepository;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import jakarta.servlet.http.Cookie;
@Service
public class AuthService {
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;


    public String login(String email, String password, HttpServletResponse response) {
        try {
            Account account = accountRepository.findByEmail(email);
            if(account == null || !passwordEncoder.matches(password, account.getPassword()))
                return (SystemMessage.INCORRECT_EMAIL_OR_PASSWORD);
            if(!account.getActive())
                return SystemMessage.INACTIVE_ACCOUNT;
            String token = jwtUtil.generateToken(email);

            Cookie cookie = new Cookie(SystemMessage.KEY_COOKIE_JWT, token);
            cookie.setHttpOnly(true);
            cookie.setSecure(true);
            cookie.setPath("/");
            cookie.setMaxAge(7 * 24 * 60 * 60);
            response.addCookie(cookie);
            return "";
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return e.getMessage();
        }
    }

    public void register(Account user) throws Exception {
        Account account = accountRepository.findByEmail(user.getEmail());
        if(account != null){
            throw new Exception(SystemMessage.EMAIL_IS_EXISTED);
        }
        user.setActive(true);
        user.setAccountId(null);
        user.setRole("USER");
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        accountRepository.save(user);
    }
}
