import { pool } from "../db.config.js";

// 가게 존재 여부 확인
export const isStoreExist = async (storeId) => {
  const [rows] = await pool.query(`SELECT COUNT(*) AS cnt FROM store WHERE store_id = ?`, [storeId]);
  return rows[0].cnt > 0;
};

// 미션 추가
export const insertMission = async (storeId, data) => {
  const [result] = await pool.query(
    `INSERT INTO mission (store_id, title, owner_code, description, reward_point, expire_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [storeId, data.title, data.owner_code, data.description, data.reward_point, data.expire_at]
  );

  return result.insertId;
};