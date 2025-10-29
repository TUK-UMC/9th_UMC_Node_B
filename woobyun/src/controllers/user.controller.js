import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp } from "../services/user.service.js";

export const handleUserSignUp = async (req, res) => {
  try {
    console.log("회원가입 요청 도착!");
    const userData = bodyToUser(req.body);
    const result = await userSignUp(userData);
    res.status(StatusCodes.OK).json({ result });
  } catch (err) {
    console.error("회원가입 중 오류:", err.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "회원가입 중 오류 발생", detail: err.message });
  }
};
