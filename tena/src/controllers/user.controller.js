// user.controller.js
import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { addUser } from "../services/user.service.js";  // ← userSignUp 대신 addUser 사용

export const handleUserSignUp = async (req, res, next) => {
  try {
    console.log("회원가입을 요청했습니다!");
    console.log("body:", req.body);
    
    const user = await addUser(bodyToUser(req.body));  // ← 여기도 addUser
    
    res.status(StatusCodes.OK).json({
      resultType: "SUCCESS",
      error: null,
      success: user,
    });
  } catch (err) {
    next(err);
  }
};