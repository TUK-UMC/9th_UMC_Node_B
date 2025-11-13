import { prisma } from "../db.config.js";
import { ConflictError, RequestError } from "../errors/systemErrors.js";

export const addUserToDB = async (data) => {
  //유저 등록시 필수 값 확인
  if (!data.user_name || !data.gender || !data.birthdate || !data.address || !data.phone || !data.password){
    throw new RequestError("user_name, gender, birthdate, address, phone, password는 필수 입력값입니다.");
  }
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
};

//중복된 사용자가 있는지 확인
export const findUserById = async (social_provider, social_id) => {
  return await prisma.users.findUnique({
    where: {
      social_provider_social_id:{
        social_provider,
        social_id,
      },
    },
  });
};