import { pool } from "../db.config.js";

export const addStoreToDB = async (data) => {
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(
      `INSERT INTO store 
        (name, region_name, store_image_url, address, description, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [
        data.name,
        data.region_name,
        data.store_image_url,
        data.address,
        data.description,
        data.created_at,
        data.updated_at,
      ]
    );

    return result.insertId;
  } catch (err) {
    console.error("❌ DB Error:", err);
    throw err;
  } finally {
    conn.release();
  }
};