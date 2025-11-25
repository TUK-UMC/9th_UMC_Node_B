/*※입력값 유효성 검증을 여기서 하는 방향으로※*/
import { StatusCodes } from "http-status-codes";
import { bodyToStore } from "../dtos/store.dto.js";
import { addStore } from "../services/store.service.js";
import { NotFoundError } from "../errors/systemErrors.js";
import { successHandler } from "../middlewares/successHandler.js";

/* 
[성공]
1. 가게 등록 성공(추가)
[에러]
1. 필수 입력 x -> 가게를 추가 할 때(추가)
2. 이미 등록된 가게일 경우(추가)
3. 가게 등록에 실패할 경우
*/

export const handleAddStore = async (req, res, next) => {
/*
  #swagger.tags = ['stores']
  #swagger.summary = '가게 추가 API';
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            store_name: { type: "string" },
            region_name: { type: "string" },
            store_image_url: { type: "string" },
            address: { type: "string" },
            description: { type: "string" },
          }
        }
      }
    }
  };
  #swagger.responses[201] = {
    description: "가게 생성 성공",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: "true" },
            code: { type: "number", example: 201 },
            message: { type: "string", example: "가게 추가 성공"},
            data: {
              type: "object",
              properties: {
                store_id: { type: "number" },
                store_name: { type: "string" },
                region_name: { type: "string" },
                store_image_url: { type: "string" },
                address: { type: "string" },
                description: { type: "string" },
                created_at: { type: "string", format: "date-time" },
                updated_at: { type: "string", format: "date-time" },
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
            message: { type: "string", example: "store_name 입력 필요" }
          }
        }
      }
    }
  };

  #swagger.responses[500] = {
    description: "가게 등록 실패",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: false },
            code: { type: "number", example: 500 },
            message: { type: "string", example: "이미 등록된 가게 입니다"},
          }
        }
      }
    }
  };
*/
  try {
    //입력값 유효성 검증
    const {store_name, region_name, address} = req.body;
    if(!store_name || store_name.trim().length === 0){
      throw new NotFoundError(StatusCodes.BAD_REQUEST, "store_name 입력 필요");
    }
    if(!region_name || region_name.trim().length === 0){
      throw new NotFoundError(StatusCodes.BAD_REQUEST, "region_name 입력 필요");
    }
    if(!address || address.trim().length === 0){
      throw new NotFoundError(StatusCodes.BAD_REQUEST, "address 입력 필요");
    }

    //DTO 변환
    const storeDTO = bodyToStore(req.body);
    const store = await addStore(storeDTO);

    return successHandler(
      res, 
      StatusCodes.CREATED, 
      `store_id: ${store.store_id} 가게 등록 성공`, 
      store
    );
  } catch (err) {//에러가 발생했을 때 실행되는 부분
    next(err);
  }
};
