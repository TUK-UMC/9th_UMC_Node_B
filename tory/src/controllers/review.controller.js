import { StatusCodes } from "http-status-codes";
import { bodyToReview } from "../dtos/review.dto.js";
import { addReview, listUserReviews } from "../services/review.service.js";
import { NotFoundError } from "../errors/systemErrors.js";

export const handleAddReview = async (req, res, next) => {
  /*
    #swagger.summary = '사용자 리뷰 목록 조회 API';
    #swagger.parameters[0] = {
      in: "path",
      name: "prefix",
      required: true,
      description: "경로에 포함되는 접두사",
      schema: { type: "string" }
    };
    #swagger.parameters[1] = {
      in: "path",
      name: "userId",
      required: true,
      description: "리뷰를 조회할 사용자의 ID",
      schema: { type: "string" }
    };
    #swagger.parameters[2] = {
      in: "query",
      name: "cursor",
      required: false,
      description: "페이징을 위한 커서 값",
      schema: { type: "string" }
    };
    #swagger.responses[200] = {
      description: "사용자 리뷰 목록 조회 성공",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    review_id: { type: "number" },
                    content: { type: "string" }
                  }
                }
              },
              pagination: {
                type: "object",
                properties: {
                  cursor: { type: "string", nullable: true }
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "잘못된 요청 (예: 잘못된 사용자 ID 형식)",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string", example: "Invalid userId format" }
            }
          }
        }
      }
    };
    #swagger.responses[404] = {
      description: "사용자 찾을 수 없음",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string", example: "User not found" }
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
    const storeId = Number(req.params.storeId);
    console.log(`Review 요청 storeId: ${storeId}`);

    if (!storeId) throw new NotFoundError("storeId 값이 존재하지 않습니다!");

    const reviewDTO = bodyToReview(req.body, storeId);
    const review = await addReview(reviewDTO);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "리뷰가 성공적으로 등록되었습니다.",
      data: review,
    });
  } catch (err) {
    next(err);
  }
};

export const handleListUserReviews = async (req, res, next) => {
  /*
    #swagger.summary = '사용자 리뷰 목록 조회 API';
    #swagger.parameters[0] = {
      in: "path",
      name: "prefix",
      required: true,
      description: "경로에 포함되는 접두사",
      schema: { type: "string" }
    };
    #swagger.parameters[1] = {
      in: "path",
      name: "userId",
      required: true,
      description: "리뷰를 조회할 사용자의 ID",
      schema: { type: "string" }
    };
    #swagger.parameters[2] = {
      in: "query",
      name: "cursor",
      required: false,
      description: "페이징을 위한 커서 값",
      schema: { type: "string" }
    };
    #swagger.responses[200] = {
      description: "사용자 리뷰 목록 조회 성공",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    review_id: { type: "number" },
                    content: { type: "string" }
                  }
                }
              },
              pagination: {
                type: "object",
                properties: {
                  cursor: { type: "string", nullable: true }
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "잘못된 요청 (예: 잘못된 사용자 ID 형식)",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string", example: "Invalid userId format" }
            }
          }
        }
      }
    };
    #swagger.responses[404] = {
      description: "사용자 찾을 수 없음",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string", example: "User not found" }
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
    const userId = parseInt(req.params.userId);
    const cursor = typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0;

    const reviews = await listUserReviews(userId, cursor);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "리뷰 목록 조회 성공",
      data: reviews,
    });
  } catch (err) {
    next(err);
  }
};