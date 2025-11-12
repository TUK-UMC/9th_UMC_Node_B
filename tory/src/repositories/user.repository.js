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