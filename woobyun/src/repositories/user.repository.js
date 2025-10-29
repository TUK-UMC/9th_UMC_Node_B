import { pool } from "../db.config.js";

// 회원 추가
export const addUser = async (data) => {
  const conn = await pool.getConnection();

  try {
    const [result] = await conn.query(
      `INSERT INTO users 
      (user_name, password, gender, birthdate, address, phone, social_provider, social_id, point_balance, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW());`,
      [
        data.user_name,
        data.password,
        data.gender,
        data.birthdate,
        data.address,
        data.phone,
        data.social_provider,
        data.social_id,
        data.point_balance,
      ]
    );
    return result.insertId;
  } catch (err) {
    console.error("DB Error in addUser:", err);
    throw new Error("유저 추가 중 오류가 발생했습니다.");
  } finally {
    conn.release();
  }
};

// 이메일 중복 체크
export const isExistSocialId = async (social_id) => {
  const [rows] = await pool.query(
    `SELECT EXISTS(SELECT 1 FROM users WHERE social_id = ?) AS isExist;`,
    [social_id]
  );
  return rows[0].isExist;
};
