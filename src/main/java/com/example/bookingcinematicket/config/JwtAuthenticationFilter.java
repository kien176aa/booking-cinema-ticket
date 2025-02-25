package com.example.bookingcinematicket.config;

import com.example.bookingcinematicket.config.jwt.JwtUtil;
import com.example.bookingcinematicket.service.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.*;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private CustomUserDetailsService userDetailsService;

    private List<String> authUrl = List.of("/branch-management");

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        Optional<String> jwtOptional = getJwtFromCookies(request);
        String currentUrl = request.getRequestURI();
        System.out.println("Current URL: " + currentUrl);

        if (authUrl.contains(currentUrl) && jwtOptional.isEmpty()) {
            response.sendRedirect("/forbidden");
            return;
        }
        if (jwtOptional.isPresent() && SecurityContextHolder.getContext().getAuthentication() == null) {
            String jwt = jwtOptional.get();

            String email = jwtUtil.extractUsername(jwt);

            if (email != null && jwtUtil.validateToken(jwt)) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);

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

    private boolean hasPermission(UserDetails userDetails, String currentUrl) {
        Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();

        if (currentUrl.startsWith("/admin")) {
            return authorities.stream().anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
        } else if (currentUrl.startsWith("/user")) {
            return authorities.stream().anyMatch(auth -> auth.getAuthority().equals("ROLE_USER"));
        }

        return true;
    }

}
