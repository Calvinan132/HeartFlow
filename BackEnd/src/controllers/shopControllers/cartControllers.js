import db from "../../config/db.js";
// 1. Logic cho GET /api/cart
// Lấy tất cả các món hàng trong giỏ của user
let getCart = async (req, res) => {
  const userId = req.user.id; // Lấy từ middleware authenticateToken

  try {
    // Lấy tất cả các món hàng, JOIN với bảng Products để lấy thông tin
    const [items] = await db.query(
      `SELECT 
                ci.id, 
                ci.quantity, 
                ci.product_id,
                p.name, 
                p.price, 
                p.image_url 
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.user_id = ?`,
      [userId]
    );

    res.status(200).json({ items: items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server khi lấy giỏ hàng" });
  }
};

// 2. Logic cho POST /api/cart/add
// Thêm sản phẩm vào giỏ. Nếu đã có, cộng dồn số lượng.
let addToCart = async (req, res) => {
  const userId = req.user.id;
  const { product_id, quantity } = req.body;

  if (!product_id || !quantity || quantity <= 0) {
    return res
      .status(400)
      .json({ message: "Thiếu product_id hoặc quantity không hợp lệ" });
  }

  try {
    // Câu lệnh SQL "thần thánh":
    // 1. Thử INSERT một hàng mới
    // 2. Nếu vi phạm UNIQUE key (uk_user_product),
    //    thay vì báo lỗi, nó sẽ UPDATE hàng đã có
    //    và cộng dồn số lượng (quantity = quantity + VALUES(quantity))
    const sql = `
            INSERT INTO cart_items (user_id, product_id, quantity)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE
                quantity = quantity + VALUES(quantity)
        `;

    await db.query(sql, [userId, product_id, quantity]);

    res.status(201).json({ message: "Đã thêm/cập nhật giỏ hàng" });
  } catch (error) {
    console.error(error);
    // Kiểm tra xem có phải lỗi khóa ngoại (sản phẩm không tồn tại) không
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(404).json({ message: "Sản phẩm không tồn tại." });
    }
    res.status(500).json({ message: "Lỗi server khi thêm vào giỏ hàng" });
  }
};

// 3. Logic cho PUT /api/cart/update/:itemId
// Cập nhật số lượng của một món hàng cụ thể (thay thế, không cộng dồn)
let updateCartItem = async (req, res) => {
  const userId = req.user.id;
  const { itemId } = req.params; // ID của hàng trong cart_items
  const { quantity } = req.body; // Số lượng MỚI

  if (!quantity || quantity <= 0) {
    return res.status(400).json({
      message: "Số lượng phải lớn hơn 0. (Nếu muốn xóa, hãy dùng API xóa)",
    });
  }

  try {
    // Cập nhật số lượng
    // Thêm "AND user_id = ?" để đảm bảo user này chỉ sửa được item của chính họ
    const [result] = await db.query(
      "UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?",
      [quantity, itemId, userId]
    );

    // Kiểm tra xem có hàng nào được cập nhật không
    if (result.affectedRows === 0) {
      return res.status(404).json({
        message:
          "Không tìm thấy mặt hàng trong giỏ hoặc bạn không có quyền sửa nó.",
      });
    }

    res.status(200).json({ message: "Cập nhật số lượng thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server khi cập nhật giỏ hàng" });
  }
};

// 4. Logic cho DELETE /api/cart/remove/:itemId
// Xóa một món hàng khỏi giỏ
let removeCartItem = async (req, res) => {
  const userId = req.user.id;
  const { itemId } = req.params; // ID của hàng trong cart_items

  try {
    // Thêm "AND user_id = ?" để đảm bảo user chỉ xóa được item của chính họ
    const [result] = await db.query(
      "DELETE FROM cart_items WHERE id = ? AND user_id = ?",
      [itemId, userId]
    );

    // Kiểm tra xem có hàng nào bị xóa không
    if (result.affectedRows === 0) {
      return res.status(404).json({
        message:
          "Không tìm thấy mặt hàng trong giỏ hoặc bạn không có quyền xóa nó.",
      });
    }

    res.status(200).json({ message: "Đã xóa khỏi giỏ hàng" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server khi xóa khỏi giỏ hàng" });
  }
};

export { getCart, addToCart, updateCartItem, removeCartItem };
