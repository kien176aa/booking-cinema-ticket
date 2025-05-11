-- Insert sample data for MoviePerson table

-- Gái Già Lắm Chiêu V (movie_id: 1)
INSERT INTO movie_persons (movie_id, person_id, role_id, character_name, role_arr) VALUES
      (1, 5, 1, 'Mai Ly', '1'),                    -- Kaity Nguyễn as a character
      (1, 14, 2, 'Đạo diễn chính', '2'),           -- Trần Bửu Lộc as director
      (1, 17, 3, 'Biên kịch trưởng', '3');         -- Nguyễn Quang Dũng as writer

-- Em Và Trịnh (movie_id: 2)
INSERT INTO movie_persons (movie_id, person_id, role_id, character_name, role_arr) VALUES
      (1, 5, 1, 'Hồng', '1'),                      -- Kaity Nguyễn as a character
      (2, 31, 2, 'Đạo diễn phim', '2'),            -- Phan Gia Nhật Linh as director
      (2, 31, 3, 'Biên kịch chính', '3');          -- Phan Gia Nhật Linh as writer (also director)

-- Lật Mặt 6 (movie_id: 3)
INSERT INTO movie_persons (movie_id, person_id, role_id, character_name, role_arr) VALUES
      (3, 4, 1, 'Lâm', '1'),                       -- Lý Hải as a character
      (3, 4, 2, 'Đạo diễn kiêm diễn viên', '2'),   -- Lý Hải as director
      (3, 4, 3, 'Biên kịch phim', '3');            -- Lý Hải as writer

-- Avengers: Endgame (movie_id: 4)
INSERT INTO movie_persons (movie_id, person_id, role_id, character_name, role_arr) VALUES
      (4, 7, 1, 'Black Widow', '1'),               -- Scarlett Johansson
      (4, 8, 1, 'Captain America', '1'),           -- Chris Evans
      (4, 9, 1, 'Thor', '1'),                      -- Chris Hemsworth
      (4, 20, 1, 'Spider-Man', '1');               -- Tom Holland

-- Parasite (movie_id: 5)
INSERT INTO movie_persons (movie_id, person_id, role_id, character_name, role_arr) VALUES
      (5, 35, 2, 'Đạo diễn phim', '2'),            -- Park Chan-wook as director (fictional assignment)
      (5, 35, 3, 'Biên kịch chính', '3');          -- Park Chan-wook as writer

-- Thương Ngày Nắng Về (movie_id: 6)
INSERT INTO movie_persons (movie_id, person_id, role_id, character_name, role_arr) VALUES
      (6, 1, 1, 'Nga', '1'),                       -- Ngô Thanh Vân
      (6, 15, 2, 'Đạo diễn phim truyền hình', '2'); -- Charlie Nguyễn as director

-- John Wick: Chapter 4 (movie_id: 7)
INSERT INTO movie_persons (movie_id, person_id, role_id, character_name, role_arr) VALUES
      (7, 25, 1, 'John Wick', '1'),                -- Keanu Reeves
      (7, 11, 2, 'Đạo diễn hành động', '2');       -- Christopher Nolan as director (fictional assignment)

-- Nhà Bà Nữ (movie_id: 8)
INSERT INTO movie_persons (movie_id, person_id, role_id, character_name, role_arr) VALUES
      (8, 18, 2, 'Đạo diễn phim', '2'),            -- Phan Gia Nhật Linh as director (fictional assignment)
      (8, 17, 3, 'Biên kịch phụ', '3');            -- Nguyễn Quang Dũng as writer

-- Everything Everywhere All At Once (movie_id: 9)
INSERT INTO movie_persons (movie_id, person_id, role_id, character_name, role_arr) VALUES
      (9, 21, 1, 'Evelyn Wang', '1'),              -- Fictional casting
      (9, 12, 2, 'Đạo diễn độc lập', '2');         -- Quentin Tarantino as director (fictional assignment)

-- Bố Già (movie_id: 10)
INSERT INTO movie_persons (movie_id, person_id, role_id, character_name, role_arr) VALUES
      (10, 1, 1, 'Lan', '1'),                      -- Ngô Thanh Vân
      (10, 29, 2, 'Đạo diễn chính', '2'),          -- Vũ Ngọc Đãng as director
      (10, 17, 3, 'Biên kịch kịch bản', '3');      -- Nguyễn Quang Dũng as writer

-- The Batman (movie_id: 11)
INSERT INTO movie_persons (movie_id, person_id, role_id, character_name, role_arr) VALUES
      (11, 22, 1, 'Batman', '1'),                  -- Leonardo DiCaprio (fictional casting)
      (11, 11, 2, 'Đạo diễn phim siêu anh hùng', '2'), -- Christopher Nolan as director (fictional assignment)
      (11, 16, 3, 'Biên kịch chính', '3');         -- Aaron Sorkin as writer (fictional assignment)

-- Minions: The Rise of Gru (movie_id: 12)
INSERT INTO movie_persons (movie_id, person_id, role_id, character_name, role_arr) VALUES
      (12, 6, 1, 'Gru (voice)', '1'),              -- Will Smith (fictional voice role)
      (12, 13, 2, 'Đạo diễn phim hoạt hình', '2'); -- James Cameron as director (fictional assignment)

-- Thanh Sói (movie_id: 13)
INSERT INTO movie_persons (movie_id, person_id, role_id, character_name, role_arr) VALUES
      (13, 1, 1, 'Trainer', '1'),                  -- Ngô Thanh Vân
      (13, 3, 1, 'Thanh Sói', '1'),                -- Thanh Sói
      (13, 1, 2, 'Đạo diễn kiêm diễn viên', '2'),  -- Ngô Thanh Vân as director
      (13, 1, 4, 'Nhà sản xuất chính', '4');       -- Ngô Thanh Vân as producer

-- Tiệc Trăng Máu (movie_id: 14)
INSERT INTO movie_persons (movie_id, person_id, role_id, character_name, role_arr) VALUES
      (14, 5, 1, 'Linh', '1'),                     -- Kaity Nguyễn
      (14, 2, 1, 'Dũng', '1'),                     -- Johnny Trí Nguyễn
      (14, 31, 2, 'Đạo diễn phim gây cấn', '2');   -- Victor Vũ as director (fictional assignment)

-- Avatar: The Way of Water (movie_id: 15)
INSERT INTO movie_persons (movie_id, person_id, role_id, character_name, role_arr) VALUES
      (15, 13, 2, 'Đạo diễn kiêm sáng tạo', '2'),  -- James Cameron as director
      (15, 13, 3, 'Tác giả chính', '3'),           -- James Cameron as writer
      (15, 13, 4, 'Nhà sản xuất điều hành', '4'),  -- James Cameron as producer
      (15, 22, 1, 'Jake Sully', '1'),              -- Leonardo DiCaprio (fictional casting)
      (15, 23, 1, 'Neytiri', '1');                 -- Margot Robbie (fictional casting)

-- Spider-Man: No Way Home (movie_id: 16)
INSERT INTO movie_persons (movie_id, person_id, role_id, character_name, role_arr) VALUES
      (16, 20, 1, 'Peter Parker/Spider-Man', '1'), -- Tom Holland
      (16, 21, 1, 'MJ', '1'),                      -- Zendaya
      (16, 32, 2, 'Đạo diễn Marvel', '2');         -- Fictional director

-- Hai Phượng (movie_id: 17)
INSERT INTO movie_persons (movie_id, person_id, role_id, character_name, role_arr) VALUES
      (17, 1, 1, 'Hai Phượng', '1'),               -- Ngô Thanh Vân
      (17, 1, 4, 'Nhà sản xuất và diễn viên', '4'), -- Ngô Thanh Vân as producer
      (17, 30, 2, 'Đạo diễn phim hành động', '2'); -- Lê Thanh Sơn as director (fictional assignment)

-- Fast & Furious 9 (movie_id: 18)
INSERT INTO movie_persons (movie_id, person_id, role_id, character_name, role_arr) VALUES
      (18, 10, 1, 'Hobbs', '1'),                   -- Dwayne Johnson
      (18, 13, 2, 'Đạo diễn phim hành động', '2'); -- James Cameron as director (fictional assignment)

-- Lightyear (movie_id: 19)
INSERT INTO movie_persons (movie_id, person_id, role_id, character_name, role_arr) VALUES
      (19, 8, 1, 'Buzz Lightyear (voice)', '1'),   -- Chris Evans
      (19, 33, 2, 'Đạo diễn phim hoạt hình', '2'); -- Peter Jackson as director (fictional assignment)

-- Chiến Binh Báo Đen 2 (movie_id: 20)
INSERT INTO movie_persons (movie_id, person_id, role_id, character_name, role_arr) VALUES
      (20, 21, 1, 'Shuri', '1'),                   -- Zendaya (fictional casting)
      (20, 34, 2, 'Đạo diễn thương hiệu', '2'),    -- George Lucas as director (fictional assignment)
      (20, 16, 3, 'Biên kịch điều chỉnh', '3');    -- Aaron Sorkin as writer (fictional assignment)