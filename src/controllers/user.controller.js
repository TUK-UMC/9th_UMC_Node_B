import { addUser } from "../services/user.service.js";
import { responseFromUser } from "../dtos/user.dto.js";
import { CustomError } from "../errors/customError.js";

/**
 * 회원 가입 API
 * @route POST /api/v1/users/signup
 */
export const handleUserSignUp = async (req, res, next) => {
  /*
    #swagger.summary = '회원 가입 API';
    #swagger.requestBody = { ... }  // 위 코드와 동일하게 유지
    #swagger.responses[200] = { ... }
    #swagger.responses[400] = { ... }
  */
  try {
    const userData = req.body;

    // 실제 회원 생성 서비스 호출
    const newUser = await addUser(userData); // ← 여기 수정

    // 성공 시 반환
    res.success(responseFromUser(newUser));

  } catch (err) {
    next(err);
  }
};
