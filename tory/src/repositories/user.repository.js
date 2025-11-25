import { prisma } from "../config/db.config.js";

//user.repository.js의 역할: 사용자 정보 업데이트로 변경
export const findUserByUserId = async(userId) => {
  return prisma.users.findUnique({
    where:{ user_id: userId },
  });
};
export const updateUserById = async (userId, data) => {
  return prisma.users.update({
    where: { user_id: userId },
    data: {
      user_name: data.user_name,
      gender: data.gender,
      birthdate: data.birthdate ? new Date(data.birthdate) : undefined,
      address: data.address,
      phone: data.phone,
    },
  });
};