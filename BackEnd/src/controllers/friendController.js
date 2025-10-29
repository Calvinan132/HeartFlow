import db from "../config/db.js";

let request = async (req, res) => {
  // ID của người gửi (lấy từ token sau khi xác thực)

  const senderId = req.user.id;
  const { receiverId } = req.body;

  if (!receiverId || senderId == receiverId) {
    return res.status(400).json({ message: "ID người nhận không hợp lệ." });
  }

  try {
    // 1. Kiểm tra xem mối quan hệ đã tồn tại chưa (PENDING hoặc ACCEPTED)
    const [existing] = await db.execute(
      `SELECT * FROM friend_requests 
             WHERE (sender_id = ? AND receiver_id = ?) 
                OR (sender_id = ? AND receiver_id = ?)`,
      [senderId, receiverId, receiverId, senderId]
    );

    if (existing.length > 0) {
      const status = existing[0].status;
      if (status === "ACCEPTED") {
        return res.json({ message: "Hai bạn đã là bạn bè." });
      }
      if (status === "PENDING") {
        // Có thể là yêu cầu đã được gửi trước đó, hoặc người kia gửi cho mình
        return res.json({
          message: "Yêu cầu đã được gửi hoặc đang chờ phản hồi.",
        });
      }
    }

    // 2. Chèn yêu cầu mới vào database với trạng thái PENDING
    await db.execute(
      `INSERT INTO friend_requests (sender_id, receiver_id, status) 
              VALUES (?, ?, 'PENDING')`,
      [senderId, receiverId]
    );

    // TODO: Gửi thông báo real-time qua Socket.IO tới receiverId

    res.status(201).json({ message: "Yêu cầu kết bạn đã được gửi." });
  } catch (err) {
    console.error("Lỗi gửi yêu cầu kết bạn:", err);
    res.status(500).json({ error: "Lỗi Server." });
  }
};

let response = async (req, res) => {
  // ID của người nhận (người chấp nhận/từ chối)
  const { id } = req.user;
  const receiverId = id;
  const { senderId, action } = req.body; // action: 'accept' hoặc 'reject'

  if (!senderId || !["accept", "reject"].includes(action)) {
    return res
      .status(400)
      .json({ message: "Thiếu thông tin hoặc hành động không hợp lệ." });
  }

  try {
    let result;
    let successMessage;

    if (action === "accept") {
      // Nếu chấp nhận, cập nhật trạng thái thành 'ACCEPTED'
      [result] = await db.execute(
        `UPDATE friend_requests 
         SET status = 'ACCEPTED' 
         WHERE sender_id = ? AND receiver_id = ? AND status = 'PENDING'`,
        [senderId, receiverId]
      );
      successMessage = "Đã chấp nhận yêu cầu kết bạn.";
    } else {
      // action === 'reject'
      // Nếu từ chối, xóa yêu cầu khỏi bảng
      [result] = await db.execute(
        `DELETE FROM friend_requests 
         WHERE sender_id = ? AND receiver_id = ? AND status = 'PENDING'`,
        [senderId, receiverId]
      );
      successMessage = "Đã từ chối và xóa yêu cầu kết bạn.";
    }

    // Kiểm tra xem có dòng nào bị ảnh hưởng không (update hoặc delete)
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy yêu cầu đang chờ xử lý." });
    }

    // TODO: Gửi thông báo real-time cho người gửi (senderId)

    res.json({ message: successMessage });
  } catch (err) {
    console.error("Lỗi phản hồi yêu cầu:", err);
    res.status(500).json({ error: "Lỗi Server." });
  }
};

let listFriend = async (req, res) => {
  const { id } = req.user;
  const userId = id;

  try {
    const [friends] = await db.execute(
      `
SELECT 
    CASE 
        WHEN fr.sender_id = ? THEN fr.receiver_id 
        ELSE fr.sender_id 
    END AS friend_id,
    u.username,
    u.email,
    u.firstname, u.lastname,
    u.image_url,
    fr.updated_at AS befriended_since,
    fr.receiver_id 
FROM 
    friend_requests fr
    
JOIN 
    users u ON u.id = 
    CASE 
        WHEN fr.sender_id = ? THEN fr.receiver_id 
        ELSE fr.sender_id 
    END
    
WHERE 
    (fr.sender_id = ? OR fr.receiver_id = ?) AND fr.status = 'ACCEPTED'
    
ORDER BY 
    u.username ASC
            `,
      // Truyền userId 4 lần cho 4 dấu '?'
      [userId, userId, userId, userId]
    );

    res.json({ success: true, friends });
  } catch (err) {
    console.error("Lỗi khi lấy danh sách bạn bè:", err);
    res.status(500).json({ success: false, message: err });
  }
};

let pending = async (req, res) => {
  // Lấy tất cả các yêu cầu mà userId là người nhận VÀ trạng thái là PENDING
  const { id } = req.user;
  const receiverId = id;
  try {
    const [requests] = await db.execute(
      `SELECT fr.sender_id, u.username, u.image_url, fr.created_at, u.firstname, u.lastname
             FROM friend_requests fr
             JOIN users u ON u.id = fr.sender_id
             WHERE fr.receiver_id = ? AND fr.status = 'PENDING'
             ORDER BY fr.created_at DESC`,
      [receiverId]
    );

    res.json({ success: true, requests });
  } catch (err) {
    console.error("Lỗi khi lấy yêu cầu chờ:", err);
    res.status(500).json({ success: false, message: err });
  }
};

let pendingCheck = async (req, res) => {
  // Lấy tất cả các yêu cầu mà userId là người nhận VÀ trạng thái là PENDING
  const senderId = req.user.id;
  try {
    const [requests] = await db.execute(
      `SELECT fr.receiver_id, u.username, u.image_url, fr.created_at, u.firstname, u.lastname
             FROM friend_requests fr
             JOIN users u ON u.id = fr.receiver_id
             WHERE fr.sender_id = ? AND fr.status = 'PENDING'
             ORDER BY fr.created_at DESC`,
      [senderId]
    );

    res.json({ success: true, requests });
  } catch (err) {
    console.error("Lỗi khi lấy yêu cầu chờ:", err);
    res.status(500).json({ success: false, message: err });
  }
};

let unfriend = async (req, res) => {
  const senderId = req.user.id;
  const { Id } = req.body;
  console.log(req.body);
  if (!Id) {
    return res
      .status(400)
      .json({ success: false, message: "Thiếu ID người hủy kết bạn." });
  }
  if (senderId === Id) {
    return res.status(400).json({
      success: false,
      message: "Không thể hủy kết bạn với chính mình.",
    });
  }

  try {
    const sql = `
            DELETE FROM friend_requests 
            WHERE (
                (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
            )
            AND status = 'ACCEPTED'
        `;

    const [result] = await db.execute(sql, [senderId, Id, Id, senderId]);

    // Cần thêm logic gửi sự kiện Socket.IO real-time ở đây

    res.json({ success: true, message: "Hủy kết bạn thành công!" });
  } catch (e) {
    console.error("Lỗi hủy kết bạn:", e);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server khi hủy kết bạn." });
  }
};
export { request, response, listFriend, pending, unfriend, pendingCheck };
