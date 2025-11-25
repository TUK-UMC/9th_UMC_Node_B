/*※입력값 유효성 검증을 여기서 하는 방향으로※*/
import { StatusCodes } from "http-status-codes";
import { bodyToReview } from "../dtos/review.dto.js";
import { addReview } from "../services/review.service.js";
import { listUserReviews } from "../services/review.service.js";
import { CustomError } from "../errors/customError.js";
import { successHandler } from "../middlewares/successHandler.js";

/* 
[성공]
1. 리뷰 추가 성공(추가)
2. 사용자 리뷰 조회 성공(조회)
[에러]
1. 가게를 찾을 수 없을 때(추가)
2. 필수 입력 x -> 리뷰를 추가 할 때(추가)
3. 리뷰 등록 실패 (추가)
4. 해당 가게가 존재 하지 않을때(조회)
5. 리뷰가 아예 존재 하지 않을때(조회)
*/

//리뷰 추가
export const handleAddReview = async (req, res, next) => {
  /*
  #swagger.tags = ['stores']
  #swagger.summary = '리뷰 추가 API';

  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            user_id: { type: "number" },
            region_name: { type: "number" },
            content: { type: "string" },
          }
          required: ["user_id", "rating","content"] 
        }
      }
    }
  };

  #swagger.responses[201] = {
    description: "리뷰 추가 성공",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: "true" },
            code: { type: "number", example: 201 },
            message: { type: "string", example: "리뷰 추가 성공"},
            data: {
              type: "object",
              properties: {
                review_id: { type: "number" },
                store_id: { type: "number" },
                user_id: { type: "number" },
                rating: { type: "number" },
                content: { type: "string" },
                description: { type: "string" },
                created_at: { type: "string", format: "date-time" },
                updated_at: { type: "string", format: "date-time" },
              }
            }
          }
        }
      }
    }
  };

  #swagger.responses[400] = {
    description: "리뷰 내용 등록 필요",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: false },
            code: { type: "number", example: 400 },
            message: { type: "string", example: "리뷰 내용 등록 필요"},
          }
        }
      }
    }
  };

  #swagger.responses[404] = {
    description: "가게를 찾을 수 없음",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: false },
            code: { type: "number", example: 404 },
            message: { type: "string", example: "해당 가게를 찾을 수 없습니다." }
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
            message: { type: "string"},
          }
        }
      }
    }
  };
*/
  try {
    const storeId = Number(req.params.storeId);    
    //가게가 존재하는지 검증
    if(!storeId || isNaN(storeId)){
      throw new CustomError(StatusCodes.BAD_REQUEST, "유효한 storeId가 필요.");
    }
    
    //유효한 입력값 검증
    const {rating, content} = req.body;
    if(!content || content.trim().length === 0 || !rating || isNaN(rating) ){
      throw new CustomError(StatusCodes.BAD_REQUEST, "리뷰와 별점 등록은 필수 입니다.");
    }

    //DTO 변환
    const reviewDTO = bodyToReview(req.body, storeId);
    //서비스 호출
    const review = await addReview(reviewDTO);

    return successHandler(
      res, 
      StatusCodes.CREATED, 
      "리뷰가 성공적으로 추가되었습니다.", 
      review
    );

  } catch (err) {
    next(err);
  }
};

//사용자의 리뷰 목록 조회
export const handleListUserReviews = async (req, res, next) => {
  /*
  #swagger.tags = ['users']
  #swagger.summary = '리뷰 목록 조회 API'

  #swagger.parameters['userId'] = {
    in: 'path',
    required: true,
    description: '리뷰를 조회할 userId',
    schema: { type: "number" }
  }

  #swagger.parameters['cursor'] = {
    in: 'query',
    required: false,
    description: '페이지네이션용 커서',
    schema: { type: "number", example: 10 }
  }

  #swagger.responses[200] = {
    description: "리뷰 목록 조회 성공",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: true },
            code: { type: "number", example: 200 },
            message: { type: "string", example: "리뷰 목록 조회 성공"},
            data:{
              type: "object",
              properties: {
                data:{
                  type: "array",
                  description: "리뷰 목록",
                  items: {
                    type: "object",
                    properties: {
                      review_id: { type: "number" },
                      content: {type: "string"},
                      rating: {type: "number"},
                      created_at: {type: "string", format: "date-time"},

                      store:{
                        type: "object",
                        properties:{
                          store_id: { type: "number"},
                          store_name: { type: "string"},
                        }
                      }
                    }
                  }
                },
                pagination: {
                  type: "object",
                  properties: {
                    cursor: {type: "number"}
                  }
                }
              },
            },
          }
        }
      }
    }
  };
  #swagger.responses[404] = {
    description: "해당 사용자의 리뷰가 없음",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: false },
            code: { type: "number", example: 404 },
            message: { type: "string", example: "해당 사용자가 등록한 리뷰는 없습니다." }
          }
        }
      }
    }
  };
*/

  try{
    const userId = parseInt(req.params.userId);
    const cursor = typeof req.query.cursor === "string" ? parseInt(req.query.cursor): 0;
    
    const reviews = await listUserReviews(userId, cursor);
    
    return successHandler(
      res, 
      StatusCodes.OK, 
      "리뷰 목록 조회 성공", 
      reviews
    );

  }catch(err) {
    next(err);
  }
};