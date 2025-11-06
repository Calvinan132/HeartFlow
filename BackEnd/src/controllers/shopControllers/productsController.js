import db from "../../config/db.js";

let getAllProducts = async (req, res) => {
  try {
    const [rows] = await db.execute("select * from products ");
    res.json({ success: true, data: rows });
  } catch (e) {
    console.log("Lỗi từ backend: ", e.message);
  }
};

let getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.json({ message: "Không tìm thấy sản phẩm" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server khi lấy chi tiết sản phẩm" });
  }
};

let getAllCategories = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM categories");
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server khi lấy danh mục" });
  }
};

let getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM Products WHERE category_id = ?",
      [categoryId]
    );

    // Trả về mảng sản phẩm (có thể rỗng nếu danh mục không có sản phẩm)
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server khi lọc sản phẩm" });
  }
};

export {
  getAllProducts,
  getProductById,
  getAllCategories,
  getProductsByCategory,
};
