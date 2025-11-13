import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { addUser } from "../services/user.service.js";

export const handleUserSignUp = async (req, res, next) => {
  try {
    console.log("사용자 회원가입 요청:", req.body);

    const userDTO = bodyToUser(req.body);
    const user = await addUser(userDTO);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: `user_id: ${user.user_id} 회원가입 성공`,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};