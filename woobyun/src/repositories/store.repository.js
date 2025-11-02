/*
1. 요청이 하나씩 들어올 거라서 getConnection은 사용하지 않아도 될 것 같아,
-> 이렇게 수정할 경우 finally까지 삭제 해주스면 될 것 같다.
*/

import { pool } from "../db.config.js";

export const addStoreToDB = async (data) => {
  const [result] = await pool.query(
    `INSERT INTO store( name, region_name, store_image_url, address, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,      [
      data.name,
      data.region_name,
      data.store_image_url,
      data.address,
      data.description,
    ]
  );
  return result.insertId
  
};
