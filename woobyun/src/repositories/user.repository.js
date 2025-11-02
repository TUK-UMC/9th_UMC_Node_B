/*
1. 이메일이 유니크한 값이라면 추가로 이메일 중복 체크하지 않아도 된다.
-> 이미 존재한다면 에러를 뱉어낼 거라서 그 부분만 catch해서 에러 throw 해주는 로직만 추가해주시면 될 것 같다.
*/

import { pool } from "../db.config.js";

export const addUserToDB = async (data) => {
  try{
    const [result] = await pool.query(
      `INSERT INTO users (
        user_name, gender, birthdate, address, phone,
        social_provider, social_id, password, point_balance,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, NOW(), NOW())`,
        [
        data.user_name,
        data.gender,
        data.birthdate,
        data.address,
        data.phone,
        data.social_provider,
        data.social_id,
        data.password,
      ]
    );

    return result.insertId;
  } catch(err){
    if(err.code === "ER_USER_ENTRY"){
      throw new Error("이미 존재하는 사용자입니다.");
    }
    throw err;
  }
};