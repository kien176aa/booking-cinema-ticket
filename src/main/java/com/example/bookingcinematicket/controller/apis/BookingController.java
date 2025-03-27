package com.example.bookingcinematicket.controller.apis;

import com.example.bookingcinematicket.controller.BaseController;
import com.example.bookingcinematicket.dtos.BookingDTO;
import com.example.bookingcinematicket.dtos.booking.BookingResponse;
import com.example.bookingcinematicket.dtos.booking.SearchBookingRequest;
import com.example.bookingcinematicket.dtos.common.SearchRequest;
import com.example.bookingcinematicket.dtos.common.SearchResponse;
import com.example.bookingcinematicket.entity.Booking;
import com.example.bookingcinematicket.service.BookingService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpHeaders;

import java.util.List;

@RestController
@RequestMapping("/booking")
@Slf4j
public class BookingController extends BaseController {

    @Autowired
    private BookingService bookingService;
    @PostMapping
    public void booking(@RequestBody BookingDTO request){
        bookingService.booking(request, getCurrentUser());
    }

    @PostMapping("/search")
    public SearchResponse<List<BookingResponse>> search(@RequestBody SearchRequest<SearchBookingRequest, Booking> request){
        log.info("req {}", request);
        return bookingService.search(request, getCurrentUser());
    }

    @GetMapping("/generate-pdf/{id}")
    public ResponseEntity<byte[]> generateBookingPdf(@PathVariable Long id) {
        try {
            byte[] pdfBytes = bookingService.generateBookingPdf(id);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(
                    ContentDisposition.builder("attachment")
                            .filename("ticket.pdf")
                            .build()
            );

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Loi PDF: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
