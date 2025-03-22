package com.example.bookingcinematicket.controller.apis;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;

@RestController
@RequestMapping("/payment")
public class PaymentController {

    @PostMapping("/create")
    public ResponseEntity<String> createPaymentIntent(@RequestParam("amount") long amount) {
        try {
            // Thực hiện tạo PaymentIntent
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(amount) // Amount in cents
                    .setCurrency("vnd") // Currency (change if necessary)
                    .build();

            PaymentIntent paymentIntent = PaymentIntent.create(params);

            // Trả về client secret dưới dạng JSON hợp lệ
            return ResponseEntity.ok("{\"clientSecret\": \"" + paymentIntent.getClientSecret() + "\"}");
        } catch (StripeException e) {
            e.printStackTrace();
            // Trả về lỗi dưới dạng JSON hợp lệ
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Failed to create payment intent: " + e.getMessage() + "\"}");
        }
    }
}
