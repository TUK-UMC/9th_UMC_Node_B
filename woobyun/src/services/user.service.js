import { addUserToDB } from "../repositories/user.repository.js";
import { responseFromUser } from "../dtos/user.dto.js";
import { ConflictError } from "../errors/systemErrors.js";
import { findUserById } from "../repositories/user.repository.js"

export const addUser = async (userDTO) => {
  const existingUser = await findUserById(
    userDTO.social_provider,
    userDTO.social_id
  );
  if (existingUser) {
    throw new ConflictError("이미 존재하는 사용자입니다.");
  }

  //사용자 추가
  const createdUser = await addUserToDB(userDTO);
  //응답 데이터 반환 DTO
  return responseFromUser(createdUser);
};
