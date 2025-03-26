package com.example.bookingcinematicket.controller.apis;

import com.example.bookingcinematicket.constants.SystemMessage;
import com.example.bookingcinematicket.entity.Showtime;
import com.example.bookingcinematicket.exception.CustomException;
import com.example.bookingcinematicket.repository.ShowtimeRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/payment")
@Slf4j
public class PaymentController {

    @Autowired
    private ShowtimeRepository showtimeRepository;

    @PostMapping("/create")
    public ResponseEntity<String> createPaymentIntent(@RequestParam("amount") Long amount, @RequestParam Long showtimeId) {
        log.info("amount: {}", amount);
        if(showtimeId == null)
            throw new CustomException(SystemMessage.SHOW_TIME_IS_REQUIRED);
        Showtime showtime = showtimeRepository.findById(showtimeId).orElseThrow(
                () -> new CustomException(SystemMessage.SHOW_TIME_NOT_FOUND)
        );
        if(SystemMessage.SHOW_TIME_STATUS_SOLD_OUT.equals(showtime.getStatus())
                || LocalDateTime.now().isAfter(showtime.getStartTime())){
            throw new CustomException(SystemMessage.SHOW_TIME_IS_EXPIRED_OR_SOLD_OUT);
        }
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
