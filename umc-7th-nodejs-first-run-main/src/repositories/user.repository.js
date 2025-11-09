/*
1. 이메일이 유니크한 값이라면 추가로 이메일 중복 체크하지 않아도 된다.
-> 이미 존재한다면 에러를 뱉어낼 거라서 그 부분만 catch해서 에러 throw 해주는 로직만 추가해주시면 될 것 같다.
*/

import { prisma } from "../db.config.js";

export const addUserToDB = async (data) => {
  try{
    const createdUser = await prisma.users.create({
      data: {
        user_name: data.user_name,
        gender: data.gender,
        birthdate: new Date(data.birthdate),
        address: data.address,
        phone: data.phone,
        social_provider: data.social_provider,
        social_id: data.social_id,
        password: data.password,
        point_balance: data.point_balance || 0,
      }
    });

    return createdUser;
  } catch(err){
    if(err.code === "P2002"){
      throw new Error("이미 존재하는 사용자입니다.");
    }
    throw err;
  }
};