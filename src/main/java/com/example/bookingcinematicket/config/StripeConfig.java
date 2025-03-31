package com.example.bookingcinematicket.config;

import org.springframework.context.annotation.Configuration;

import com.stripe.Stripe;

@Configuration
public class StripeConfig {
    public StripeConfig() {
        Stripe.apiKey = "sk_test_51R2w4ERtHPK7YGbtdCZCAFfeY53Q6BalOXv3qFyrUfcTmMRo4aKDuqS9r4QjSybnqzNBZtYE4fHtWxXO86NKhcTQ00rjTJi3Jk";
    }
}
