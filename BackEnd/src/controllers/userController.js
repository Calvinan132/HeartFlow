import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
let userRegister = async (req, res) => {
  try {
    const { username, password, email, lastname, firstname } = req.body;
    // const img = req.file;
    const [existingUser] = await db.query(
      "select * from users where username = ? or email = ?",
      [username, email]
    );
    if (existingUser.length !== 0)
      return res.status(400).json({ message: "Tài khoản đã tồn tại !" });

    // upload image to cloudinary
    // const imageUpload = await cloudinary.uploader.upload(img.path, {
    //   resource_type: "image",
    // });

    // const imgUrl = imageUpload.secure_url;

    let salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await db.query(
      "insert into users (username, password, email, lastname, firstname) value(?,?,?,?,?)",
      [username, hashedPassword, email, lastname, firstname]
    );
    console.log(result);
    res.status(201).json({ message: "Tạo tài khoản thành công !" });
  } catch (e) {
    console.log("Lỗi: ", e);
    res.status(500).json({ message: `Lỗi: ${e.message}` });
  }
};

let userLogin = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const [existingUser] = await db.query(
      "select * from users where username = ? ",
      [username]
    );
    if (existingUser.length === 0)
      return res.json({ success: false, message: "Tài khoản không tồn tại !" });

    let user = existingUser[0];

    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "Tài khoản hoặc mật khẩu không đúng !",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        partner: user.partner,
      },
      process.env.JWT_SECRET
      // { expiresIn: "1h" }
    );
    res.json({
      success: true,
      message: "Đăng nhập thành công!",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        partner: user.partner,
      },
    });
  } catch (e) {
    console.log("Lỗi: ", e);
    res.status(500).json({ success: false, message: `Lỗi: ${e.message}` });
  }
};

let loadUserData = async (req, res) => {
  try {
    const { id } = req.user;
    let profile = await db.query(
      "select id,username,email,partner from users where id = ? ",
      [id]
    );
    res.json({ success: true, profile });
  } catch (e) {
    console.log(e);
    res.json({ success: false });
  }
};

let getAllUser = async (req, res) => {
  try {
    let allUser = await db.execute(
      "select u1.id, u1.username, u1.email,u1.lastname, u1.firstname,u1.image_url,u2.lastname AS partner_lastname, u2.firstname AS partner_firstname,u2.image_url AS partner_image_url  from users u1 left join users u2 on u1.partner = u2.id"
    );
    res.json({ success: true, allUser });
  } catch (e) {
    console.log(e);
    res.json({ success: false });
  }
};

let getMemories = async (req, res) => {
  try {
    const { id } = req.user;
    console.log(id);
    let [memories] = await db.query(
      "SELECT MemoryId, title, content, DATE_FORMAT(created_at, '%Y-%m-%d') as created_at, user_id, partner_id FROM memories join users on user_id = id WHERE user_id = ? or partner = ?",
      [id, id]
    );

    res.json({ success: true, memories });
  } catch (e) {
    console.log(e);
    res.json({ success: false });
  }
};

let updateMemory = async (req, res) => {
  try {
    const memoryId = req.params.id;
    const { title, content, image_url, created_at } = req.body;
    const userId = req.user.id; // nếu bạn có JWT middleware

    if (!title && !content && !image_url && !created_at) {
      return res.status(400).json({
        success: false,
        message: "Không có dữ liệu nào để cập nhật!",
      });
    }

    // Kiểm tra memory có tồn tại không
    const [check] = await db.query(
      "SELECT * FROM memories WHERE MemoryId = ?",
      [memoryId]
    );

    if (check.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy kỷ niệm này!",
      });
    }

    // Cập nhật thông tin
    await db.query(
      `UPDATE memories 
       SET title = ?, content = ?, image_url = ?, created_at = ?
       WHERE MemoryId = ?`,
      [
        title || check[0].title,
        content || check[0].content,
        image_url || check[0].image_url,
        created_at || check[0].created_at,
        memoryId,
      ]
    );

    res.json({
      success: true,
      message: "Cập nhật kỷ niệm thành công!",
    });
  } catch (error) {
    console.error("Lỗi updateMemory:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật kỷ niệm.",
    });
  }
};

let addMemory = async (req, res) => {
  try {
    const { title, content, image_url, created_at } = req.body;
    const userId = req.user?.id;
    const partnerId = req.user?.partner;

    if (!title && !content && !image_url && !created_at) {
      return res.status(400).json({
        success: false,
        message: "Không có dữ liệu nào để cập nhật!",
      });
    }
    const [result] = await db.query(
      "insert into memories (user_id,partner_id,title, content, image_url, created_at) value (?,?,?,?,?,?)",
      [userId, partnerId, title, content, image_url, created_at]
    );

    console.log(result);
    res.json({ success: true, message: "Thêm memory thành công." });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e });
  }
};

let getMessage = async (req, res) => {
  const { userId, partnerId } = req.params;
  try {
    const [rows] = await db.execute(
      `SELECT * FROM messages 
       WHERE (sender_id=? AND receiver_id=?) 
          OR (sender_id=? AND receiver_id=?)
       ORDER BY created_at ASC`,
      [userId, partnerId, partnerId, userId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
export {
  userRegister,
  userLogin,
  loadUserData,
  getAllUser,
  getMemories,
  updateMemory,
  addMemory,
  getMessage,
};
