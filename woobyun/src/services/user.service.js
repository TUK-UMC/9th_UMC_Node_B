import bcrypt from "bcrypt";
import { addUser, isExistSocialId } from "../repositories/user.repository.js";
import { responseFromUser } from "../dtos/user.dto.js";

export const userSignUp = async (data) => {
  // 소셜 ID 중복 확인
  const exist = await isExistSocialId(data.social_id);
  if (exist) throw new Error("이미 존재하는 소셜 계정입니다.");

  // 비밀번호 해싱
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(data.password, saltRounds);

  // 유저 추가
  const userId = await addUser({ ...data, password: hashedPassword });

  return responseFromUser({ user_id: userId, ...data });
};
