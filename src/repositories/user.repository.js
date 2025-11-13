// user.repository.js
import { prisma } from "../db.config.js";

export const addUserToDB = async (data) => {
  try {
    const createdUser = await prisma.user.create({  // ← users → user
      data: {
        email: data.email,              // ← 추가
        name: data.name,                // ← user_name → name
        gender: data.gender,
        birth: new Date(data.birth),    // ← birthdate → birth
        address: data.address,
        detailAddress: data.detailAddress,  // ← 추가
        phoneNumber: data.phoneNumber,  // ← phone → phoneNumber
      }
    });

    return createdUser;
  } catch (err) {
    if (err.code === "P2002") {
      throw new Error("이미 존재하는 이메일입니다.");
    }
    throw err;
  }
};