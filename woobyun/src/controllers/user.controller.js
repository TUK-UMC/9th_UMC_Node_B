/*※입력값 유효성 검증을 여기서 하는 방향으로※*/
import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { addUser } from "../services/user.service.js";
import { CustomError } from "../errors/customError.js";
import { successHandler } from "../middlewares/successHandler.js";

/* 
[성공]
1. 사용자 등록 성공(추가)
[에러]
1. 필수 입력 x -> 사용자를 등록 할 때(추가)
2. 이미 등록된 사용자일 경우(추가)
3. 사용자 등록에 실패할 경우
*/

export const handleUserSignUp = async (req, res, next) => {
  /*
    #swagger.tags = ['users']
    #swagger.summary = '회원 가입 API';

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              user_name: { type: "string" },
              gender: { type: "string", enum: ["M", "F", "N"]},
              birthdate: { type: "string", format: "date" },
              phone: { type: "string" },
              social_provider: { type: "string", enum: ["kakao", "naver", "google", "apple"] },
              social_id: { type: "string" },
              password: { type: "string" },
            }
          }
        }
      }
    };
    #swagger.responses[200] = {
      description: "회원 가입 성공",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              isSuccess: { type: "boolean", example: "true" },
              code: { type: "number", example: 201 },
              mesage: { type: "string", example: "회원 가입 성공"},
              data: {
                type: "object",
                properties: {
                  user_id: { type: "number" },
                  user_name: { type: "string" },
                  gender: { type: "string" },
                  birthdate: { type: "string" },
                  address: { type: "string" },
                  phone: { type: "string" },
                  social_provider: { type: "string" },
                  social_id: { type: "string" },
                  point_balance: { type: "string" },
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "필수 값 누락",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              isSuccess: { type: "boolean", example: false },
              code: { type: "number", example: 400 },
              message: { type: "string", example: "user_name 입력 필요" }
            }
          }
        }
      }
    };
    #swagger.responses[409] = {
      description: "이미 등록된 사용자",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              isSuccess: { type: "boolean", example: false },
              code: { type: "number", example: 409 },
              message: { type: "string", example: "이미 존재하는 사용자입니다." }
            }
          }
        }
      }
    };

    #swagger.responses[500] = {
      description: "서버 내부 오류",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              isSuccess: { type: "boolean", example: false },
              code: { type: "number", example: 500 },
              messgae: { type: "string"}
            }
          }
        }
      }
    };
  */
  try {
    //입력값 유효성 검증
    const {user_name, gender, birthdate, address, phone} = req.body;
    if (!user_name || user_name.trim().length === 0) {
      throw new CustomError(StatusCodes.BAD_REQUEST, "user_name 입력 필요");
    }
    if (!gender) {
      throw new CustomError(StatusCodes.BAD_REQUEST, "gender 입력 필요");
    }
    if (!birthdate) {
      throw new CustomError(StatusCodes.BAD_REQUEST, "birhdate 입력 필요");
    }
    if (!address || address.trim().length === 0) {
      throw new CustomError(StatusCodes.BAD_REQUEST, "address 입력 필요");
    }
    if (!phone || phone.trim().length === 0) {
      throw new CustomError(StatusCodes.BAD_REQUEST, "phone 입력 필요");
    }
    //DTO 변환
    const userDTO = bodyToUser(req.body)
    const user = await addUser(userDTO); 

    return successHandler(
      res, 
      StatusCodes.CREATED, 
      "회원가입 성공", 
      user
    );
  } catch (err) {//에러가 발생했을 때 실행되는 부분
    next(err);
  }
  
};