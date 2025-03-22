package com.example.bookingcinematicket.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.bookingcinematicket.entity.Account;
import com.example.bookingcinematicket.repository.AccountRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private AccountRepository accountRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Account byLogin = accountRepository.findByEmail(email);
        if (byLogin == null) {
            return null;
        }
        return User.builder()
                .username(byLogin.getEmail())
                .password(byLogin.getPassword())
                .roles(byLogin.getRole())
                .build();
    }
}
