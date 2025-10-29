import { pool } from "../db.config.js";

//가게 존재 여부 확인
export const isStoreExist = async (storeId) => {
  const [rows] = await pool.query(
    "SELECT EXISTS(SELECT 1 FROM store WHERE store_id = ?) AS isExist;",
    [storeId]
  );
  return rows[0].isExist === 1;
};

//리뷰 추가
export const addReviewToDB = async (storeId, data) => {
  const [result] = await pool.query(
    "INSERT INTO review (store_id, user_id, rating, content, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW());",
    [storeId, data.user_id, data.rating, data.content]
  );
  return result.insertId;
};
