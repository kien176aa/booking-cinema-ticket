package com.example.bookingcinematicket.utils;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

public class DateUtils {
    public static LocalDateTime convertToVietnamTime(LocalDateTime localDateTime) {
        ZonedDateTime utcZonedDateTime = localDateTime.atZone(ZoneId.of("UTC"));

        ZonedDateTime vietnamZonedDateTime = utcZonedDateTime.withZoneSameInstant(ZoneId.of("Asia/Ho_Chi_Minh"));

        return vietnamZonedDateTime.toLocalDateTime();
    }

    public static String formatTimeHHmm(LocalDateTime dateTime) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
        return dateTime.format(formatter);
    }
}
