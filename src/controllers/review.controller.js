import { bodyToReview, responseFromReview, responseFromReviews } from "../dtos/review.dto.js";
import { addReview, listUserReviews, listStoreReviews } from "../services/review.service.js";
import { NotFoundError } from "../errors/systemErrors.js";

// 리뷰 추가
export const handleAddReview = async (req, res, next) => {
  /*
    #swagger.summary = '리뷰 추가 API'
    #swagger.description = '특정 가게에 리뷰를 작성합니다.'
    #swagger.parameters['storeId'] = { description: '가게 ID', in: 'path', required: true, type: 'integer' }
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              content: { type: "string", example: "정말 맛있어요!" },
              rating: { type: "number", example: 5 }
            },
            required: ["content", "rating"]
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: "리뷰 추가 성공",
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
                  store_id: { type: "number" },
                  user_id: { type: "number" },
                  content: { type: "string" },
                  rating: { type: "number" }
                }
              }
            }
          }
        }
      }
    }
    #swagger.responses[400] = {
      description: "가게 ID 없거나 잘못된 요청",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "R001" },
                  reason: { type: "string", example: "storeId 값이 존재하지 않습니다!" },
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
    const storeId = Number(req.params.storeId);
    if (!storeId) {
      throw new NotFoundError("storeId 값이 존재하지 않습니다!");
    }

    const reviewDTO = bodyToReview(req.body, storeId);
    const review = await addReview(reviewDTO);

    res.success(responseFromReview(review));
    
  } catch (err) {
    next(err);
  }
};

// 사용자 리뷰 목록 조회
export const handleListUserReviews = async (req, res, next) => {
  /*
    #swagger.summary = '사용자 리뷰 목록 조회 API'
    #swagger.description = '사용자가 작성한 리뷰 목록을 조회합니다. cursor 기반 페이징 지원.'
    #swagger.parameters['userId'] = { description: '사용자 ID', in: 'path', required: true, type: 'integer' }
    #swagger.parameters['cursor'] = { description: '마지막으로 조회한 리뷰 ID. 0이면 첫 페이지', in: 'query', required: false, type: 'integer' }
    #swagger.responses[200] = {
      description: "사용자 리뷰 목록 조회 성공",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              success: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "number" },
                    store: { type: "object", properties: { id: { type: "number" }, name: { type: "string" } } },
                    content: { type: "string" },
                    rating: { type: "number" }
                  }
                }
              }
            }
          }
        }
      }
    }
  */
  try {
    const userId = parseInt(req.params.userId);
    const cursor = typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0;
    
    const reviews = await listUserReviews(userId, cursor);
    
    res.success(responseFromReviews(reviews));
    
  } catch (err) {
    next(err);
  }
};

// 가게 리뷰 목록 조회
export const handleListStoreReviews = async (req, res, next) => {
  /*
    #swagger.summary = '상점 리뷰 목록 조회 API'
    #swagger.description = '특정 가게의 리뷰 목록을 조회합니다. cursor 기반 페이징 지원.'
    #swagger.parameters['storeId'] = { description: '가게 ID', in: 'path', required: true, type: 'integer' }
    #swagger.parameters['cursor'] = { description: '마지막으로 조회한 리뷰 ID. 0이면 첫 페이지', in: 'query', required: false, type: 'integer' }
    #swagger.responses[200] = {
      description: "가게 리뷰 목록 조회 성공",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              success: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "number" },
                    user: { type: "object", properties: { id: { type: "number" }, email: { type: "string" }, name: { type: "string" } } },
                    content: { type: "string" },
                    rating: { type: "number" }
                  }
                }
              }
            }
          }
        }
      }
    }
  */
  try {
    const storeId = parseInt(req.params.storeId);
    const cursor = typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0;

    const reviews = await listStoreReviews(storeId, cursor);

    res.success(responseFromReviews(reviews));

  } catch (err) {
    next(err);
  }
};
