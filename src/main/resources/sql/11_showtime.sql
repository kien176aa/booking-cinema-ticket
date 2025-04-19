-- Phim 1: Gái Già Lắm Chiêu V (120 phút)
INSERT INTO showtimes (movie_id, room_id, branch_id, start_time, end_time, price, status)
VALUES
    (1, 1, 1, CURRENT_DATE + INTERVAL 1 DAY + INTERVAL '07:00:00' HOUR_SECOND,
     CURRENT_DATE + INTERVAL 1 DAY + INTERVAL '09:40:00' HOUR_SECOND,
     120000, 'Còn vé'),
    (1, 1, 1, CURRENT_DATE + INTERVAL 2 DAY + INTERVAL '07:00:00' HOUR_SECOND,
     CURRENT_DATE + INTERVAL 2 DAY + INTERVAL '09:40:00' HOUR_SECOND,
     120000, 'Còn vé');

-- Phim 2: Em Và Trịnh (90 phút)
INSERT INTO showtimes (movie_id, room_id, branch_id, start_time, end_time, price, status)
VALUES
    (2, 1, 1, CURRENT_DATE + INTERVAL 1 DAY + INTERVAL '09:40:00' HOUR_SECOND,
     CURRENT_DATE + INTERVAL 1 DAY + INTERVAL '11:10:00' HOUR_SECOND,
     150000, 'Còn vé'),
    (2, 1, 1, CURRENT_DATE + INTERVAL 2 DAY + INTERVAL '09:40:00' HOUR_SECOND,
     CURRENT_DATE + INTERVAL 2 DAY + INTERVAL '11:10:00' HOUR_SECOND,
     150000, 'Còn vé');

-- Phim 3: Lật Mặt 6: Tấm Vé Định Mệnh (150 phút)
INSERT INTO showtimes (movie_id, room_id, branch_id, start_time, end_time, price, status)
VALUES
    (3, 1, 1, CURRENT_DATE + INTERVAL 1 DAY + INTERVAL '11:10:00' HOUR_SECOND,
     CURRENT_DATE + INTERVAL 1 DAY + INTERVAL '13:40:00' HOUR_SECOND,
     110000, 'Còn vé'),
    (3, 1, 1, CURRENT_DATE + INTERVAL 2 DAY + INTERVAL '11:10:00' HOUR_SECOND,
     CURRENT_DATE + INTERVAL 2 DAY + INTERVAL '13:40:00' HOUR_SECOND,
     110000, 'Còn vé');

-- Phim 4: Avengers: Endgame (180 phút)
INSERT INTO showtimes (movie_id, room_id, branch_id, start_time, end_time, price, status)
VALUES
    (4, 1, 1, CURRENT_DATE + INTERVAL 1 DAY + INTERVAL '13:40:00' HOUR_SECOND,
     CURRENT_DATE + INTERVAL 1 DAY + INTERVAL '16:40:00' HOUR_SECOND,
     200000, 'Còn vé'),
    (4, 1, 1, CURRENT_DATE + INTERVAL 2 DAY + INTERVAL '13:40:00' HOUR_SECOND,
     CURRENT_DATE + INTERVAL 2 DAY + INTERVAL '16:40:00' HOUR_SECOND,
     200000, 'Còn vé');

-- Phim 5: Parasite (132 phút)
INSERT INTO showtimes (movie_id, room_id, branch_id, start_time, end_time, price, status)
VALUES
    (5, 1, 1, CURRENT_DATE + INTERVAL 1 DAY + INTERVAL '16:40:00' HOUR_SECOND,
     CURRENT_DATE + INTERVAL 1 DAY + INTERVAL '18:52:00' HOUR_SECOND,
     130000, 'Còn vé'),
    (5, 1, 1, CURRENT_DATE + INTERVAL 2 DAY + INTERVAL '16:40:00' HOUR_SECOND,
     CURRENT_DATE + INTERVAL 2 DAY + INTERVAL '18:52:00' HOUR_SECOND,
     130000, 'Còn vé');

-- Phim 6: Thương Ngày Nắng Về (100 phút)
INSERT INTO showtimes (movie_id, room_id, branch_id, start_time, end_time, price, status)
VALUES
    (6, 1, 1, CURRENT_DATE + INTERVAL 1 DAY + INTERVAL '18:52:00' HOUR_SECOND,
     CURRENT_DATE + INTERVAL 1 DAY + INTERVAL '20:32:00' HOUR_SECOND,
     120000, 'Còn vé'),
    (6, 1, 1, CURRENT_DATE + INTERVAL 2 DAY + INTERVAL '18:52:00' HOUR_SECOND,
     CURRENT_DATE + INTERVAL 2 DAY + INTERVAL '20:32:00' HOUR_SECOND,
     120000, 'Còn vé');

-- Phim 7: John Wick: Chapter 4 (169 phút)
INSERT INTO showtimes (movie_id, room_id, branch_id, start_time, end_time, price, status)
VALUES
    (7, 1, 1, CURRENT_DATE + INTERVAL 1 DAY + INTERVAL '20:32:00' HOUR_SECOND,
     CURRENT_DATE + INTERVAL 1 DAY + INTERVAL '23:21:00' HOUR_SECOND,
     140000, 'Còn vé'),
    (7, 1, 1, CURRENT_DATE + INTERVAL 2 DAY + INTERVAL '20:32:00' HOUR_SECOND,
     CURRENT_DATE + INTERVAL 2 DAY + INTERVAL '23:21:00' HOUR_SECOND,
     140000, 'Còn vé');