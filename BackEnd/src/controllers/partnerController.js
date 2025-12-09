import db from "../config/db.js";
import { getIO } from "../config/socket.js";

let request = async (req, res) => {
  const senderId = req.user.id;
  const receiverId = req.body.Id;

  console.log(senderId, receiverId);

  if (!receiverId || senderId == receiverId) {
    return res.status(400).json({ message: "ID người nhận không hợp lệ." });
  }

  try {
    const [existing] = await db.execute(
      `SELECT * FROM partner_requests 
             WHERE (sender_id = ? AND receiver_id = ?) 
                OR (sender_id = ? AND receiver_id = ?)`,
      [senderId, receiverId, receiverId, senderId]
    );

    if (existing.length > 0) {
      const status = existing[0].status;
      if (status === "ACCEPTED") {
        return res.json({ message: "Hai bạn đã là tri kỷ." });
      }
      if (status === "PENDING") {
        // Có thể là yêu cầu đã được gửi trước đó, hoặc người kia gửi cho mình
        return res.json({
          message: "Yêu cầu đã được gửi hoặc đang chờ phản hồi.",
        });
      }
    }
    await db.execute(
      `INSERT INTO partner_requests (sender_id, receiver_id, status) 
             VALUES (?, ?, 'PENDING')`,
      [senderId, receiverId]
    );

    const [senderData] = await db.execute(
      "select lastname, firstname,image_url from users where id = ? ",
      [senderId]
    );
    const notificationData = {
      senderName: senderData[0].firstname + " " + senderData[0].lastname,
      senderAvatar: senderData[0].image_url,
      message: "Đã gửi lời mời làm đạo lữ với bạn.",
      type: "PARTNER_REQUEST",
      time: new Date().toISOString(),
    };
    const io = getIO();
    io.to(receiverId).emit("newNotification", notificationData);
    await db.execute(
      "insert into notifications (user_id, type,message,sender_id) values (?, ?, ?, ?)",
      [
        receiverId,
        "PARTNER_REQUEST",
        "Đã gửi lời mời làm đạo lữ với bạn.",
        senderId,
      ]
    );
  } catch (e) {
    res.json({ success: false, message: "Lỗi từ backend!" });
    console.log("Lỗi: ", e);
  }
};

let check = async (req, res) => {
  const id = req.user.id;
  try {
    const [data] = await db.execute(
      "select sender_id, firstname, lastname, image_url from partner_requests rq inner join users on users.id = rq.sender_id where receiver_id = ? and status = 'pending'",
      [id]
    );
    res.json({ success: true, data });
  } catch (e) {
    console.log("Lỗi từ backend:", e);
    res.status(500).json({ success: false, error: "Lỗi Server." });
  }
};

let response = async (req, res) => {
  const receiverId = req.user.id;
  const { senderId, action } = req.body;

  if (!senderId || !["accept", "reject"].includes(action)) {
    return res
      .status(400)
      .json({ message: "Thiếu thông tin hoặc hành động không hợp lệ." });
  }

  if (action === "reject") {
    try {
      const [result] = await db.execute(
        `DELETE FROM partner_requests 
                 WHERE sender_id = ? AND receiver_id = ? AND status = 'PENDING'`,
        [senderId, receiverId]
      );

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy yêu cầu đang chờ xử lý." });
      }

      return res.json({ message: "Đã từ chối yêu cầu." });
    } catch (err) {
      console.error("Lỗi từ chối yêu cầu:", err);
      return res.status(500).json({ error: "Lỗi Server." });
    }
  }

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    await connection.execute(`UPDATE users SET partner = ? WHERE id = ?`, [
      senderId,
      receiverId,
    ]);

    await connection.execute(`UPDATE users SET partner = ? WHERE id = ?`, [
      receiverId,
      senderId,
    ]);

    const [updateResult] = await connection.execute(
      `UPDATE partner_requests 
             SET status = 'accepted' 
             WHERE sender_id = ? AND receiver_id = ? AND status = 'PENDING'`,
      [senderId, receiverId]
    );

    if (updateResult.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({
        message: "Không tìm thấy yêu cầu đang chờ xử lý.",
      });
    }

    await connection.execute(
      `DELETE FROM partner_requests 
             WHERE (sender_id = ? OR receiver_id = ? OR sender_id = ? OR receiver_id = ?)
             AND status = 'pending'`,
      [senderId, receiverId, receiverId, senderId]
    );

    await connection.commit();

    res.json({ message: "Đã chấp nhận yêu cầu kết bạn." });
  } catch (err) {
    if (connection) {
      await connection.rollback();
    }
    console.error("Lỗi chấp nhận yêu cầu:", err);
    res.status(500).json({ error: "Lỗi Server." });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

let setDate = async (req, res) => {
  try {
    let { id } = req.user;
    let { loveDate, partner } = req.body;
    await db.execute(
      "update partner_requests set love_date = ? where sender_id = ? or sender_id = ?",
      [loveDate, id, partner]
    );
    res.json({
      success: true,
      message: "Cập nhật ngày yêu thành công.",
    });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: "Lỗi từ backend" });
  }
};

let loadDate = async (req, res) => {
  try {
    let { id } = req.user;
    let partner = req.params.partner;
    if (!id || !partner) {
      return res.json({
        success: false,
        message: "Thiếu ID người dùng hoặc đối tác.",
      });
    }
    let [date] = await db.execute(
      "select Date_format(love_date,'%Y-%m-%d') AS love_date, abs(datediff(love_date,now())) as loveDay from partner_requests where sender_id = ? or sender_id = ? ",
      [id, partner]
    );
    res.json({ success: true, date });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: "Lỗi từ backend" });
  }
};

let unLove = async (req, res) => {
  try {
    const userId = req.user.id;
    const { partnerId } = req.body;
    let [existing] = await db.execute(
      "select * from partner_requests where ((sender_id = ? and receiver_id = ?) or (sender_id = ? and receiver_id = ?)) and status = 'accepted'",
      [userId, partnerId, partnerId, userId]
    );
    if (!existing[0]) {
      return res.json({ success: false, message: "Bạn không có người yêu!!!" });
    }
    await db.execute(
      "delete from partner_requests where ((sender_id = ? and receiver_id = ?) or (sender_id = ? and receiver_id = ?)) and status = 'accepted'",
      [userId, partnerId, partnerId, userId]
    );
    res.json({ success: true, message: "Chia tay thành công!" });
  } catch (e) {
    res.json({ success: false, message: "Lỗi từ backend: " + e.message });
  }
};
export { request, check, response, setDate, loadDate, unLove };
