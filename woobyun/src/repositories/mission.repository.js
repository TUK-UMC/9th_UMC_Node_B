/*
1. DTO에서 storeId도 한번에 관리해준다면 미션 추가 로직에서 data만 받아오면 된다.
-> isStoreExist 는 data.storeId, 이런식 으로 꺼내올 수 있다.
 */

import { pool } from "../db.config.js";

// 가게 존재 여부 확인
export const isStoreExist = async (data) => {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS cnt FROM store WHERE store_id = ?`, 
    [data.store_id]);
  return rows[0].cnt > 0;
};

// 미션 추가
export const addMissionToDB = async (data) => {
  const [result] = await pool.query(
    `INSERT INTO mission (store_id, title, owner_code, description, reward_point, expire_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [
      data.store_id, 
      data.title, 
      data.owner_code, 
      data.description, 
      data.reward_point, 
      data.expire_at
    ]
  );

  return result.insertId;
};
