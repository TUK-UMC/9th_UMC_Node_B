import { prisma } from "../db.config.js";

export const addUserToDB = async (data) => {
  return prisma.users.create({
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
};

//중복된 사용자가 있는지 확인
export const findUserById = async (social_provider, social_id) => {
  return prisma.users.findUnique({
    where: {
      social_provider_social_id:{
        social_provider,
        social_id,
      },
    },
  });
};