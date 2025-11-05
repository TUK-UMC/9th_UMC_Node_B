/*
1. 요청이 하나씩 들어올 거라서 getConnection은 사용하지 않아도 될 것 같아,
-> 이렇게 수정할 경우 finally까지 삭제 해주스면 될 것 같다.
*/

import { prisma } from "../db.config.js";

export const addStoreToDB = async (data) => {
  try{
    const createdStore = await prisma.store.create({
      data: {
        store_name: data.store_name,
        region_name: data.region_name,
        store_image_url: data.store_image_url || null,
        address: data.address,
        description: data.description || null,
      }
    });
    return createdStore;
  }catch (err){
    if(err.code === "P2003"){
      throw new Error("가게 추가에 오류가 있습니다.");
    }
    throw err;
  }
  
};
