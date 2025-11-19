import { StatusCodes } from "http-status-codes";
import { bodyToStore } from "../dtos/store.dto.js";
import { addStore } from "../services/store.service.js";
import { RequestError } from "../errors/systemErrors.js";

export const handleAddStore = async (req, res, next) => {
  /*
    #swagger.summary = '상점 등록 API';
    #swagger.parameters[0] = {
      in: "path",
      name: "prefix",
      required: true,
      description: "경로에 포함되는 접두사",
      schema: { type: "string" }
    };
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              store_name: { type: "string", description: "상점 이름" },
              region_name: { type: "string", description: "상점 위치 지역" },
              address: { type: "string", description: "상점 주소" }
            },
            required: ["store_name", "region_name", "address"]
          }
        }
      }
    };
    #swagger.responses[201] = {
      description: "상점 등록 성공 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              message: { type: "string", example: "Store registered successfully" },
              data: {
                type: "object",
                properties: {
                  store_id: { type: "number", description: "상점 ID" },
                  store_name: { type: "string", description: "상점 이름" },
                  region_name: { type: "string", description: "상점 위치 지역" },
                  address: { type: "string", description: "상점 주소" },
                  created_at: { type: "string", format: "date", description: "상점 생성일" }
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "잘못된 요청 오류 (필수 필드 누락 등)",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string", example: "Missing required fields: store_name, region_name, address" }
            }
          }
        }
      }
    };
    #swagger.responses[401] = {
      description: "인증 실패 (권한이 없는 경우)",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string", example: "Unauthorized access" }
            }
          }
        }
      }
    };
    #swagger.responses[500] = {
      description: "서버 오류 (예: 데이터베이스 문제)",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string", example: "Internal server error" }
            }
          }
        }
      }
    };
*/
  try {
    console.log("가게 추가 요청:", req.body);

    if (!req.body.store_name || !req.body.region_name || !req.body.address) {
      throw new RequestError("store_name, region_name, address는 필수 입니다.");
    }

    const storeDTO = bodyToStore(req.body);
    const store = await addStore(storeDTO);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "가게가 성공적으로 등록되었습니다.",
      data: store,
    });
  } catch (err) {
    next(err);
  }
};