import { pool } from "../db.config.js";

// 1️⃣ 미션 존재 여부 확인
export const isMissionExist = async (storeId, missionId) => {
  const [rows] = await pool.query(
    "SELECT COUNT(*) AS count FROM mission WHERE store_id = ? AND mission_id = ?",
    [storeId, missionId]
  );
  return rows[0].count > 0;
};

// 2️⃣ 이미 도전 중인지 확인
export const isAlreadyChallenged = async (userId, missionId) => {
  const [rows] = await pool.query(
    "SELECT COUNT(*) AS count FROM usermission WHERE user_id = ? AND mission_id = ? AND mission_status = 'ongoing'",
    [userId, missionId]
  );
  return rows[0].count > 0;
};

// 3️⃣ 새로운 도전 추가
export const insertUserMission = async (userId, missionId, storeId) => {
  const [result] = await pool.query(
    `
    INSERT INTO usermission (
      user_id, mission_id, store_id, mission_status,
      started_at, success_flag, created_at, updated_at
    )
    VALUES (?, ?, ?, 'ongoing', NOW(), 0, NOW(), NOW())
    `,
    [userId, missionId, storeId]
  );
  return result.insertId;
};