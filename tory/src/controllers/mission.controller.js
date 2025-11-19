import { StatusCodes } from "http-status-codes";
import { addMission, listStoreMissions } from "../services/mission.service.js";
import { bodyToMission } from "../dtos/mission.dto.js";
import { NotFoundError } from "../errors/systemErrors.js";

export const handleAddMission = async (req, res, next) => {
  /*
    #swagger.summary = '상점 미션 등록 API';
    #swagger.parameters[0] = {
      in: "path",
      name: "prefix",
      required: true,
      description: "경로에 포함되는 접두사",
      schema: { type: "string" }
    };
    #swagger.parameters[1] = {
      in: "path",
      name: "storeId",
      required: true,
      description: "미션을 추가할 상점의 ID",
      schema: { type: "string" }
    };
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              title: { type: "string" },
              description: { type: "string" },
              reward: { type: "number" }
            }
          }
        }
      }
    };
    #swagger.responses[201] = {
      description: "상점 미션 등록 성공 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              message: { type: "string", example: "Mission created successfully" },
              data: {
                type: "object",
                properties: {
                  mission_id: { type: "number" },
                  title: { type: "string" },
                  description: { type: "string" },
                  reward: { type: "number" }
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "잘못된 요청 (예: 필수 필드 누락)",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string", example: "Missing required fields: title, description, reward" }
            }
          }
        }
      }
    };
    #swagger.responses[404] = {
      description: "상점 찾을 수 없음 (존재하지 않는 상점 ID)",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string", example: "Store not found" }
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
    console.log(`Mission 요청 storeId: ${storeId}`);

    if (!storeId) throw new NotFoundError("storeId 값이 존재하지 않습니다!");

    const missionDTO = bodyToMission(req.body, storeId);
    const mission = await addMission(missionDTO);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "미션이 성공적으로 추가되었습니다.",
      data: mission,
    });
  } catch (err) {
    next(err);
  }
};

// 특정 가게에서의 미션 조회
export const handleListStoreMissions = async (req, res, next) => {
  /*
    #swagger.summary = '상점 미션 목록 조회 API';
    #swagger.parameters[0] = {
      in: "path",
      name: "prefix",
      required: true,
      description: "경로에 포함되는 접두사",
      schema: { type: "string" }
    };
    #swagger.parameters[1] = {
      in: "path",
      name: "storeId",
      required: true,
      description: "미션을 조회할 상점의 ID",
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
      description: "상점 미션 목록 조회 성공",
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
                    mission_id: { type: "number" },
                    title: { type: "string" },
                    description: { type: "string" },
                    reward: { type: "number" }
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
      description: "잘못된 요청 (예: 잘못된 상점 ID 형식)",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string", example: "Invalid storeId format" }
            }
          }
        }
      }
    };
    #swagger.responses[404] = {
      description: "상점을 찾을 수 없음",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string", example: "Store not found" }
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
    const storeId = parseInt(req.params.storeId);
    const cursor = typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0;

    const missions = await listStoreMissions(storeId, cursor);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "미션 목록 조회 성공",
      data: missions,
    });
  } catch (err) {
    next(err);
  }
};