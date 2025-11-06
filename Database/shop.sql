use heart
-- Sử dụng InnoDB engine để hỗ trợ Foreign Keys và Transactions
SET default_storage_engine=InnoDB;

-- 1. Bảng `categories` (Danh mục)
-- Phải tạo trước `products` vì `products` sẽ tham chiếu đến nó
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Bảng `products` (Sản phẩm)
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL, -- Ví dụ: 99999999.99
    stock_quantity INT NOT NULL DEFAULT 0,
    image_url VARCHAR(1024),
    category_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Tạo khóa ngoại liên kết với bảng `categories`
    FOREIGN KEY (category_id) 
        REFERENCES categories(id) 
        ON DELETE SET NULL -- Nếu xóa danh mục, sản phẩm không bị xóa, chỉ set category_id = NULL
);

-- 4. Bảng `orders` (Đơn hàng)
-- Lưu thông tin chung của mỗi đơn hàng
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(12, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
    shipping_address TEXT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Tạo khóa ngoại liên kết với bảng `users`
    FOREIGN KEY (user_id) 
        REFERENCES users(id)
        ON DELETE RESTRICT -- Ngăn không cho xóa user nếu họ đã có đơn hàng
);

-- 5. Bảng `order_items` (Chi tiết đơn hàng)
-- Bảng trung gian cho quan hệ Nhiều-Nhiều (Orders <-> Products)
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price_at_purchase DECIMAL(10, 2) NOT NULL, -- Lưu lại giá tại thời điểm mua
    
    -- Tạo khóa ngoại liên kết với bảng `orders`
    FOREIGN KEY (order_id) 
        REFERENCES orders(id)
        ON DELETE CASCADE, -- Nếu xóa đơn hàng, chi tiết của nó cũng bị xóa
        
    -- Tạo khóa ngoại liên kết với bảng `products`
    FOREIGN KEY (product_id) 
        REFERENCES products(id)
        ON DELETE RESTRICT -- Ngăn không cho xóa sản phẩm nếu nó đã nằm trong 1 đơn hàng
);

-- 6. Bảng `cart_items` (Giỏ hàng)
-- Lưu giỏ hàng hiện tại của người dùng
CREATE TABLE cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Đảm bảo mỗi sản phẩm chỉ xuất hiện 1 lần trong giỏ hàng của 1 user
    UNIQUE KEY uk_user_product (user_id, product_id),
    
    -- Tạo khóa ngoại
    FOREIGN KEY (user_id) 
        REFERENCES users(id)
        ON DELETE CASCADE, -- Nếu user bị xóa, giỏ hàng của họ cũng xóa
        
    FOREIGN KEY (product_id) 
        REFERENCES products(id)
        ON DELETE CASCADE -- Nếu sản phẩm bị xóa (ngừng bán), nó cũng bị xóa khỏi giỏ hàng
);