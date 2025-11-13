import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Tạo connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || "heart",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const testConnection = async () => {
  try {
    const connection = await db.getConnection();
    console.log("✅ MySQL Connected successfully!");
    connection.release(); // trả connection về pool
  } catch (err) {
    console.error("❌ MySQL Connection failed:", err.message);
  }
};
export default db;
