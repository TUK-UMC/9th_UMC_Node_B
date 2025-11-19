import { bodyToStore, responseFromStore } from "../dtos/store.dto.js"; 
import { addStore } from "../services/store.service.js";
import { BadRequestError } from "../errors/systemErrors.js";

// 가게 추가
export const handleAddStore = async (req, res, next) => {
  /*
    #swagger.summary = '가게 추가 API'
    #swagger.description = '신규 가게를 등록합니다.'
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              store_name: { type: "string", example: "맛집 이름" },
              region_name: { type: "string", example: "서울" },
              address: { type: "string", example: "서울시 강남구 강남대로 123" },
              description: { type: "string", example: "이 가게는 정말 맛있어요!" }
            },
            required: ["store_name", "region_name", "address"]
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: "가게 등록 성공",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              success: {
                type: "object",
                properties: {
                  id: { type: "number" },
                  store_name: { type: "string" },
                  region_name: { type: "string" },
                  address: { type: "string" },
                  description: { type: "string", nullable: true }
                }
              }
            }
          }
        }
      }
    }
    #swagger.responses[400] = {
      description: "필수 값 누락 또는 잘못된 요청",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "S001" },
                  reason: { type: "string", example: "name, region_name, address는 필수입니다." },
                  data: { type: "object", nullable: true }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    }
  */
  try {
    console.log("가게 추가 요청:", req.body);

    if (!req.body.store_name || !req.body.region_name || !req.body.address) {
      throw new BadRequestError("name, region_name, address는 필수입니다.");
    }

    const storeDTO = bodyToStore(req.body);
    const store = await addStore(storeDTO);

    res.success(responseFromStore(store));
    
  } catch (err) {
    next(err);
  }
};
