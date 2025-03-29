package com.example.bookingcinematicket.config;

import java.io.IOException;
import java.util.*;

import com.example.bookingcinematicket.entity.Account;
import com.example.bookingcinematicket.repository.AccountRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.bookingcinematicket.config.jwt.JwtUtil;
import com.example.bookingcinematicket.constants.SystemMessage;
import com.example.bookingcinematicket.service.CustomUserDetailsService;

@Component
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        Optional<String> jwtOptional = getJwtFromCookies(request);
        String currentUrl = request.getRequestURI();
        System.out.println("Current URL: " + currentUrl);
        if ((SystemMessage.adminAccessUrl.contains(currentUrl) || SystemMessage.userAccessUrl.contains(currentUrl))
                && jwtOptional.isEmpty()) {
            response.sendRedirect("/forbidden");
            return;
        }
        if (jwtOptional.isPresent() && SecurityContextHolder.getContext().getAuthentication() == null) {
            String jwt = jwtOptional.get();
            if (!jwtUtil.validateToken(jwt)) {
                Cookie jwtCookie = new Cookie(SystemMessage.KEY_COOKIE_JWT, "");
                jwtCookie.setMaxAge(0);
                jwtCookie.setPath("/");

                response.addCookie(jwtCookie);
                response.sendRedirect("/auth/login");
                return;
            }
            String email = jwtUtil.extractUsername(jwt);

            if (email != null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                if (userDetails == null) {
                    Cookie jwtCookie = new Cookie(SystemMessage.KEY_COOKIE_JWT, "");
                    jwtCookie.setMaxAge(0);
                    jwtCookie.setPath("/");

                    response.addCookie(jwtCookie);
                    response.sendRedirect("/auth/login");
                    return;
                }
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }

    private Optional<String> getJwtFromCookies(HttpServletRequest request) {
        if (request.getCookies() == null) return Optional.empty();

        return Arrays.stream(request.getCookies())
                .filter(cookie -> "JWT_TOKEN".equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst();
    }

}
