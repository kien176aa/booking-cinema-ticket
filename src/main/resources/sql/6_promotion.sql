-- Giảm giá cho các chi nhánh, cập nhật title và description theo dịp đặc biệt
INSERT INTO promotions (title, description, discountAmount, discountPercent, startDate, endDate, minPurchase, maxDiscount, status, branch_id)
VALUES
    ('Khuyến mãi Tết Nguyên Đán 2025', 'Giảm 10% cho tất cả các vé xem phim nhân dịp Tết Nguyên Đán 2025', NULL, 10.0, NOW(), DATE_ADD(NOW(), INTERVAL 1 MONTH), 100000.0, 50000.0, TRUE, 1), -- Chi nhánh 1
    ('Giảm giá Ngày Quốc Tế Lao Động', 'Giảm 50,000đ cho tất cả vé nhân ngày Quốc Tế Lao Động 1/5', 50000.0, NULL, NOW(), DATE_ADD(NOW(), INTERVAL 15 DAY), 200000.0, 50000.0, TRUE, 1), -- Chi nhánh 1
    ('Khuyến Mãi Ngày Quốc Khánh', 'Giảm 20% cho vé xem phim nhân dịp Ngày Quốc Khánh 2/9', NULL, 20.0, NOW(), DATE_ADD(NOW(), INTERVAL 1 WEEK), 50000.0, 10000.0, TRUE, 2), -- Chi nhánh 2
    ('Giảm giá Ngày Lễ Tình Nhân', 'Giảm 30,000đ cho vé nhóm từ 2 người trở lên vào Ngày Lễ Tình Nhân 14/2', 30000.0, NULL, NOW(), DATE_ADD(NOW(), INTERVAL 10 DAY), 150000.0, 30000.0, TRUE, 2), -- Chi nhánh 2
    ('Giảm giá Ngày Phụ Nữ Việt Nam', 'Giảm 15% cho tất cả các vé xem phim trong Ngày Phụ Nữ Việt Nam 20/10', NULL, 15.0, NOW(), DATE_ADD(NOW(), INTERVAL 2 WEEKS), 100000.0, 30000.0, TRUE, 3), -- Chi nhánh 3
    ('Khuyến Mãi Giáng Sinh', 'Giảm 10% cho vé VIP nhân dịp Giáng Sinh', NULL, 10.0, NOW(), DATE_ADD(NOW(), INTERVAL 20 DAY), 200000.0, 10000.0, TRUE, 3); -- Chi nhánh 3
