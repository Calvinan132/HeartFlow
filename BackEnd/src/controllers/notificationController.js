import db from "../config/db.js";

let getNotification = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(
      `SELECT n.*, CONVERT_TZ(time, 'UTC', '+7:00') as time,
              u.firstname, 
              u.lastname, 
              u.image_url AS senderAvatar
       FROM notifications n
       INNER JOIN users u ON n.sender_id = u.id
       WHERE n.user_id = ?
       ORDER BY n.time DESC`,
      [userId]
    );

    const notifications = rows.map((n) => ({
      senderName: `${n.firstname} ${n.lastname}`,
      senderAvatar: n.senderAvatar,
      type: n.type,
      time: n.time,
      message: n.message, // nếu có
      id: n.id,
    }));

    res.json({ success: true, data: notifications });
  } catch (e) {
    res.json({ success: false, message: "Lỗi backend: " + e });
  }
};

export { getNotification };
