package com.example.bookingcinematicket.service;

import com.example.bookingcinematicket.constants.SystemMessage;
import com.example.bookingcinematicket.dtos.*;
import com.example.bookingcinematicket.dtos.booking.BookingResponse;
import com.example.bookingcinematicket.dtos.booking.SearchBookingRequest;
import com.example.bookingcinematicket.dtos.common.SearchRequest;
import com.example.bookingcinematicket.dtos.common.SearchResponse;
import com.example.bookingcinematicket.entity.*;
import com.example.bookingcinematicket.exception.CustomException;
import com.example.bookingcinematicket.repository.*;
import com.example.bookingcinematicket.utils.ConvertUtils;
import com.example.bookingcinematicket.utils.DateUtils;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.pdf.draw.LineSeparator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.itextpdf.text.Document;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.BaseColor;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfWriter;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.io.ByteArrayOutputStream;

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
        if(LocalDateTime.now().isAfter(showtime.getStartTime())){
            throw new CustomException(SystemMessage.SHOW_TIME_IS_EXPIRED);
        }
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
        seat.setColor(t.getColor());
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
//        booking.setBookingDate(DateUtils.convertToVietnamTime(LocalDateTime.now()));
        booking.setBookingDate(LocalDateTime.now());
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

    public SearchResponse<List<BookingResponse>> search(SearchRequest<SearchBookingRequest, Booking> request, Account currentUser) {
        if(request.getCondition() == null)
            request.setCondition(new SearchBookingRequest());
        request.getCondition().validateInput();
        Page<Booking> bookings = bookingRepository.search(
                request.getCondition().getStartTime(),
                request.getCondition().getEndTime(),
                request.getCondition().getMinPrice(),
                request.getCondition().getMaxPrice(),
                request.getCondition().getKeyWord(),
                request.getCondition().getIsSearchByAccountId(),
                currentUser.getAccountId(),
                request.getPageable(Booking.class)
        );
        SearchResponse<List<BookingResponse>> response = new SearchResponse<>();
        response.setData(ConvertUtils.convertList(bookings.getContent(), BookingResponse.class));
        response.setPageIndex(request.getPageIndex());
        response.setPageSize(request.getPageSize());
        response.setTotalRecords(bookings.getTotalElements());
        return response;
    }

    public byte[] generateBookingPdf(Long bookingId) throws Exception {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(
                () -> new CustomException(SystemMessage.BOOKING_NOT_FOUND)
        );

        Document document = new Document(PageSize.A6);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, baos);
        document.open();

        // Load font
        BaseFont baseFont = BaseFont.createFont(
                new ClassPathResource("fonts/Roboto-Regular.ttf").getURL().getPath(),
                BaseFont.IDENTITY_H,
                BaseFont.EMBEDDED
        );

        Font titleFont = new Font(baseFont, 14, Font.BOLD);
        Font contentFont = new Font(baseFont, 12, Font.NORMAL);
        Font smallFont = new Font(baseFont, 10, Font.NORMAL);
        Font headerFont = new Font(baseFont, 10, Font.BOLD, BaseColor.WHITE);

        // Tiêu đề
        Paragraph title = new Paragraph("CHI TIẾT ĐƠN HÀNG", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(10);
        document.add(title);

        // Đường kẻ ngang
        document.add(new LineSeparator());

        Showtime showtime = booking.getTickets().get(0).getShowtime();

        // Thông tin phim
        document.add(new Paragraph("THÔNG TIN PHIM", titleFont));
        document.add(new Paragraph("Tên Phim: " + showtime.getMovie().getTitle(), contentFont));
        document.add(new Paragraph("Địa chỉ: " + showtime.getRoom().getBranch().getAddress(), contentFont));
        document.add(new Paragraph("Phòng Chiếu: " + showtime.getRoom().getName(), contentFont));

        // Ghế đã đặt
        document.add(new Paragraph("GHẾ ĐÃ ĐẶT", titleFont));
        String seats = String.join(", ", booking.getTickets().stream().map(item -> item.getSeat().getSeatNumber()).toList());
        document.add(new Paragraph(seats, contentFont));

        document.add(new Paragraph("GIÁ VÉ: " + "100000" + " VND", contentFont));

        document.add(new Paragraph(""));

        // Chi tiết đơn hàng
        document.add(new Paragraph("ĐỒ ĂN/UỐNG", titleFont));

        // Bảng chi tiết
        PdfPTable table = new PdfPTable(new float[]{2, 1, 1});
        table.setWidthPercentage(100);
        table.setSpacingBefore(5);

        // Header của bảng (tô nền màu xám)
        PdfPCell cell;
        BaseColor headerColor = new BaseColor(50, 50, 50);

        cell = new PdfPCell(new Phrase("Mục", headerFont));
        cell.setBackgroundColor(headerColor);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        table.addCell(cell);

        cell = new PdfPCell(new Phrase("Số Lượng", headerFont));
        cell.setBackgroundColor(headerColor);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        table.addCell(cell);

        cell = new PdfPCell(new Phrase("Giá", headerFont));
        cell.setBackgroundColor(headerColor);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        table.addCell(cell);

        // Dữ liệu bảng
        for (FoodOrder item : booking.getFoodOrders()) {
            table.addCell(new Phrase(item.getFood().getFoodName(), smallFont));
            table.addCell(new Phrase(String.valueOf(item.getQuantity()), smallFont));
            table.addCell(new Phrase(formatCurrency(item.getPrice()), smallFont));
        }

        document.add(table);

        // Đường kẻ ngang
        document.add(new LineSeparator());

        // Tổng cộng (căn phải)
        Paragraph total = new Paragraph("Tổng Cộng: " + formatCurrency(booking.getTotalAmount()), titleFont);
        total.setAlignment(Element.ALIGN_RIGHT);
        document.add(total);

        document.close();
        return baos.toByteArray();
    }

    // Format tiền tệ
    private String formatCurrency(double amount) {
        return String.format("%,.0f VNĐ", amount);
    }

}
