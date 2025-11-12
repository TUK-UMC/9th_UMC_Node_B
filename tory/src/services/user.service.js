import { addUserToDB } from "../repositories/user.repository.js";
import { responseFromUser } from "../dtos/user.dto.js";

export const addUser = async (userDTO) => {
  try{
    //사용자 추가
    const createdUser = await addUserToDB(userDTO);
    //응답 데이터 반환 DTO
    return responseFromUser(createdUser);
  }catch (err){
    if(err.code === "ERRx_USER_ENTRY"){
      throw new Error("이미 존재하는 사용자입니다.")
    }
    throw err;
  }

};