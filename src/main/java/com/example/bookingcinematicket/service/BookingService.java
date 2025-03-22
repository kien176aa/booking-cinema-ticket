package com.example.bookingcinematicket.service;

import com.example.bookingcinematicket.constants.SystemMessage;
import com.example.bookingcinematicket.dtos.*;
import com.example.bookingcinematicket.entity.*;
import com.example.bookingcinematicket.exception.CustomException;
import com.example.bookingcinematicket.repository.*;
import com.example.bookingcinematicket.utils.ConvertUtils;
import com.example.bookingcinematicket.utils.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class BookingService {
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private SeatRepository seatRepository;
    @Autowired
    private SeatTypeRepository seatTypeRepository;
    @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private ShowtimeRepository showtimeRepository;
    @Autowired
    private FoodOrderRepository foodOrderRepository;
    @Autowired
    private TicketRepository ticketRepository;
    @Transactional
    public void booking(BookingDTO req, Account account){
        req.validateInput();
        Booking booking = setBookingInfo(req, account);
        bookingRepository.save(booking);
        Room room = getRoomById(req.getTickets().get(0).getRoomId());
        Showtime showtime = getShowtimeById(req.getTickets().get(0).getShowtimeId());
        for (TicketDTO t : req.getTickets()) {
            saveSeatAndTicketInfo(t, room, showtime, booking);
        }
        saveFoodOrders(booking, req);
    }

    private void saveFoodOrders(Booking booking, BookingDTO req) {
        if (req.getFoodOrders() == null || req.getFoodOrders().isEmpty())
            return;
        List<FoodOrder> foodOrders = new ArrayList<>();
        for (FoodOrderDTO dto : req.getFoodOrders()){
            FoodOrder foodOrder = new FoodOrder();
            foodOrder.setBooking(booking);
            foodOrder.setFood(new Food());
            foodOrder.getFood().setFoodId(dto.getFoodId());
            foodOrder.setPrice(dto.getPrice());
            foodOrder.setQuantity(dto.getQuantity());
            foodOrders.add(foodOrder);
        }
        foodOrderRepository.saveAll(foodOrders);
    }

    private void saveSeatAndTicketInfo(TicketDTO t, Room room, Showtime showtime, Booking booking) {
        Seat seat = new Seat();
        seat.setSeatType(new SeatType());
        seat.getSeatType().setSeatTypeId(t.getSeatTypeId());
        seat.setRoom(room);
        seat.setSeatNumber(t.getSeatNumber());
        seatRepository.save(seat);
        Ticket ticket = new Ticket();
        ticket.setBooking(booking);
        ticket.setSeat(seat);
        ticket.setShowtime(showtime);
        ticket.setPrice(t.getPrice());
        ticketRepository.save(ticket);
    }

    private Booking setBookingInfo(BookingDTO req, Account account) {
        Booking booking = new Booking();
        booking.setBookingDate(DateUtils.convertToVietnamTime(LocalDateTime.now()));
        if(req.getPromotion() != null && req.getPromotion().getPromotionId() != null){
            booking.setPromotion(new Promotion());
            booking.getPromotion().setPromotionId(req.getPromotion().getPromotionId());
        }
        booking.setBookingStatus(SystemMessage.BOOKING_SUCCESS);
        booking.setPaymentMethod(SystemMessage.BOOKING_PAYMENT_METHOD);
        booking.setPaymentStatus(SystemMessage.BOOKING_SUCCESS);
        booking.setTotalAmount(req.getTotalAmount());
        booking.setAccount(new Account());
        booking.getAccount().setAccountId(account.getAccountId());
        return booking;
    }

    private Showtime getShowtimeById(Long showtimeId) {
        return showtimeRepository.findById(showtimeId).orElseThrow(
                () -> new CustomException(SystemMessage.SHOW_TIME_NOT_FOUND)
        );
    }

    private Room getRoomById(Long roomId) {
        return roomRepository.findById(roomId).orElseThrow(
                () -> new CustomException(SystemMessage.ROOM_NOT_FOUND)
        );
    }
}
