package com.example.bookingcinematicket.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.bookingcinematicket.constants.SystemMessage;

import lombok.extern.slf4j.Slf4j;

@RestControllerAdvice(annotations = RestController.class)
@Slf4j
public class ApiExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException ex) {
        log.error("API Runtime Error: {}", ex.getMessage(), ex);
        return ResponseEntity.badRequest().body(SystemMessage.ERROR_500);
    }

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<String> handleCustomException(CustomException ex) {
        log.error("API Custom Error: {}", ex.getMessage(), ex);
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleAllExceptions(Exception ex) {
        log.error("API Error: {}", ex.getMessage(), ex);
        return ResponseEntity.badRequest().body(SystemMessage.ERROR_500);
    }
}
