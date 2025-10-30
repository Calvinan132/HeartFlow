create database heart
use heart
drop table users
drop table messages
drop table memories
drop table friend_requests
drop table partner_requests
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
	firstname VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL,
	lastname VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL,
    image_url VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    partner INT DEFAULT NULL,
    role VARCHAR(10) DEFAULT 'user',
    FOREIGN KEY (partner) REFERENCES users(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_read BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (receiver_id) REFERENCES users(id)
);

CREATE TABLE memories (
    MemoryId INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    partner_id INT DEFAULT NULL,
    created_at DATE ,
    title VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    content TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    image_url VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (partner_id) REFERENCES users(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE TABLE friend_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    status ENUM('PENDING', 'ACCEPTED') NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Đảm bảo người gửi và người nhận phải tồn tại
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id),
    
    -- Đảm bảo không có yêu cầu trùng lặp đang chờ xử lý (tùy chọn)
    UNIQUE KEY unique_request (sender_id, receiver_id)
);

CREATE TABLE partner_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    status ENUM('pending', 'accepted') NOT NULL DEFAULT 'pending',
    love_date DATE ,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Khóa ngoại trỏ đến bảng users
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Đảm bảo một người không thể tự gửi yêu cầu cho chính mình
    CHECK (sender_id != receiver_id),
    
    -- Đảm bảo người A chỉ có thể gửi 1 yêu cầu cho người B tại một thời điểm
    UNIQUE KEY uk_partner_request (sender_id, receiver_id)
);

truncate table users
truncate table messages
truncate table memories
truncate table partner_requests
-- 1. Tạm thời vô hiệu hóa kiểm tra khóa ngoại
SET FOREIGN_KEY_CHECKS = 0;

-- 2. Thực hiện xóa bảng users
TRUNCATE TABLE users;

-- (Tùy chọn) Xóa luôn bảng messages nếu bạn muốn xóa sạch dữ liệu liên quan
TRUNCATE TABLE messages;

-- 3. Kích hoạt lại kiểm tra khóa ngoại
SET FOREIGN_KEY_CHECKS = 1;
	

update users set partner = null where id = 1
update users set partner = null where id = 2

INSERT INTO friend_requests ( `sender_id`, `receiver_id`, `status`) VALUES ('2', '1', 'PENDING')
INSERT INTO memories (user_id, partner_id, title, content, image_url)
VALUES (1, 2, 'Chuyến đi Vũng Tàu', 'Hôm nay chúng ta đi biển cùng nhau, trời đẹp quá!', 'https://example.com/beach.jpg');