package com.example.bookingcinematicket.exception;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.NoHandlerFoundException;

@ControllerAdvice(annotations = Controller.class)
@Slf4j
public class MvcExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public String handleRuntimeException(RuntimeException ex, Model model) {
        log.error("MVC Runtime Error: {}", ex.getMessage(), ex);
        model.addAttribute("errorMessage", "Có lỗi xảy ra! Vui lòng thử lại.");
        return "error-page";
    }

    @ExceptionHandler(Exception.class)
    public String handleException(Exception ex, Model model) {
        log.error("MVC Error: {}", ex.getMessage(), ex);
        model.addAttribute("errorMessage", "Hệ thống gặp lỗi, vui lòng liên hệ hỗ trợ.");
        return "error-page";
    }

//    @ExceptionHandler(NoHandlerFoundException.class)
//    @ResponseStatus(HttpStatus.NOT_FOUND)
//    public String handleNotFoundError(NoHandlerFoundException ex, Model model, HttpServletRequest request) {
//        String requestUri = request.getRequestURI();
//        log.error("MVC Error123: {}", ex.getMessage());
//        if (requestUri.matches(".*\\.(css|js|png|jpg|jpeg|gif|ico|svg|woff2|woff|ttf|map)$")) {
//            return null;
//        }
//        model.addAttribute("errorMessage", "Oops! The page you are looking for does not exist.");
//        return "not-found-error";
//    }
}
