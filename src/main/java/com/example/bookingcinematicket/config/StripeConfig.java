package com.example.bookingcinematicket.config;

import org.springframework.context.annotation.Configuration;

import com.stripe.Stripe;

@Configuration
public class StripeConfig {
    public StripeConfig() {
        Stripe.apiKey = "";
    }
}
