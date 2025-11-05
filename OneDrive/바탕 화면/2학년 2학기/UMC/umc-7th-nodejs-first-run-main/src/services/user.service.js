import { addUserToDB } from "../repositories/user.repository.js";
import { responseFromUser } from "../dtos/user.dto.js";

export const addUser = async (userDTO) => {

  //사용자 추가
  const userId = await addUserToDB(userDTO);
  if (!userId) throw new Error("사용자 등록에 실패했습니다.");

  //응답 데이터 반환 DTO
  return responseFromUser({user_id: userId, ...userDTO,});
};