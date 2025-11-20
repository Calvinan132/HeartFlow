import db from "../../config/db.js";

let addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;
    const [existingCartItem] = await db.query(
      "SELECT * FROM cart WHERE user_id = ? AND product_id = ?",
      [userId, productId]
    );
    if (existingCartItem.length > 0) {
      const newQuantity = existingCartItem[0].quantity + parseInt(quantity);
      await db.query(
        "UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?",
        [newQuantity, userId, productId]
      );
      return res.json({
        success: true,
        message: "Cập nhật giỏ hàng thành công",
      });
    } else {
      await db.query(
        "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
        [userId, productId, quantity]
      );
      return res.json({
        success: true,
        message: "Thêm vào giỏ hàng thành công",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server khi thêm vào giỏ hàng" });
  }
};

let getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    let [cart] = db.execute("select * from cart where user_id = ? ", [userId]);
    res.json({ success: true, cart });
  } catch (e) {
    consolo.log("Lỗi từ frontend: ", e);
  }
};

export { addToCart, getCart };
