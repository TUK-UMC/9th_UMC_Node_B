import { addUser } from "../services/user.service.js";
import { responseFromUser } from "../dtos/user.dto.js";
import { CustomError } from "../errors/customError.js";

/**
 * 회원 가입 API
 * @route POST /api/v1/users/signup
 * 
 * #swagger.summary = '회원 가입 API'
 * #swagger.requestBody = {
 *   required: true,
 *   content: {
 *     "application/json": {
 *       schema: {
 *         type: "object",
 *         properties: {
 *           email: { type: "string", example: "test@example.com" },
 *           name: { type: "string", example: "홍길동" }
 *         }
 *       }
 *     }
 *   }
 * }
 * #swagger.responses[200] = {
 *   description: "회원 가입 성공 응답",
 *   content: {
 *     "application/json": {
 *       schema: {
 *         type: "object",
 *         properties: {
 *           resultType: { type: "string", example: "SUCCESS" },
 *           error: { type: "object", nullable: true, example: null },
 *           success: {
 *             type: "object",
 *             properties: {
 *               email: { type: "string", example: "test@example.com" },
 *               name: { type: "string", example: "홍길동" }
 *             }
 *           }
 *         }
 *       }
 *     }
 *   }
 * }
 * #swagger.responses[400] = {
 *   description: "회원 가입 실패 응답",
 *   content: {
 *     "application/json": {
 *       schema: {
 *         type: "object",
 *         properties: {
 *           resultType: { type: "string", example: "FAIL" },
 *           error: { type: "object", example: { errorCode: "U001", reason: "이메일 중복" } },
 *           success: { type: "object", nullable: true, example: null }
 *         }
 *       }
 *     }
 *   }
 * }
 */
export const handleUserSignUp = async (req, res, next) => {
  try {
    const userData = req.body;
    const newUser = await addUser(userData);
    res.success(responseFromUser(newUser));
  } catch (err) {
    next(err);
  }
};
