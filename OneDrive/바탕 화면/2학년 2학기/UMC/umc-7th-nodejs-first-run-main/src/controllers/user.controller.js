import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { addUser } from "../services/user.service.js";
import { RequestError } from "../errors/systemErrors.js";

export const handleUserSignUp = async (req, res, next) => {
  try {
    console.log("사용자 회원가입 요청:", req.body);

    //회원 가입 필수 요소 존재  여부 확인
    if (!req.body.user_name || !req.body.phone) throw new RequestError("필수 입력값이 누락되었습니다.");

    //DTO 변환
    const userDTO = bodyToUser(req.body)

    const user = await addUser(userDTO);

    res.status(StatusCodes.OK).json({ result: user });
  } catch (err) {//에러가 발생했을 때 실행되는 부분
    next(err);
  }
};