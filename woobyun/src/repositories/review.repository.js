import { pool } from "../db.config.js";
//가게 존재 여부 확인
export const isStoreExist = async (data) => {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS cnt FROM store WHERE store_id = ?`,
    [data.store_id]
  );
  return rows[0].cnt > 0;
};

//리뷰 추가
export const addReviewToDB = async (data) => {
  const [result] = await pool.query(
    "INSERT INTO review (store_id, user_id, rating, content, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW());",
    [
      data.store_id,  
      data.user_id, 
      data.rating, 
      data.content
    ]
  );
  return result.insertId;
};
