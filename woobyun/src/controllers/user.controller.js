/*※입력값 유효성 검증을 여기서 하는 방향으로※*/
import { StatusCodes } from "http-status-codes";
import { CustomError } from "../errors/customError.js";
import { successHandler } from "../middlewares/successHandler.js";
import { bodyToUserUpdate } from "../dtos/user.dto.js";
import { updateUserInfo  } from "../services/user.service.js";

//기존 회원가입 API -> 사용자 정보 업데이트로 수정함
//social_id로 로그인하면 아이디, 비밀번호는 가져옴 -> 간단한 회원 정보만 수정하는 방향으로 함
export const handleUserUpdate = async (req, res, next) => {
  try {
    //jwt에서 가져오기
    const userId = req.user.user_id;
    const body = req.body;

    //social_provider, social_id는 수정 불가능하게 설정
    if(body.social_provider || body.social_id){
      throw new CustomError(StatusCodes.BAD_REQUEST, "social 정보는 수정할 수 없습니다.");
    }

    //입력값 유효성 검증
    const {user_name, gender, birthdate, address, phone} = body;

    if (!user_name || user_name.trim() === 0 ) {
      throw new CustomError(StatusCodes.BAD_REQUEST, "user_name 입력 필요");
    }
    if (!gender) {
      throw new CustomError(StatusCodes.BAD_REQUEST, "gender 입력 필요");
    }
    if (!birthdate) {
      throw new CustomError(StatusCodes.BAD_REQUEST, "birhdate 입력 필요");
    }
    if (!address || address.trim() === 0 ) {
      throw new CustomError(StatusCodes.BAD_REQUEST, "address 입력 필요");
    }
    if (!phone || phone.trim() === 0 ) {
      throw new CustomError(StatusCodes.BAD_REQUEST, "phone 입력 필요");
    }

    // DTO 변환
    const updateDTO = bodyToUserUpdate(req.body);
    // 서비스 호출
    const updated = await updateUserInfo(userId, updateDTO);

    return successHandler(
      res, 
      StatusCodes.OK, 
      "사용자 정보 업데이트 성공", 
      updated
    );
  } catch (err) {
    next(err);
  }
  
};