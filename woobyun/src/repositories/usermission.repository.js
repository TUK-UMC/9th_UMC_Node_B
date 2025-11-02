import { pool } from "../db.config.js";

//미션 존재 여부 확인
export const isMissionExist = async (data) => {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS count 
    FROM mission 
    WHERE store_id = ? 
    AND mission_id = ?`,
    [
      data.store_id,
      data.mission_id,
    ]
  );
  return rows[0].count > 0;
};

//이미 도전 중인지 확인
export const isAlreadyChallenged = async (data) => {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS count 
    FROM usermission 
    WHERE user_id = ? 
    AND mission_id = ? 
    AND mission_status = 'ongoing'`,
    [
      data.user_id,
      data.mission_id,
    ]
  );
  return rows[0].count > 0;
};

//새로운 도전 추가
export const addUserToDB = async (data) => {
  const [result] = await pool.query(
    `INSERT INTO usermission (
      user_id, 
      mission_id, 
      store_id, 
      mission_status,
      started_at, 
      success_flag, 
      created_at, 
      updated_at
    )
    VALUES (?, ?, ?, 'ongoing', NOW(), 0, NOW(), NOW())`,
    [
      data.user_id,
      data.mission_id,
      data.store_id,
    ]
  );
  return result.insertId;
};
