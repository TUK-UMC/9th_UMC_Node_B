/*※DB 관련 에러처리 및 커스텀 에러 처리※*/
import { addUserToDB } from "../repositories/user.repository.js";
import { responseFromUser } from "../dtos/user.dto.js";
import { ConflictError } from "../errors/systemErrors.js";
import { findUserById } from "../repositories/user.repository.js"

export const addUser = async (userDTO) => {
  //사용자 중복 방지
  const existingUser = await findUserById(
    userDTO.social_provider,
    userDTO.social_id
  );
  if (existingUser) {
    throw new ConflictError("이미 존재하는 사용자입니다.");
  }

  //사용자 등록
  const createdUser = await addUserToDB(userDTO);
  if (!createdUser){ 
    throw new InternalServerError("사용자 등록 실패");
  }
  //응답 데이터 반환 DTO
  return responseFromUser(createdUser);
};