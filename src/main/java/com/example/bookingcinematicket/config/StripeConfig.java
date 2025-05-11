package com.example.bookingcinematicket.config;

import org.springframework.context.annotation.Configuration;

import com.stripe.Stripe;

@Configuration
public class StripeConfig {
    public StripeConfig() {
        Stripe.apiKey = "sk_test_51RMqmHFL4Ydn4zhi6gLGJyKc0LzqVr0EDIJ5FIsmMAf1voSK0wTkZlWnD5SYZL1wjNBdIKxvCiPCh4JUWczsmk8c00BXqniB9l";
    }
}
